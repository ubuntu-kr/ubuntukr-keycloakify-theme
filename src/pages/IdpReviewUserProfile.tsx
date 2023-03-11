import React, { useState } from "react";
import { clsx } from "keycloakify/lib/tools/clsx";
import { UserProfileFormFields } from "./UserProfileCommons";
import type { PageProps } from "keycloakify/lib/KcProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Button, Form } from "@canonical/react-components";

export default function IdpReviewUserProfile(props: PageProps<Extract<KcContext, { pageId: "idp-review-user-profile.ftl" }>, I18n>) {
    const { kcContext, i18n, doFetchDefaultThemeResources = true, Template, ...kcProps } = props;

    const { msg, msgStr } = i18n;

    const { url } = kcContext;

    const [isFomSubmittable, setIsFomSubmittable] = useState(false);

    return (
        <Template
            {...{ kcContext, i18n, doFetchDefaultThemeResources, ...kcProps }}
            headerNode={msg("loginIdpReviewProfileTitle")}
            formNode={
                <Form id="kc-idp-review-profile-form" action={url.loginAction} method="post">
                    <fieldset>
                        <UserProfileFormFields kcContext={kcContext} onIsFormSubmittableValueChange={setIsFomSubmittable} i18n={i18n} {...kcProps} />

                        <div className={clsx(kcProps.kcFormGroupClass)}>
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
            }
        />
    );
}