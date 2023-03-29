import React, { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";

import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import { UserProfileFormFields } from "./UserProfileCommons";
import { Button, Form } from "@canonical/react-components";

export default function RegisterUserProfile(props: PageProps<Extract<KcContext, { pageId: "register-user-profile.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        classes
    });

    const { url, messagesPerField, recaptchaRequired, recaptchaSiteKey } = kcContext;

    const { msg, msgStr } = i18n;

    const [isFomSubmittable, setIsFomSubmittable] = useState(false);

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            displayMessage={messagesPerField.exists("global")}
            displayRequiredFields={true}
            headerNode={msg("registerTitle")}>
            <Form id="kc-register-form" action={url.registrationAction} method="post">
                <fieldset>
                    <UserProfileFormFields
                        kcContext={kcContext}
                        onIsFormSubmittableValueChange={setIsFomSubmittable}
                        i18n={i18n}
                        getClassName={getClassName}
                    />
                    {recaptchaRequired && (
                        <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} />
                    )}
                    <Button element={'input'}
                        type="submit"
                        value={msgStr("doRegister")}
                        appearance="positive"
                    />
                    <Button element="a" href={url.loginUrl} appearance="base">
                        {msg("backToLogin")}
                    </Button>
                </fieldset>
            </Form>
        </Template>
    );
}