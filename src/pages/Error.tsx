import React from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Button } from "@canonical/react-components";

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, ...kcProps } = props;

    const { message, client } = kcContext;

    const { msg } = i18n;

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, ...kcProps }}
            displayMessage={false}
            headerNode={msg("errorTitle")}>
            <div id="kc-error-message">
                <p className="instruction">{message.summary}</p>
                {client !== undefined && client.baseUrl !== undefined && (
                    <p>
                        <Button element="a" href={client.baseUrl} appearance="base">
                            {msg("backToApplication")}
                        </Button>
                    </p>
                )}
            </div>
        </Template>
    );
}