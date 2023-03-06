// This is a copy paste from https://github.com/InseeFrLab/keycloakify/blob/main/src/lib/pages/Register.tsx
// It is now up to us to implement a special behavior to leverage the non standard authorizedMailDomains
// provided by the plugin: https://github.com/micedre/keycloak-mail-whitelisting installed on our keycloak server.
// Note that it is no longer recommended to use register.ftl, it's best to use register-user-profile.ftl
// See: https://docs.keycloakify.dev/realtime-input-validation
import { clsx } from "keycloakify/lib/tools/clsx";
import type { PageProps } from "keycloakify/lib/KcProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Navigation, Theme, ICONS, Icon, Button, Form, Input } from "@canonical/react-components";


export default function Register(props: PageProps<Extract<KcContext, { pageId: "register.ftl"; }>, I18n>) {
    const { kcContext, i18n, doFetchDefaultThemeResources = true, Template, ...kcProps } = props;

    const { url, messagesPerField, register, realm, passwordRequired, recaptchaRequired, recaptchaSiteKey } = kcContext;

    const { msg, msgStr } = i18n;

    console.log(`NOTE: It is up to you do do something meaningful with ${kcContext.authorizedMailDomains}`);

    return (
        <Template
            {...{ kcContext, i18n, doFetchDefaultThemeResources, ...kcProps }}
            headerNode={msg("registerTitle")}
            formNode={
                <Form id="kc-register-form" className={clsx(kcProps.kcFormClass)} action={url.registrationAction} method="post">
                    <fieldset>
                        <Input
                            label={msg("firstName")}
                            type="text"
                            id="firstName"
                            className={clsx(kcProps.kcInputClass)}
                            name="firstName"
                            defaultValue={register.formData.firstName ?? ""}
                            error={messagesPerField.existsError("firstName") ? messagesPerField.get("firstName") : null}
                        />
                        <Input
                            label={msg("lastName")}
                            type="text"
                            id="lastName"
                            className={clsx(kcProps.kcInputClass)}
                            name="lastName"
                            defaultValue={register.formData.lastName ?? ""}
                            error={messagesPerField.existsError("lastName") ? messagesPerField.get("lastName") : null}
                        />

                        <Input
                            label={msg("email")}
                            type="text"
                            id="email"
                            className={clsx(kcProps.kcInputClass)}
                            name="email"
                            defaultValue={register.formData.email ?? ""}
                            error={messagesPerField.existsError("email") ? messagesPerField.get("email") : null}
                        />
                        {!realm.registrationEmailAsUsername && (
                            <Input
                                label={msg("username")}
                                type="text"
                                id="username"
                                className={clsx(kcProps.kcInputClass)}
                                name="username"
                                defaultValue={register.formData.username ?? ""}
                                error={messagesPerField.existsError("username") ? messagesPerField.get("username") : null}
                                autoComplete="username"
                            />
                        )}
                        {passwordRequired && (
                            <>
                                <Input
                                    label={msg("password")}
                                    type="password"
                                    id="password"
                                    className={clsx(kcProps.kcInputClass)}
                                    name="password"
                                    error={messagesPerField.existsError("password") ? messagesPerField.get("password") : null}
                                    autoComplete="new-password"
                                />

                                <Input
                                    label={msg("passwordConfirm")}
                                    type="password"
                                    id="password-confirm"
                                    className={clsx(kcProps.kcInputClass)}
                                    name="password-confirm"
                                    error={messagesPerField.existsError("password-confirm") ? messagesPerField.get("password-confirm") : null}
                                    autoComplete="new-password"
                                />
                            </>
                        )}
                        {recaptchaRequired && (
                            <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey}></div>
                        )}

                        <Button element={'input'}
                            type="submit"
                            value={msgStr("doRegister")}
                            appearance="positive"
                        />
                        <Button element="a" href={url.loginUrl} appearance="base">
                            {msg("backToLogin")}
                        </Button>
                    </fieldset>
                </Form>
            }
        />
    );
}

