import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import { useGetClassName } from "keycloakify/account/lib/useGetClassName";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Form, Button, Input, Card, List } from "@canonical/react-components";

export default function Sessions(props: PageProps<Extract<KcContext, { pageId: "totp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        "classes": {
            ...classes,
            "kcBodyClass": clsx(classes?.kcBodyClass, "user")
        }
    });

    const { url, realm, messagesPerField, stateChecker, totp } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="totp">

            <h2>{msg("authenticatorTitle")}</h2>
            {totp.otpCredentials.length <= 0 ?(<>
                <h1 className="p-heading--6">* {msg("requiredFields")}</h1>
            </>):(<></>)}
        </Template>
    );
}