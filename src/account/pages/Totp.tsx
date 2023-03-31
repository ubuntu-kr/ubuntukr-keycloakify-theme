import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import { useGetClassName } from "keycloakify/account/lib/useGetClassName";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Form, Button, Accordion, Input, Card, List, Row, Col } from "@canonical/react-components";

export default function Sessions(props: PageProps<Extract<KcContext, { pageId: "totp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        "classes": {
            ...classes,
            "kcBodyClass": clsx(classes?.kcBodyClass, "user")
        }
    });

    const { url, mode, realm, messagesPerField, stateChecker, totp } = kcContext;

    const { msg, msgStr } = i18n;

    const totpRegisterSteps = [
        {
            title: msgStr("totpStep1"),
            content: <ul>
                <li>{msg("totpAppFreeOTPName")}</li>
                <li>{msg("totpAppGoogleName")}</li>
                <li>{msg("totpAppMicrosoftAuthenticatorName")}</li>
            </ul>
        }
    ]
    if (mode && mode == "manual") {
        totpRegisterSteps.push({
            title: msgStr("totpManualStep2"),
            content: <>
                <p>{totp.totpSecretEncoded}</p>
                <p><a href={totp.qrUrl} id="mode-barcode">{msg("totpScanBarcode")}</a></p>
            </>
        })
        totpRegisterSteps.push({
            title: msgStr("totpManualStep3"),
            content: <ul>
                <li id="kc-totp-type">{msg("totpType")}: {totp.policy.type == "totp" ? msgStr("totp.totp") : msgStr("totp.hotp")}</li>
                <li id="kc-totp-algorithm">{msg("totpAlgorithm")}: {totp.policy.algorithm}</li>
                <li id="kc-totp-digits">{msg("totpDigits")}: {totp.policy.digits}</li>
            </ul>
        })
    } else {
        totpRegisterSteps.push({
            title: msgStr("totpStep2"),
            content: <>
                <p><img src={`data:image/png;base64, ${totp.totpSecretQrCode}`} alt="Figure: Barcode" /></p>
                <p><a href={totp.manualUrl} id="mode-manual">{msg("totpUnableToScan")}</a></p>
            </>
        })
    }
    totpRegisterSteps.push({
        title: msgStr("totpStep3"),
        content: <p>{msg("totpStep3DeviceName")}</p>
    })

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="totp">

            <h2>{msg("authenticatorTitle")}</h2>
            {totp.otpCredentials.length <= 0 ? (<>
                <h1 className="p-heading--6">* {msg("requiredFields")}</h1>
            </>) : (<></>)}

            {totp.enabled ? (
                <Row>
                    {totp.otpCredentials.map((otpCredential, index) => (
                        <Col size={4}>
                            <Card title={otpCredential.userLabel}>
                                <h4>{msg("mobile")}</h4>
                                <p>{otpCredential.id}</p>
                                <Form action={url.totpUrl} method="post">
                                    <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />
                                    <input type="hidden" id="submitAction" name="submitAction" value="Delete" />
                                    <input type="hidden" id="credentialId" name="credentialId" value={otpCredential.id} />
                                    <Button hasIcon id="remove-mobile" appearance="negative">
                                        <i className="p-icon--delete"></i>
                                        <span>{msg("doRemove")}</span>
                                    </Button>
                                </Form>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (<></>)}
            <Accordion
                expanded={!totp.enabled || mode ? "addTotp" : undefined}
                sections={[
                    {
                        key: "addTotp",
                        content: (<>
                            <List items={totpRegisterSteps} stepped />
                            <Form action={url.totpUrl} method="post">
                                <fieldset>
                                    <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />
                                    <Input
                                        label={msg("authenticatorCode")}
                                        type="text"
                                        id="totp" name="totp"
                                        error={messagesPerField.existsError("totp") ? messagesPerField.get("totp") : null} />
                                    <div>
                                        <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
                                        {mode && <input type="hidden" id="mode" value={mode} />}
                                    </div>
                                    <Input
                                        label={msg("totpDeviceName")}
                                        type="text"
                                        id="userLabel"
                                        name="userLabel"
                                        error={messagesPerField.existsError("userLabel") ? messagesPerField.get("userLabel") : null} />
                                    <Button element={'input'}
                                        className={"p-button"}
                                        id="saveTOTPBtn"
                                        type="submit"
                                        name="submitAction" value="Save"
                                        appearance="positive">
                                        {msg("doSave")}
                                    </Button>
                                    <Button element={'button'}
                                        className={"p-button"}
                                        id="cancelTOTPBtn"
                                        type="submit"
                                        name="submitAction" value="Cancel"
                                        appearance="negative">
                                        {msg("doCancel")}
                                    </Button>
                                </fieldset>
                            </Form>
                        </>),
                        title: msgStr("doAdd")
                    }
                ]}
                titleElement="h3"
            />
        </Template>
    );
}