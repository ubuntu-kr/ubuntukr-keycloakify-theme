import "./KcApp.css";
import "./KcCustomStyle.scss"
import { lazy, Suspense } from "react";
import type { KcContext } from "./kcContext";
import { useI18n } from "./i18n";
import Fallback, { defaultKcProps, type KcProps, type PageProps, useDownloadTerms } from "keycloakify";
import Template from "./Template";
import DefaultTemplate from "keycloakify/lib/Template";
import tos_en_url from "./assets/tos_en.md";
import tos_ko_url from "./assets/tos_ko.md";

// import { foo, bar } from "./valuesTransferredOverUrl";

// console.log(`Values passed by the main app in the URL parameter:`, { foo, bar });

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
const MyExtraPage1 = lazy(() => import("./pages/MyExtraPage1"));
const MyExtraPage2 = lazy(() => import("./pages/MyExtraPage2"));
const Info = lazy(() => import("keycloakify/lib/pages/Info"));

// This is like editing the theme.properties 
// https://github.com/keycloak/keycloak/blob/11.0.3/themes/src/main/resources/theme/keycloak/login/theme.properties
const kcProps: KcProps = {
    ...defaultKcProps,
    // NOTE: The classes are defined in ./KcApp.css
    // You can add your classes alongside thoses that are present in the default Keycloak theme...
    "kcHtmlClass": [...defaultKcProps.kcHtmlClass, "my-root-class"],
    // ...or overwrite  
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


    const pageProps: Omit<PageProps<any, typeof i18n>, "kcContext"> = {
        i18n,
        // Here we have overloaded the default template, however you could use the default one with:  
        //Template: DefaultTemplate,
        Template,
        // Wether or not we should download the CSS and JS resources that comes with the default Keycloak theme.  
        doFetchDefaultThemeResources: true,
        ...kcProps,
    };



    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl": return <Login {...{ kcContext, ...pageProps }} />;
                    case "register.ftl": return <Register {...{ kcContext, ...pageProps }} />;
                    case "register-user-profile.ftl": return <RegisterUserProfile {...{ kcContext, ...pageProps }} />;
                    case "terms.ftl": return <Terms {...{ kcContext, ...pageProps }} />;
                    case "login-reset-password.ftl": return <LoginResetPassword {...{ kcContext, ...pageProps }} />;
                    case "login-otp.ftl": return <LoginOtp {...{ kcContext, ...pageProps }} />;
                    case "login-config-totp.ftl": return <LoginConfigOtp {...{ kcContext, ...pageProps }} />;
                    case "error.ftl": return <Error {...{ kcContext, ...pageProps }} />;
                    case "login-idp-link-email.ftl": return <LoginIdpLinkEmail {...{ kcContext, ...pageProps }} />;
                    case "login-idp-link-confirm.ftl": return <LoginIdpLinkConfirm {...{ kcContext, ...pageProps }} />;
                    case "idp-review-user-profile.ftl": return <IdpReviewUserProfile {...{ kcContext, ...pageProps }} />;
                    // case "my-extra-page-1.ftl": return <MyExtraPage1 {...{ kcContext, ...pageProps }} />;
                    // case "my-extra-page-2.ftl": return <MyExtraPage2 {...{ kcContext, ...pageProps }} />;
                    // We choose to use the default Template for the Info page and to download the theme resources.
                    case "info.ftl": return <Info {...{ kcContext, ...pageProps }} Template={DefaultTemplate} doFetchDefaultThemeResources={true} />;
                    default: return <Fallback {...{ kcContext, ...pageProps }} />;
                }
            })()}
        </Suspense>
    );

}
