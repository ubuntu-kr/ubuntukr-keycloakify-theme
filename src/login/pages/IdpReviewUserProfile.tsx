import React, { useState } from "react";
import { UserProfileFormFields } from "./UserProfileCommons";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Button, Form } from "@canonical/react-components";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";


export default function IdpReviewUserProfile(props: PageProps<Extract<KcContext, { pageId: "idp-review-user-profile.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        classes
    });

    const { msg, msgStr } = i18n;

    const { url } = kcContext;

    const [isFomSubmittable, setIsFomSubmittable] = useState(false);

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            headerNode={msg("loginIdpReviewProfileTitle")}>
            <Form id="kc-idp-review-profile-form" action={url.loginAction} method="post">
                <fieldset>
                    <UserProfileFormFields
                        kcContext={kcContext}
                        onIsFormSubmittableValueChange={setIsFomSubmittable}
                        i18n={i18n}
                        getClassName={getClassName}
                    />

                    <div>
                        <div id="kc-form-options">
                            <div />
                        </div>
                        <div id="kc-form-buttons">
                            <Button element={'input'}
                                className={"p-button"}
                                type="submit"
                                value={msgStr("doSubmit")}
                                disabled={!isFomSubmittable}
                                appearance="positive"
                            />
                        </div>
                    </div>
                </fieldset>
            </Form>
        </Template>
    );
}