import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import { useGetClassName } from "keycloakify/account/lib/useGetClassName";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Form, Button, Input } from "@canonical/react-components";

export default function Password(props: PageProps<Extract<KcContext, { pageId: "password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        "classes": {
            ...classes,
            "kcBodyClass": clsx(classes?.kcBodyClass, "password")
        }
    });

    const { url, password, account, stateChecker } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="password">

            <h2>{msg("changePasswordHtmlTitle")}</h2>
            <h1 className="p-heading--6">{msg("allFieldsRequired")}</h1>


            <Form action={url.passwordUrl} className="form-horizontal" method="post">

                <input
                    type="text"
                    id="username"
                    name="username"
                    value={account.username ?? ""}
                    autoComplete="username"
                    readOnly
                    style={{ display: "none" }}
                />

                {password.passwordSet && (
                    <Input
                        id="password" name="password" autoFocus autoComplete="current-password"
                        type="password" label={msg("password")}
                    />
                )}

                <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />

                <Input
                    id="password-new" name="password-new" autoFocus autoComplete="new-password"
                    type="password" label={msg("passwordNew")}
                />

                <Input
                    id="password-confirm" name="password-confirm" autoFocus autoComplete="new-password"
                    type="password" label={msg("passwordConfirm")}
                />

                <div>
                    <Button type="submit" name="submitAction" value="Save" appearance="positive">
                        {msg("doSave")}
                    </Button>
                </div>
            </Form>
        </Template>
    );
}