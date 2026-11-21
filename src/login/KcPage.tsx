import "./KcApp.css";
import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";

// Ubuntu Korea layout (Vanilla framework), used by the pages customised below.
const Template = lazy(() => import("./Template"));
// Stock Keycloak look, used by every other page.
const DefaultTemplate = lazy(() => import("keycloakify/login/Template"));

const UserProfileFormFields = lazy(() => import("./UserProfileFormFields"));
const DefaultUserProfileFormFields = lazy(() => import("keycloakify/login/UserProfileFormFields"));

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Terms = lazy(() => import("./pages/Terms"));
const LoginResetPassword = lazy(() => import("./pages/LoginResetPassword"));
const LoginUpdatePassword = lazy(() => import("./pages/LoginUpdatePassword"));
const LoginOtp = lazy(() => import("./pages/LoginOtp"));
const LoginConfigTotp = lazy(() => import("./pages/LoginConfigTotp"));
const LoginVerifyEmail = lazy(() => import("./pages/LoginVerifyEmail"));
const IdpReviewUserProfile = lazy(() => import("./pages/IdpReviewUserProfile"));
const LoginIdpLinkConfirm = lazy(() => import("./pages/LoginIdpLinkConfirm"));
const LoginIdpLinkEmail = lazy(() => import("./pages/LoginIdpLinkEmail"));
const LoginPageExpired = lazy(() => import("./pages/LoginPageExpired"));
const LogoutConfirm = lazy(() => import("./pages/LogoutConfirm"));
const Error = lazy(() => import("./pages/Error"));
const Info = lazy(() => import("./pages/Info"));

const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    // The customised pages bring their own stylesheet (see ./Template.tsx), they must not load Keycloak's default one.
    const custom = { i18n, classes, Template, doUseDefaultCss: false } as const;
    const customWithProfile = { ...custom, UserProfileFormFields, doMakeUserConfirmPassword } as const;

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl":
                        return <Login kcContext={kcContext} {...custom} />;
                    case "register.ftl":
                        return <Register kcContext={kcContext} {...customWithProfile} />;
                    case "terms.ftl":
                        return <Terms kcContext={kcContext} {...custom} />;
                    case "login-reset-password.ftl":
                        return <LoginResetPassword kcContext={kcContext} {...custom} />;
                    case "login-update-password.ftl":
                        return <LoginUpdatePassword kcContext={kcContext} {...custom} />;
                    case "login-otp.ftl":
                        return <LoginOtp kcContext={kcContext} {...custom} />;
                    case "login-config-totp.ftl":
                        return <LoginConfigTotp kcContext={kcContext} {...custom} />;
                    case "login-verify-email.ftl":
                        return <LoginVerifyEmail kcContext={kcContext} {...custom} />;
                    case "idp-review-user-profile.ftl":
                        return <IdpReviewUserProfile kcContext={kcContext} {...customWithProfile} />;
                    case "login-idp-link-confirm.ftl":
                        return <LoginIdpLinkConfirm kcContext={kcContext} {...custom} />;
                    case "login-idp-link-email.ftl":
                        return <LoginIdpLinkEmail kcContext={kcContext} {...custom} />;
                    case "login-page-expired.ftl":
                        return <LoginPageExpired kcContext={kcContext} {...custom} />;
                    case "logout-confirm.ftl":
                        return <LogoutConfirm kcContext={kcContext} {...custom} />;
                    case "error.ftl":
                        return <Error kcContext={kcContext} {...custom} />;
                    case "info.ftl":
                        return <Info kcContext={kcContext} {...custom} />;
                    default:
                        // Pages that are not customised keep Keycloak's default look.
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={DefaultTemplate}
                                doUseDefaultCss={true}
                                UserProfileFormFields={DefaultUserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

// Extra CSS classes, they are defined in ./KcApp.css
const classes = {
    kcHtmlClass: "my-root-class",
    kcHeaderWrapperClass: "my-color my-font"
} satisfies { [key in ClassKey]?: string };
