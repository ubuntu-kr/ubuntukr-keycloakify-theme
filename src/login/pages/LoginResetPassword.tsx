import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { Button, Form, Input } from "@canonical/react-components";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, realm, auth, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username")}
            headerNode={msg("emailForgotTitle")}
            infoNode={realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")}
        >
            <Form id="kc-reset-password-form" action={url.loginAction} method="post">
                <fieldset>
                    <Input
                        autoFocus
                        label={
                            !realm.loginWithEmailAllowed
                                ? msg("username")
                                : !realm.registrationEmailAsUsername
                                  ? msg("usernameOrEmail")
                                  : msg("email")
                        }
                        type="text"
                        id="username"
                        name="username"
                        defaultValue={auth?.attemptedUsername ?? ""}
                        error={
                            messagesPerField.existsError("username") ? (
                                <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("username")) }} />
                            ) : null
                        }
                    />
                    <Button element="input" type="submit" id="kc-form-buttons" value={msgStr("doSubmit")} appearance="positive" />
                    <Button element="a" href={url.loginUrl} appearance="base">
                        {msg("backToLogin")}
                    </Button>
                </fieldset>
            </Form>
        </Template>
    );
}
