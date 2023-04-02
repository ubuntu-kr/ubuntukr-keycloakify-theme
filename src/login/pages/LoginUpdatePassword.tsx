import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Navigation, Theme, ICONS, Icon, Button, Form, Input } from "@canonical/react-components";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        classes
    });

    const { msg, msgStr } = i18n;

    const { url, messagesPerField, isAppInitiatedAction, username } = kcContext;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} headerNode={msg("updatePasswordTitle")}>
            <Form id="kc-passwd-update-form" action={url.loginAction} method="post">
                <fieldset>
                    <Input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        readOnly={true}
                        autoComplete="username"
                        style={{ display: "none" }}
                    />
                    <Input type="password" id="password" name="password" autoComplete="current-password" style={{ display: "none" }} />

                    <Input
                        label={msg("passwordNew")}
                        type="password"
                        id="password-new"
                        name="password-new"
                        autoFocus
                        autoComplete="new-password"
                        error={messagesPerField.existsError("password") ? messagesPerField.get("password") : null}
                    />

                    <Input
                        label={msg("passwordConfirm")}
                        type="password"
                        id="password-confirm"
                        name="password-confirm"
                        autoComplete="new-password"
                        error={messagesPerField.existsError("password-confirm") ? messagesPerField.get("password-confirm") : null}
                    />
                    <div id="kc-form-options">
                        {isAppInitiatedAction && (
                            <Input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" defaultChecked label={msgStr("logoutOtherSessions")} />
                        )}
                    </div>
                    <div id="kc-form-buttons">
                        {isAppInitiatedAction ? (
                            <>
                                <Button element={'input'}
                                    className={"p-button"}
                                    type="submit"
                                    defaultValue={msgStr("doSubmit")}
                                    appearance="positive"
                                />
                                <Button
                                    className={"p-button"}
                                    type="submit"
                                    name="cancel-aia"
                                    value="true">{msg("doCancel")}</Button>
                            </>
                        ) : (
                            <Button element={'input'}
                                className={"p-button"}
                                type="submit"
                                defaultValue={msgStr("doSubmit")}
                                appearance="positive"
                            />
                        )}
                    </div>
                </fieldset>
            </Form>
        </Template>
    );
}