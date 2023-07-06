import { assert } from "keycloakify/tools/assert";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Button } from "@canonical/react-components";


export default function Info(props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msgStr, msg } = i18n;

    assert(kcContext.message !== undefined);

    const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client } = kcContext;

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            displayMessage={false}
            headerNode={messageHeader !== undefined ? <>{messageHeader}</> : <>{message.summary}</>}
        >
            <div id="kc-info-message">
                <p className="instruction">
                    {message.summary}

                    {requiredActions !== undefined && (
                        <b>{requiredActions.map(requiredAction => msgStr(`requiredAction.${requiredAction}` as const)).join(",")}</b>
                    )}
                </p>
                {!skipLink && pageRedirectUri !== undefined ? (
                    <p>
                        <Button element="a" href={pageRedirectUri} appearance="base">
                            {msg("backToApplication")}
                        </Button>
                    </p>
                ) : actionUri !== undefined ? (
                    <p>
                        <Button element="a" href={actionUri} appearance="base">
                            {msg("proceedWithAction")}
                        </Button>
                    </p>
                ) : (
                    client.baseUrl !== undefined && (
                        <p>
                            <Button element="a" href={client.baseUrl} appearance="base">
                                {msg("backToApplication")}
                            </Button>
                        </p>
                    )
                )}
            </div>
        </Template>
    );
}