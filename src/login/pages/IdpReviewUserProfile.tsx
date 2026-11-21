import { useState } from "react";
import type { JSX } from "keycloakify/tools/JSX";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { Button, Form } from "@canonical/react-components";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

type IdpReviewUserProfileProps = PageProps<Extract<KcContext, { pageId: "idp-review-user-profile.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function IdpReviewUserProfile(props: IdpReviewUserProfileProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr } = i18n;

    const { url } = kcContext;

    const [isFomSubmittable, setIsFomSubmittable] = useState(false);

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("loginIdpReviewProfileTitle")}>
            <Form id="kc-idp-review-profile-form" action={url.loginAction} method="post">
                <fieldset>
                    <UserProfileFormFields
                        kcContext={kcContext}
                        i18n={i18n}
                        kcClsx={kcClsx}
                        onIsFormSubmittableValueChange={setIsFomSubmittable}
                        doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                    />
                    <div id="kc-form-buttons">
                        <Button
                            element="input"
                            className="p-button"
                            type="submit"
                            value={msgStr("doSubmit")}
                            disabled={!isFomSubmittable}
                            appearance="positive"
                        />
                    </div>
                </fieldset>
            </Form>
        </Template>
    );
}
