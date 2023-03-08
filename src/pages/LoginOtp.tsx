import React, { useEffect } from "react";

// You can replace all relative imports by cherry picking files from the keycloakify module.  
// For example, the following import:  
// import { clsx } from "./tools/clsx";
// becomes:  
import type { PageProps } from "keycloakify/lib/KcProps";
// Here use your own KcContext and I18n that you might have overloaded.  
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Row, Col, Card, Button, Form, Input } from "@canonical/react-components";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, doFetchDefaultThemeResources = true, Template, ...kcProps } = props;

    const { otpLogin, url } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            {...{ kcContext, i18n, doFetchDefaultThemeResources, ...kcProps }}
            headerNode={msg("doLogIn")}
            formNode={
                <Form id="kc-otp-login-form" action={url.loginAction} method="post">
                    <fieldset>
                        {otpLogin.userOtpCredentials.length > 1 && (
                            <Row>
                                {otpLogin.userOtpCredentials.map(otpCredential => (
                                    <Col size={3} key={otpCredential.id}>
                                        <Card>
                                            <label style={{ width: "100%" }}>
                                                <div style={{ marginLeft: "85%" }}>
                                                    <Input type="radio" name="selectedCredentialId" value={otpCredential.id} />
                                                </div>
                                                <h1>📱</h1>
                                                <h1>{otpCredential.userLabel}</h1>
                                            </label>
                                        </Card>

                                    </Col>
                                ))}
                            </Row>)}
                        <Input autoFocus
                            id="otp"
                            name="otp"
                            type="text"
                            autoComplete="off"
                            label={msg("loginOtpOneTime")} />

                        <Button element={'input'}
                            className={"p-button"}
                            name="login"
                            id="kc-login"
                            type="submit"
                            value={msgStr("doLogIn")}
                            appearance="positive"
                        />
                    </fieldset>
                </Form>
            }
        />
    );
}
