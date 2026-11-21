import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { Button } from "@canonical/react-components";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Info(props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { advancedMsgStr, msg } = i18n;

    const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client } = kcContext;

    const link = (() => {
        if (skipLink) {
            return undefined;
        }

        if (pageRedirectUri) {
            return { href: pageRedirectUri, label: msg("backToApplication") };
        }

        if (actionUri) {
            return { href: actionUri, label: msg("proceedWithAction") };
        }

        if (client.baseUrl) {
            return { href: client.baseUrl, label: msg("backToApplication") };
        }

        return undefined;
    })();

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={
                <span
                    dangerouslySetInnerHTML={{
                        __html: kcSanitize(messageHeader ? advancedMsgStr(messageHeader) : message.summary)
                    }}
                />
            }
        >
            <div id="kc-info-message">
                <p
                    className="instruction"
                    dangerouslySetInnerHTML={{
                        __html: kcSanitize(
                            (() => {
                                let html = message.summary?.trim();

                                if (requiredActions) {
                                    html += " <b>";
                                    html += requiredActions.map(requiredAction => advancedMsgStr(`requiredAction.${requiredAction}`)).join(", ");
                                    html += "</b>";
                                }

                                return html;
                            })()
                        )
                    }}
                />
                {link !== undefined && (
                    <p>
                        <Button element="a" href={link.href} appearance="base">
                            {link.label}
                        </Button>
                    </p>
                )}
            </div>
        </Template>
    );
}
