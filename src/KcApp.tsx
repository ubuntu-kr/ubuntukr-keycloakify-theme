import "./KcApp.css";
import "./KcCustomStyle.scss"
import { lazy, Suspense } from "react";
import type { KcContext } from "./kcContext";
import { useI18n } from "./i18n";
import Fallback, { type PageProps } from "keycloakify/login";
import tos_en_url from "./assets/tos_en.md";
import tos_ko_url from "./assets/tos_ko.md";
import { useDownloadTerms } from "keycloakify/login";

// import { foo, bar } from "./valuesTransferredOverUrl";

// console.log(`Values passed by the main app in the URL parameter:`, { foo, bar });
const Template = lazy(() => import("./Template"));

const DefaultTemplate = lazy(() => import("keycloakify/login/Template"));

const Login = lazy(() => import("./pages/Login"));
const LoginResetPassword = lazy(() => import("./pages/LoginResetPassword"));
// If you can, favor register-user-profile.ftl over register.ftl, see: https://docs.keycloakify.dev/realtime-input-validation
const Register = lazy(() => import("./pages/Register"));
const RegisterUserProfile = lazy(() => import("./pages/RegisterUserProfile"));
const Terms = lazy(() => import("./pages/Terms"));
const LoginOtp = lazy(() => import("./pages/LoginOtp"));
const LoginConfigOtp = lazy(() => import("./pages/LoginConfigTotp"));
const Error = lazy(() => import("./pages/Error"));
const LoginIdpLinkEmail = lazy(() => import("./pages/LoginIdpLinkEmail"));
const LoginIdpLinkConfirm = lazy(() => import("./pages/LoginIdpLinkConfirm"));
const IdpReviewUserProfile = lazy(() => import("./pages/IdpReviewUserProfile"));
const LogoutConfirm = lazy(() => import("./pages/LogoutConfirm"));
const MyExtraPage1 = lazy(() => import("./pages/MyExtraPage1"));
const MyExtraPage2 = lazy(() => import("./pages/MyExtraPage2"));
const Info = lazy(() => import("keycloakify/login/pages/Info"));

// This is like adding classes to theme.properties 
// https://github.com/keycloak/keycloak/blob/11.0.3/themes/src/main/resources/theme/keycloak/login/theme.properties
const classes: PageProps<any, any>["classes"] = {
    // NOTE: The classes are defined in ./KcApp.css
    "kcHtmlClass": "my-root-class",
    "kcHeaderWrapperClass": "my-color my-font"
};



export default function App(props: { kcContext: KcContext; }) {


    const { kcContext } = props;

    useDownloadTerms({
        kcContext,
        "downloadTermMarkdown": async ({ currentLanguageTag }) => {

            const markdownString = await fetch((() => {
                switch (currentLanguageTag) {
                    case "ko": return tos_ko_url;
                    default: return tos_en_url;
                }
            })()).then(response => response.text());

            return markdownString;
        }
    });

    const i18n = useI18n({ kcContext });

    if (i18n === null) {
        //NOTE: Locales not yet downloaded, we could as well display a loading progress but it's usually a matter of milliseconds.
        return null;
    }

    /* 
    * Examples assuming i18n.currentLanguageTag === "en":
    * i18n.msg("access-denied") === <span>Access denied</span>
    * i18n.msg("foo") === <span>foo in English</span>
    */




    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl": return <Login {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "register.ftl": return <Register {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "register-user-profile.ftl": return <RegisterUserProfile {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "terms.ftl": return <Terms {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "login-reset-password.ftl": return <LoginResetPassword {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "login-otp.ftl": return <LoginOtp {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "login-config-totp.ftl": return <LoginConfigOtp {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "error.ftl": return <Error {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "login-idp-link-email.ftl": return <LoginIdpLinkEmail {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "login-idp-link-confirm.ftl": return <LoginIdpLinkConfirm {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "idp-review-user-profile.ftl": return <IdpReviewUserProfile {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "logout-confirm.ftl": return <LogoutConfirm {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    // case "my-extra-page-1.ftl": return <MyExtraPage1 {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    // case "my-extra-page-2.ftl": return <MyExtraPage2 {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    // We choose to use the default Template for the Info page and to download the theme resources.
                    case "info.ftl": return <Info {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} Template={DefaultTemplate} />;
                    default: return <Fallback {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                }
            })()}
        </Suspense>
    );

}
