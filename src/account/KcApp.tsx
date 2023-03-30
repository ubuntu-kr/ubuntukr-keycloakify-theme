import "./KcApp.css";
import { lazy, Suspense } from "react";
import type { PageProps } from "keycloakify/account";
import type { KcContext } from "./kcContext";
import { useI18n } from "./i18n";
import "./KcCustomStyle.scss"

const Template = lazy(() => import("./Template"));
const DefaultTemplate = lazy(() => import("keycloakify/account/Template"));

const Account = lazy(() => import("./pages/Account"));
const Password = lazy(() => import("./pages/Password"));
const MyExtraPage1 = lazy(() => import("./pages/MyExtraPage1"));
const MyExtraPage2 = lazy(() => import("./pages/MyExtraPage2"));
const Sessions = lazy(() => import("./pages/Sessions"));
const FederatedIdentity = lazy(() => import("./pages/FederatedIdentity"));
const Applications = lazy(() => import("./pages/Applications"));
const Fallback = lazy(()=> import("keycloakify/account"));

const classes: PageProps<any, any>["classes"] = {
    "kcBodyClass": "my-root-class"
};

export default function App(props: { kcContext: KcContext; }) {

    const { kcContext } = props;

    const i18n = useI18n({ kcContext });

    if (i18n === null) {
        return null;
    }

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "account.ftl": return <Account {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "password.ftl": return <Password {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "my-extra-page-1.ftl": return <MyExtraPage1 {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "my-extra-page-2.ftl": return <MyExtraPage2 {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "sessions.ftl": return <Sessions {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "federatedIdentity.ftl" : return <FederatedIdentity {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "applications.ftl": return <Applications {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    default: return <Fallback {...{ kcContext, i18n, classes }} Template={Template} doUseDefaultCss={true} />;
                }
            })()}
        </Suspense>
    );

}