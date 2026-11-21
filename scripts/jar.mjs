// Minimal jar (zip) writer using only Node.js built-ins, so that the theme jars
// can be produced on machines without a JVM.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        table[n] = c >>> 0;
    }
    return table;
})();

function crc32(buffer) {
    let crc = 0xffffffff;
    for (let i = 0; i < buffer.length; i++) {
        crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date) {
    const time = (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1);
    const day = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
    return { time, day };
}

/** Recursively lists the files of a directory as { name (posix, relative), data } */
export function readDirEntries(dirPath, prefix = "") {
    const entries = [];
    for (const dirent of fs.readdirSync(dirPath, { withFileTypes: true })) {
        if (dirent.name === ".DS_Store") {
            continue;
        }
        const filePath = path.join(dirPath, dirent.name);
        const name = prefix + dirent.name;
        if (dirent.isDirectory()) {
            entries.push(...readDirEntries(filePath, name + "/"));
        } else if (dirent.isFile()) {
            entries.push({ name, data: fs.readFileSync(filePath) });
        }
    }
    return entries;
}

/**
 * Writes a jar. `entries` is a list of { name, data }, names use "/" separators.
 * A META-INF/MANIFEST.MF is added when missing. Entries are sorted and directory
 * entries are generated, like the jar tool does.
 */
export function writeJar(jarFilePath, entries, { createdBy = "scripts/jar.mjs" } = {}) {
    const files = new Map();
    for (const { name, data } of entries) {
        files.set(name, Buffer.isBuffer(data) ? data : Buffer.from(data, "utf8"));
    }
    if (!files.has("META-INF/MANIFEST.MF")) {
        files.set("META-INF/MANIFEST.MF", Buffer.from(`Manifest-Version: 1.0\r\nCreated-By: ${createdBy}\r\n\r\n`, "utf8"));
    }

    const names = new Set(files.keys());
    for (const name of files.keys()) {
        const segments = name.split("/");
        for (let i = 1; i < segments.length; i++) {
            names.add(segments.slice(0, i).join("/") + "/");
        }
    }

    const rank = name => (name === "META-INF/" ? 0 : name === "META-INF/MANIFEST.MF" ? 1 : 2);
    const sortedNames = [...names].sort((a, b) => rank(a) - rank(b) || (a < b ? -1 : a > b ? 1 : 0));

    if (sortedNames.length > 0xfffe) {
        throw new Error("Too many entries for a plain zip archive");
    }

    const { time, day } = dosDateTime(new Date());
    const localParts = [];
    const centralParts = [];
    let offset = 0;

    for (const name of sortedNames) {
        const isDirectory = name.endsWith("/");
        const data = isDirectory ? Buffer.alloc(0) : files.get(name);
        const deflated = isDirectory ? data : zlib.deflateRawSync(data, { level: 9 });
        const useDeflate = !isDirectory && deflated.length < data.length;
        const body = useDeflate ? deflated : data;
        const nameBuffer = Buffer.from(name, "utf8");
        const crc = crc32(data);

        const local = Buffer.alloc(30);
        local.writeUInt32LE(0x04034b50, 0);
        local.writeUInt16LE(20, 4); // version needed
        local.writeUInt16LE(0x0800, 6); // UTF-8 names
        local.writeUInt16LE(useDeflate ? 8 : 0, 8);
        local.writeUInt16LE(time, 10);
        local.writeUInt16LE(day, 12);
        local.writeUInt32LE(crc, 14);
        local.writeUInt32LE(body.length, 18);
        local.writeUInt32LE(data.length, 22);
        local.writeUInt16LE(nameBuffer.length, 26);
        local.writeUInt16LE(0, 28);

        const central = Buffer.alloc(46);
        central.writeUInt32LE(0x02014b50, 0);
        central.writeUInt16LE(20, 4); // version made by
        central.writeUInt16LE(20, 6); // version needed
        central.writeUInt16LE(0x0800, 8);
        central.writeUInt16LE(useDeflate ? 8 : 0, 10);
        central.writeUInt16LE(time, 12);
        central.writeUInt16LE(day, 14);
        central.writeUInt32LE(crc, 16);
        central.writeUInt32LE(body.length, 20);
        central.writeUInt32LE(data.length, 24);
        central.writeUInt16LE(nameBuffer.length, 28);
        central.writeUInt16LE(0, 30); // extra length
        central.writeUInt16LE(0, 32); // comment length
        central.writeUInt16LE(0, 34); // disk number
        central.writeUInt16LE(0, 36); // internal attributes
        central.writeUInt32LE(isDirectory ? 0x10 : 0, 38); // external attributes
        central.writeUInt32LE(offset, 42);

        localParts.push(local, nameBuffer, body);
        centralParts.push(central, nameBuffer);
        offset += local.length + nameBuffer.length + body.length;
    }

    const centralSize = centralParts.reduce((size, part) => size + part.length, 0);

    if (offset + centralSize > 0xfffffffe) {
        throw new Error("Archive too large for a plain zip archive");
    }

    const end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0);
    end.writeUInt16LE(0, 4);
    end.writeUInt16LE(0, 6);
    end.writeUInt16LE(sortedNames.length, 8);
    end.writeUInt16LE(sortedNames.length, 10);
    end.writeUInt32LE(centralSize, 12);
    end.writeUInt32LE(offset, 16);
    end.writeUInt16LE(0, 20);

    fs.mkdirSync(path.dirname(jarFilePath), { recursive: true });
    fs.writeFileSync(jarFilePath, Buffer.concat([...localParts, ...centralParts, end]));

    return { fileCount: files.size, size: fs.statSync(jarFilePath).size };
}
