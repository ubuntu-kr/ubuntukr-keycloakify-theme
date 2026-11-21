import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { KcPage } from "./kc.gen";

function render() {
    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            {!window.kcContext ? (
                <h1>No Keycloak Context</h1>
            ) : (
                <KcPage kcContext={window.kcContext} />
            )}
        </StrictMode>
    );
}

if (import.meta.env.DEV && !window.kcContext) {
    // `npm run dev` only: there is no Keycloak, the page to preview is picked with
    // the URL, e.g. http://localhost:5173/?pageId=register.ftl&locale=ko
    // (see src/login/KcPageStory.tsx). None of this ends up in the production bundle.
    import("./login/KcPageStory").then(({ getKcContextMockFromUrl }) => {
        window.kcContext = getKcContextMockFromUrl();
        render();
    });
} else {
    render();
}
