import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import { useGetClassName } from "keycloakify/account/lib/useGetClassName";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Form, Button, Input, Card, Col, Row } from "@canonical/react-components";

export default function FederatedIdentity(props: PageProps<Extract<KcContext, { pageId: "federatedIdentity.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        "classes": {
            ...classes,
            "kcBodyClass": clsx(classes?.kcBodyClass, "user")
        }
    });

    const { url, realm, messagesPerField, stateChecker, federatedIdentity } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="social">

            <h2>{msg("federatedIdentitiesHtmlTitle")}</h2>
            <Row>
                {federatedIdentity.identities.map((identity, index) => (
                    <Col size={4}>
                        <Card title={identity.displayName}>
                            <h4>{identity.userName}</h4>
                            {identity.connected && federatedIdentity.removeLinkPossible ? (
                                <Form action={url.socialUrl} method="post">
                                    <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />
                                    <input type="hidden" id="action" name="action" value="remove" />
                                    <input type="hidden" id="providerId" name="providerId" value={identity.providerId!} />
                                    <Button hasIcon id={`remove-link-${identity.providerId!}`} appearance="negative">
                                        <i className="p-icon--delete"></i>
                                        <span>{msg("doRemove")}</span>
                                    </Button>
                                </Form>
                            ) : (
                                <Form action={url.socialUrl} method="post">
                                    <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />
                                    <input type="hidden" id="action" name="action" value="add" />
                                    <input type="hidden" id="providerId" name="providerId" value={identity.providerId!} />
                                    <Button hasIcon id={`remove-link-${identity.providerId!}`} appearance="positive">
                                        <i className="p-icon--plus"></i>
                                        <span>{msg("doAdd")}</span>
                                    </Button>
                                </Form>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>
        </Template>
    );
}