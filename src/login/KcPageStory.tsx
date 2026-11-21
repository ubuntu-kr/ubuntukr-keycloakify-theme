import type { DeepPartial } from "keycloakify/tools/DeepPartial";
import type { KcContext } from "./KcContext";
import { createGetKcContextMock } from "keycloakify/login/KcContext";
import type { KcContextExtension, KcContextExtensionPerPage } from "./KcContext";
import { themeNames, kcEnvDefaults } from "../kc.gen";

// Development only (see src/main.tsx): builds a fake kcContext so that the pages
// can be previewed with `npm run dev`, without a Keycloak server.

const kcContextExtension: KcContextExtension = {
    themeName: themeNames[0],
    properties: {
        ...kcEnvDefaults
    }
};
const kcContextExtensionPerPage: KcContextExtensionPerPage = {};

export const { getKcContextMock } = createGetKcContextMock({
    kcContextExtension,
    kcContextExtensionPerPage,
    overrides: {
        realm: {
            name: "ubuntu-kr",
            displayName: "Ubuntu Korea SSO",
            displayNameHtml: "Ubuntu Korea SSO"
        }
    },
    overridesPerPage: {}
});

/**
 * Reads the page to preview from the URL of the dev server:
 *
 *   ?pageId=login.ftl            page to render (default: login.ftl)
 *   &locale=ko                   current language, "ko" (default) or "en"
 *   &overrides={...}             JSON merged into the mocked kcContext,
 *                                e.g. {"passwordRequired":false}
 *   &fieldErrors={"email":"…"}   per field validation errors (messagesPerField)
 */
export function getKcContextMockFromUrl(): KcContext {
    const searchParams = new URLSearchParams(window.location.search);

    const pageId = (searchParams.get("pageId") ?? "login.ftl") as KcContext["pageId"];
    const locale = searchParams.get("locale") ?? "ko";
    const overrides = JSON.parse(searchParams.get("overrides") ?? "{}") as DeepPartial<KcContext>;
    const fieldErrors = JSON.parse(searchParams.get("fieldErrors") ?? "{}") as Record<string, string>;

    const urlFor = (languageTag: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set("locale", languageTag);
        return url.href;
    };

    const kcContext = getKcContextMock({
        pageId,
        overrides: {
            locale: {
                currentLanguageTag: locale,
                supported: [
                    { languageTag: "en", label: "English", url: urlFor("en") },
                    { languageTag: "ko", label: "한국어", url: urlFor("ko") }
                ]
            },
            ...overrides
        } as never
    });

    if (Object.keys(fieldErrors).length !== 0) {
        kcContext.messagesPerField = {
            ...kcContext.messagesPerField,
            get: fieldName => fieldErrors[fieldName] ?? "",
            exists: fieldName => fieldName in fieldErrors,
            existsError: (...fieldNames) => fieldNames.some(fieldName => fieldName in fieldErrors),
            getFirstError: (...fieldNames) => fieldNames.map(fieldName => fieldErrors[fieldName]).find(error => error !== undefined) ?? ""
        };
    }

    return kcContext;
}
