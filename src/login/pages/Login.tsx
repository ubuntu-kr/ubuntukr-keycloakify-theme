import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { Icon, Button, Form, Input } from "@canonical/react-components";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import GoogleLogo from "../assets/g-logo.png";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    // NOTE: Since Keycloak 24 `social.displayInfo` no longer exists, the registration link
    // only depends on the realm settings and the providers on `social.providers`.
    const socialProviders = realm.password ? (social?.providers ?? []) : [];

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("doLogIn")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration">
                    <Button element="a" href={url.registrationUrl} appearance="base">
                        {msg("noAccount")} - {msg("doRegister")}
                    </Button>
                </div>
            }
        >
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    {realm.password && (
                        <Form
                            id="kc-form-login"
                            onSubmit={() => {
                                setIsLoginButtonDisabled(true);
                                return true;
                            }}
                            action={url.loginAction}
                            method="post"
                        >
                            <fieldset>
                                {!usernameHidden && (
                                    <Input
                                        tabIndex={1}
                                        id="username"
                                        name="username"
                                        defaultValue={login.username ?? ""}
                                        type="text"
                                        label={
                                            !realm.loginWithEmailAllowed
                                                ? msg("username")
                                                : !realm.registrationEmailAsUsername
                                                  ? msg("usernameOrEmail")
                                                  : msg("email")
                                        }
                                        autoFocus
                                        autoComplete="username"
                                    />
                                )}
                                <Input
                                    tabIndex={2}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    label={msg("password")}
                                />
                                {realm.rememberMe && !usernameHidden && (
                                    <Input
                                        id="rememberMe"
                                        name="rememberMe"
                                        tabIndex={3}
                                        label={msg("rememberMe")}
                                        type="checkbox"
                                        defaultChecked={!!login.rememberMe}
                                    />
                                )}

                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth?.selectedCredential ?? ""} />
                                <Button
                                    element="input"
                                    tabIndex={4}
                                    className="p-button"
                                    name="login"
                                    id="kc-login"
                                    type="submit"
                                    value={msgStr("doLogIn")}
                                    disabled={isLoginButtonDisabled}
                                    appearance="positive"
                                />
                                {realm.resetPasswordAllowed && (
                                    <Button element="a" tabIndex={5} href={url.loginResetCredentialsUrl} appearance="base">
                                        {msg("doForgotPassword")}
                                    </Button>
                                )}

                                {socialProviders.length !== 0 && (
                                    <>
                                        <hr />
                                        <p>{msg("identity-provider-login-label")}</p>
                                        <div id="kc-social-providers" style={{ display: "flex", flexWrap: "wrap" }}>
                                            {socialProviders.map(p => (
                                                <Button
                                                    key={p.alias}
                                                    hasIcon
                                                    element="a"
                                                    href={p.loginUrl}
                                                    id={`social-${p.alias}`}
                                                    style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                                >
                                                    {p.alias === "google" ? (
                                                        <img src={GoogleLogo} alt="" style={{ height: "18px", marginLeft: "-8px" }} />
                                                    ) : (
                                                        <Icon name={p.alias} style={{ height: "18px", width: "18px" }} />
                                                    )}
                                                    <span style={{ fontSize: "14px", marginLeft: "24px", marginRight: "-8px" }}>{p.displayName}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </fieldset>
                        </Form>
                    )}
                </div>
            </div>
        </Template>
    );
}
