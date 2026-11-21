import type { PageProps } from "keycloakify/login/pages/PageProps";
import { Button, Form } from "@canonical/react-components";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import TermsText from "../TermsText";

export default function Terms(props: PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msg, msgStr } = i18n;

    const { url } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("termsTitle")}
        >
            <div id="kc-terms-text">
                <TermsText i18n={i18n} />
            </div>
            <Form action={url.loginAction} method="POST">
                <Button element="input" name="accept" id="kc-accept" type="submit" value={msgStr("doAccept")} appearance="positive" />
                <Button element="input" name="cancel" id="kc-decline" type="submit" value={msgStr("doDecline")} appearance="negative" />
            </Form>
            <div className="clearfix" />
        </Template>
    );
}
