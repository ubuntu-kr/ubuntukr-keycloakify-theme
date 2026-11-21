import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { Row, Col, Card, Button, Form, Input } from "@canonical/react-components";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { otpLogin, url, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("totp")}
            headerNode={msg("doLogIn")}
        >
            <Form
                id="kc-otp-login-form"
                action={url.loginAction}
                method="post"
                onSubmit={() => {
                    setIsSubmitting(true);
                    return true;
                }}
            >
                <fieldset>
                    {otpLogin.userOtpCredentials.length > 1 && (
                        <Row>
                            {otpLogin.userOtpCredentials.map(otpCredential => (
                                <Col size={3} key={otpCredential.id}>
                                    <Card>
                                        <label style={{ width: "100%" }}>
                                            <div style={{ marginLeft: "85%" }}>
                                                <Input
                                                    type="radio"
                                                    name="selectedCredentialId"
                                                    value={otpCredential.id}
                                                    defaultChecked={otpCredential.id === otpLogin.selectedCredentialId}
                                                />
                                            </div>
                                            <h1>📱</h1>
                                            <h1>{otpCredential.userLabel}</h1>
                                        </label>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                    <Input
                        autoFocus
                        id="otp"
                        name="otp"
                        type="text"
                        autoComplete="off"
                        label={msg("loginOtpOneTime")}
                        error={
                            messagesPerField.existsError("totp") ? (
                                <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("totp")) }} />
                            ) : null
                        }
                    />

                    <Button
                        element="input"
                        className="p-button"
                        name="login"
                        id="kc-login"
                        type="submit"
                        value={msgStr("doLogIn")}
                        disabled={isSubmitting}
                        appearance="positive"
                    />
                </fieldset>
            </Form>
        </Template>
    );
}
