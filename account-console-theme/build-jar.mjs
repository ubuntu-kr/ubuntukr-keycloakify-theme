// Packages the account console theme (plain Keycloak theme files, no build step)
// into dist_keycloak/ubuntukr-account-theme.jar. Needs Node.js only.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readDirEntries, writeJar } from "../scripts/jar.mjs";

const themeSrcDirPath = path.dirname(fileURLToPath(import.meta.url));
const jarFilePath = path.join(themeSrcDirPath, "..", "dist_keycloak", "ubuntukr-account-theme.jar");

const entries = ["META-INF", "theme"].flatMap(dirBasename =>
    readDirEntries(path.join(themeSrcDirPath, dirBasename), `${dirBasename}/`)
);

const { fileCount, size } = writeJar(jarFilePath, entries, { createdBy: "account-console-theme/build-jar.mjs" });

console.log(`${path.relative(process.cwd(), jarFilePath)} (${fileCount} files, ${size} bytes)`);
