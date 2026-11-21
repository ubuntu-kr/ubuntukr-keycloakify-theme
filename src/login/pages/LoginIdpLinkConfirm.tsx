import type { PageProps } from "keycloakify/login/pages/PageProps";
import { Button } from "@canonical/react-components";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginIdpLinkConfirm(props: PageProps<Extract<KcContext, { pageId: "login-idp-link-confirm.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, idpAlias } = kcContext;

    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("confirmLinkIdpTitle")}>
            <form id="kc-register-form" action={url.loginAction} method="post">
                <Button type="submit" name="submitAction" id="updateProfile" value="updateProfile">
                    {msg("confirmLinkIdpReviewProfile")}
                </Button>
                <Button type="submit" name="submitAction" id="linkAccount" value="linkAccount">
                    {msg("confirmLinkIdpContinue", idpAlias)}
                </Button>
            </form>
        </Template>
    );
}
