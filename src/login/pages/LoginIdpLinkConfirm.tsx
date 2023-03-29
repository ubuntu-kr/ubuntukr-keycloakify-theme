import React from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Button } from "@canonical/react-components";

export default function LoginIdpLinkConfirm(props: PageProps<Extract<KcContext, { pageId: "login-idp-link-confirm.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, ...kcProps } = props;

    const { url, idpAlias } = kcContext;

    const { msg } = i18n;

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, ...kcProps }}
            headerNode={msg("confirmLinkIdpTitle")}>
            <form id="kc-register-form" action={url.loginAction} method="post">
                <Button element={'button'}
                    type="submit"
                    name="submitAction"
                    id="updateProfile"
                    value="updateProfile">
                    {msg("confirmLinkIdpReviewProfile")}
                </Button>
                <Button element={'button'}
                    type="submit"
                    name="submitAction"
                    id="linkAccount"
                    value="linkAccount">
                    {msg("confirmLinkIdpContinue", idpAlias)}
                </Button>
            </form>
        </Template>
    );
}