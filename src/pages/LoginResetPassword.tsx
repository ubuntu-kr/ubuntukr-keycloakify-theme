import React from "react";
import type { PageProps } from "keycloakify/lib/KcProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Navigation, Theme, ICONS, Icon, Button, Form, Input } from "@canonical/react-components";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doFetchDefaultThemeResources = true, Template, ...kcProps } = props;

    const { url, realm, auth } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            {...{ kcContext, i18n, doFetchDefaultThemeResources, ...kcProps }}
            displayMessage={false}
            headerNode={msg("emailForgotTitle")}
            formNode={
                <Form id="kc-reset-password-form" action={url.loginAction} method="post">
                    <fieldset>
                        <Input autoFocus
                            label={!realm.loginWithEmailAllowed
                                ? msg("username")
                                : !realm.registrationEmailAsUsername
                                    ? msg("usernameOrEmail")
                                    : msg("email")}
                            type="text" id="username" name="username"
                            defaultValue={auth !== undefined && auth.showUsername ? auth.attemptedUsername : undefined}
                        />
                        <Button element={'input'}
                            type="submit" id="kc-form-buttons"
                            value={msgStr("doSubmit")}
                            appearance="positive"
                        />
                        <Button element="a" href={url.loginUrl} appearance="base">
                            {msg("backToLogin")}
                        </Button>
                    </fieldset>
                </Form>
            }
            infoNode={msg("emailInstruction")}
        />
    );
}