import type { PageProps } from "keycloakify/login/pages/PageProps";
import { Button, Form } from "@canonical/react-components";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LogoutConfirm(props: PageProps<Extract<KcContext, { pageId: "logout-confirm.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, client, logoutConfirm } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("logoutConfirmTitle")}
        >
            <div id="kc-logout-confirm">
                <p className="instruction">{msg("logoutConfirmHeader")}</p>
                <Form className="form-actions" action={url.logoutConfirmAction} method="POST">
                    <input type="hidden" name="session_code" value={logoutConfirm.code} />
                    <div>
                        <div id="kc-form-buttons">
                            <Button
                                element="input"
                                className="p-button"
                                tabIndex={4}
                                name="confirmLogout"
                                id="kc-logout"
                                type="submit"
                                value={msgStr("doLogout")}
                                appearance="positive"
                            />
                        </div>
                        <div id="kc-info-message">
                            {!logoutConfirm.skipLink && client.baseUrl && (
                                <Button dense element="a" href={client.baseUrl} appearance="base">
                                    {msg("backToApplication")}
                                </Button>
                            )}
                        </div>
                    </div>
                </Form>
            </div>
        </Template>
    );
}
