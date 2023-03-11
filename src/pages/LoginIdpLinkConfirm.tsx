import React from "react";
import { clsx } from "keycloakify/lib/tools/clsx";
import type { PageProps } from "keycloakify/lib/KcProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Button } from "@canonical/react-components";

export default function LoginIdpLinkConfirm(props: PageProps<Extract<KcContext, { pageId: "login-idp-link-confirm.ftl" }>, I18n>) {
    const { kcContext, i18n, doFetchDefaultThemeResources = true, Template, ...kcProps } = props;

    const { url, idpAlias } = kcContext;

    const { msg } = i18n;

    return (
        <Template
            {...{ kcContext, i18n, doFetchDefaultThemeResources, ...kcProps }}
            headerNode={msg("confirmLinkIdpTitle")}
            formNode={
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
            }
        />
    );
}