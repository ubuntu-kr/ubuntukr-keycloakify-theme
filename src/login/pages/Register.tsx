import { useState, useLayoutEffect, lazy, Suspense } from "react";
import type { JSX } from "keycloakify/tools/JSX";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { Button, Form, Input } from "@canonical/react-components";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

// Only needed when the realm asks to accept the terms on the registration form itself.
const TermsText = lazy(() => import("../TermsText"));

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

/**
 * Registration form. The fields come from the realm's declarative user profile.
 * The password fields are only present when Keycloak asks for them
 * (kcContext.passwordRequired); it does not when the password is set after the
 * email verification.
 */
// As before, the register button is not gated by the client side validation:
// invalid input is reported by the server next to the fields.
const ignoreIsFormSubmittable = () => {};

export default function Register(props: RegisterProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { messageHeader, url, messagesPerField, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction, termsAcceptanceRequired } =
        kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const [areTermsAccepted, setAreTermsAccepted] = useState(false);

    useLayoutEffect(() => {
        // Callback of the invisible reCAPTCHA (see the submit button below)
        (window as any)["onSubmitRecaptcha"] = () => {
            (document.getElementById("kc-register-form") as HTMLFormElement).requestSubmit();
        };

        return () => {
            delete (window as any)["onSubmitRecaptcha"];
        };
    }, []);

    const isRecaptchaInvisible = recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
            displayMessage={messagesPerField.exists("global")}
        >
            <Form id="kc-register-form" action={url.registrationAction} method="post">
                <fieldset>
                    <UserProfileFormFields
                        kcContext={kcContext}
                        i18n={i18n}
                        kcClsx={kcClsx}
                        onIsFormSubmittableValueChange={ignoreIsFormSubmittable}
                        doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                    />
                    {termsAcceptanceRequired && (
                        <>
                            <div id="kc-registration-terms-text">
                                <Suspense>
                                    <TermsText i18n={i18n} />
                                </Suspense>
                            </div>
                            <Input
                                type="checkbox"
                                id="termsAccepted"
                                name="termsAccepted"
                                label={msg("acceptTerms")}
                                checked={areTermsAccepted}
                                onChange={event => setAreTermsAccepted(event.target.checked)}
                                error={
                                    messagesPerField.existsError("termsAccepted") ? (
                                        <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("termsAccepted")) }} />
                                    ) : null
                                }
                            />
                        </>
                    )}
                    {recaptchaRequired && !isRecaptchaInvisible && (
                        <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction}></div>
                    )}

                    {isRecaptchaInvisible ? (
                        <Button
                            className="g-recaptcha"
                            data-sitekey={recaptchaSiteKey}
                            data-callback="onSubmitRecaptcha"
                            data-action={recaptchaAction}
                            type="submit"
                            appearance="positive"
                        >
                            {msg("doRegister")}
                        </Button>
                    ) : (
                        <Button
                            element="input"
                            type="submit"
                            value={msgStr("doRegister")}
                            disabled={termsAcceptanceRequired && !areTermsAccepted}
                            appearance="positive"
                        />
                    )}
                    <Button element="a" href={url.loginUrl} appearance="base">
                        {msg("backToLogin")}
                    </Button>
                </fieldset>
            </Form>
        </Template>
    );
}
