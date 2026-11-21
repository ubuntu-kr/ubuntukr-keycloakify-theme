import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { Button, Form, Input } from "@canonical/react-components";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msg, msgStr } = i18n;

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    const fieldError = (fieldName: string) =>
        messagesPerField.existsError(fieldName) ? <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get(fieldName)) }} /> : null;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("password", "password-confirm")}
            headerNode={msg("updatePasswordTitle")}
        >
            <Form id="kc-passwd-update-form" action={url.loginAction} method="post">
                <fieldset>
                    <Input
                        label={msg("passwordNew")}
                        type="password"
                        id="password-new"
                        name="password-new"
                        autoFocus
                        autoComplete="new-password"
                        error={fieldError("password")}
                    />
                    <Input
                        label={msg("passwordConfirm")}
                        type="password"
                        id="password-confirm"
                        name="password-confirm"
                        autoComplete="new-password"
                        error={fieldError("password-confirm")}
                    />
                    <div id="kc-form-options">
                        {isAppInitiatedAction && (
                            <Input
                                type="checkbox"
                                id="logout-sessions"
                                name="logout-sessions"
                                value="on"
                                defaultChecked
                                label={msg("logoutOtherSessions")}
                            />
                        )}
                    </div>
                    <div id="kc-form-buttons">
                        <Button element="input" className="p-button" type="submit" value={msgStr("doSubmit")} appearance="positive" />
                        {isAppInitiatedAction && (
                            <Button className="p-button" type="submit" name="cancel-aia" value="true">
                                {msg("doCancel")}
                            </Button>
                        )}
                    </div>
                </fieldset>
            </Form>
        </Template>
    );
}
