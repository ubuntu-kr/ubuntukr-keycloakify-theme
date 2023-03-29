import React from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
// Here use your own KcContext and I18n that you might have overloaded.  
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import type { KcContext as KcContextBase } from "keycloakify/login/kcContext";

import { Row, Col, Card, Button, Form, Input } from "@canonical/react-components";

export default function LoginConfigTotp(props: PageProps<Extract<KcContext, { pageId: "login-config-totp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, ...kcProps } = props;

    const { url, isAppInitiatedAction, totp, mode, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const algToKeyUriAlg: Record<KcContextBase.LoginConfigTotp["totp"]["policy"]["algorithm"], string> = {
        "HmacSHA1": "SHA1",
        "HmacSHA256": "SHA256",
        "HmacSHA512": "SHA512"
    };

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, ...kcProps }}
            headerNode={msg("loginTotpTitle")}>
            <>
                <ol id="kc-totp-settings" className="p-stepped-list">
                    <li className="p-stepped-list__item">
                        <h3 className="p-stepped-list__title">{msg("loginTotpStep1")}</h3>

                        <ul id="kc-totp-supported-apps" className="p-stepped-list__content">
                            {(totp.policy.supportedApplications != null) ? totp.policy.supportedApplications.map(app => (
                                <li>{app}</li>
                            )) : (<></>)}

                        </ul>
                    </li>

                    {mode && mode == "manual" ? (
                        <>
                            <li className="p-stepped-list__item">
                                <h3 className="p-stepped-list__title">{msg("loginTotpManualStep2")}</h3>
                                <p className="p-stepped-list__content">
                                    <span id="kc-totp-secret-key">{totp.totpSecretEncoded}</span>
                                </p>
                                <p className="p-stepped-list__content">
                                    <a href={totp.qrUrl} id="mode-barcode">
                                        {msg("loginTotpScanBarcode")}
                                    </a>
                                </p>
                            </li>
                            <li className="p-stepped-list__item">
                                <h3 className="p-stepped-list__title">{msg("loginTotpManualStep3")}</h3>
                                <p className="p-stepped-list__content">
                                    <ul>
                                        <li id="kc-totp-type">
                                            {msg("loginTotpType")}: {msg(`loginTotp.${totp.policy.type}`)}
                                        </li>
                                        <li id="kc-totp-algorithm">
                                            {msg("loginTotpAlgorithm")}: {algToKeyUriAlg?.[totp.policy.algorithm] ?? totp.policy.algorithm}
                                        </li>
                                        <li id="kc-totp-digits">
                                            {msg("loginTotpDigits")}: {totp.policy.digits}
                                        </li>
                                        {totp.policy.type === "totp" ? (
                                            <li id="kc-totp-period">
                                                {msg("loginTotpInterval")}: {totp.policy.period}
                                            </li>
                                        ) : (
                                            <li id="kc-totp-counter">
                                                {msg("loginTotpCounter")}: {totp.policy.initialCounter}
                                            </li>
                                        )}
                                    </ul>
                                </p>
                            </li>
                        </>
                    ) : (
                        <li className="p-stepped-list__item">
                            <h3 className="p-stepped-list__title">{msg("loginTotpStep2")}</h3>
                            <img id="kc-totp-secret-qr-code" src={`data:image/png;base64, ${totp.totpSecretQrCode}`} alt="Figure: Barcode" className="p-stepped-list__content" />
                            <br />
                            <p className="p-stepped-list__content">
                                <a href={totp.manualUrl} id="mode-manual">
                                    {msg("loginTotpUnableToScan")}
                                </a>
                            </p>
                        </li>
                    )}
                    <li className="p-stepped-list__item">
                        <h3 className="p-stepped-list__title">{msg("loginTotpStep3")}</h3>
                        <p className="p-stepped-list__content">{msg("loginTotpStep3DeviceName")}</p>
                    </li>
                </ol>

                <Form action={url.loginAction} id="kc-totp-settings-form" method="post">
                    <fieldset>
                        <Input
                            label={msg("authenticatorCode")}
                            type="text"
                            id="totp"
                            name="totp"
                            error={messagesPerField.existsError("totp") ? messagesPerField.get("totp") : null} />
                        <div>
                            <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
                            {mode && <input type="hidden" id="mode" value={mode} />}
                        </div>
                        <Input
                            label={msg("loginTotpDeviceName")}
                            type="text"
                            id="userLabel"
                            name="userLabel"
                            error={messagesPerField.existsError("userLabel") ? messagesPerField.get("userLabel") : null} />
                        {isAppInitiatedAction ? (
                            <>
                                <Button element={'input'}
                                    className={"p-button"}
                                    id="saveTOTPBtn"
                                    type="submit"
                                    value={msgStr("doSubmit")}
                                    appearance="positive" />
                                <Button element={'button'}
                                    className={"p-button"}
                                    id="cancelTOTPBtn"
                                    type="submit"
                                    name="cancel-aia"
                                    value="true"
                                    appearance="negative">
                                    {msg("doCancel")}
                                </Button>

                            </>
                        ) : (
                            <Button element={'input'}
                                className={"p-button"}
                                id="saveTOTPBtn"
                                type="submit"
                                value={msgStr("doSubmit")}
                                appearance="positive" />
                        )}
                    </fieldset>
                </Form>
            </>
        </Template>
    );
}