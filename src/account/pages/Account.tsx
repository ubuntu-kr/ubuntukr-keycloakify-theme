import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import { useGetClassName } from "keycloakify/account/lib/useGetClassName";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Form, Button, Input } from "@canonical/react-components";

export default function LogoutConfirm(props: PageProps<Extract<KcContext, { pageId: "account.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        "classes": {
            ...classes,
            "kcBodyClass": clsx(classes?.kcBodyClass, "user")
        }
    });

    const { url, realm, messagesPerField, stateChecker, account } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="account">

            <h2>{msg("editAccountHtmlTitle")}</h2>
            <h1 className="p-heading--6">* {msg("requiredFields")}</h1>

            <Form action={url.accountUrl} method="post">
                <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />

                {!realm.registrationEmailAsUsername && (
                    <Input
                        id="username"
                        name="username"
                        disabled={!realm.editUsernameAllowed}
                        defaultValue={account.username ?? ""}
                        type="text" label={msgStr("username") + (realm.editUsernameAllowed ? "*": "")}
                    />
                )}

                <Input
                    id="email" name="email" autoFocus defaultValue={account.email ?? ""}
                    type="text" label={msgStr("email") + "*"}
                    error={messagesPerField.existsError("email") ? messagesPerField.get("email") : null}
                />

                <Input
                    id="firstName" name="firstName" autoFocus defaultValue={account.firstName ?? ""}
                    type="text" label={msgStr("firstName") + "*"}
                    error={messagesPerField.existsError("firstName") ? messagesPerField.get("firstName") : null}
                />

                <Input
                    id="lastName" name="lastName" autoFocus defaultValue={account.lastName ?? ""}
                    type="text" label={msgStr("lastName") + "*"}
                    error={messagesPerField.existsError("lastName") ? messagesPerField.get("lastName") : null}
                />


                <div>
                    {url.referrerURI !== undefined && <a href={url.referrerURI}>${msg("backToApplication")}</a>}
                    <Button type="submit" name="submitAction" value="Save" appearance="positive">
                        {msg("doSave")}
                    </Button>
                    <Button type="submit" name="submitAction" value="Cancel" appearance="base">
                        {msg("doCancel")}
                    </Button>

                </div>
            </Form>
        </Template>
    );
}