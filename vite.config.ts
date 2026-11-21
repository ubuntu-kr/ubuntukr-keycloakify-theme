import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        keycloakify({
            // The realm references the login and email themes by this name.
            themeName: "ubuntukr-keycloakify-theme",
            groupId: "org.ubuntu-kr.keycloak",
            artifactId: "ubuntukr-theme",
            // The account console theme is a plain Keycloak theme, see ./account-console-theme
            accountThemeImplementation: "none",
            // Only one jar is needed: Keycloak 26 and above ("all-other-versions" also covers 21 and below).
            keycloakVersionTargets: {
                "22-to-25": false,
                "all-other-versions": "ubuntukr-theme.jar"
            }
        })
    ],
    css: {
        preprocessorOptions: {
            scss: {
                // vanilla-framework is imported by package name from the stylesheet
                includePaths: ["node_modules"]
            }
        }
    }
});
