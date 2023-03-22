import React from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
export default function LoginIdpLinkEmail(props: PageProps<Extract<KcContext, { pageId: "login-idp-link-email.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, ...kcProps } = props;

    const { url, realm, brokerContext, idpAlias } = kcContext;

    const { msg } = i18n;

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, ...kcProps }}
            headerNode={msg("emailLinkIdpTitle", idpAlias)}>
            <>
                <p id="instruction1">
                    {msg("emailLinkIdp1", idpAlias, brokerContext.username, realm.displayName)}
                </p>
                <p id="instruction2">
                    {msg("emailLinkIdp2")} <a href={url.loginAction}>{msg("doClickHere")}</a> {msg("emailLinkIdp3")}
                </p>
                <p id="instruction3">
                    {msg("emailLinkIdp4")} <a href={url.loginAction}>{msg("doClickHere")}</a> {msg("emailLinkIdp5")}
                </p>
            </>
        </Template>
    );
}