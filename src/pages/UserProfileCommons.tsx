import React, { useEffect, Fragment } from "react";
import { useCallbackFactory } from "keycloakify/lib/tools/useCallbackFactory";
import { useFormValidationSlice } from "keycloakify/lib/useFormValidationSlice";
import type { KcProps } from "keycloakify/lib/KcProps";
import type { Attribute } from "keycloakify/lib/getKcContext";
import type { I18nBase } from "keycloakify/lib/i18n";
import { Select, Input } from "@canonical/react-components";


export type UserProfileFormFieldsProps = {
    kcContext: Parameters<typeof useFormValidationSlice>[0]["kcContext"];
    i18n: I18nBase;
} & KcProps &
    Partial<Record<"BeforeField" | "AfterField", (props: { attribute: Attribute }) => JSX.Element | null>> & {
        onIsFormSubmittableValueChange: (isFormSubmittable: boolean) => void;
    };

export function UserProfileFormFields({
    kcContext,
    onIsFormSubmittableValueChange,
    i18n,
    BeforeField,
    AfterField,
    ...props
}: UserProfileFormFieldsProps) {
    const { advancedMsg } = i18n;

    const {
        formValidationState: { fieldStateByAttributeName, isFormSubmittable },
        formValidationReducer,
        attributesWithPassword
    } = useFormValidationSlice({
        kcContext,
        i18n
    });

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable]);

    const onChangeFactory = useCallbackFactory(
        (
            [name]: [string],
            [
                {
                    target: { value }
                }
            ]: [React.ChangeEvent<HTMLInputElement | HTMLSelectElement>]
        ) =>
            formValidationReducer({
                "action": "update value",
                name,
                "newValue": value
            })
    );

    const onBlurFactory = useCallbackFactory(([name]: [string]) =>
        formValidationReducer({
            "action": "focus lost",
            name
        })
    );

    let currentGroup = "";

    return (
        <>
            {attributesWithPassword.map((attribute, i) => {
                const { group = "", groupDisplayHeader = "", groupDisplayDescription = "" } = attribute;

                const { value, displayableErrors } = fieldStateByAttributeName[attribute.name];

                return (
                    <Fragment key={i}>
                        {group !== currentGroup && (currentGroup = group) !== "" && (
                            <div>
                                <p className="p-heading--5" id={`header-${group}`}>{advancedMsg(groupDisplayHeader) || currentGroup}</p>
                                {groupDisplayDescription !== "" && (
                                    <p id={`description-${group}`}> {advancedMsg(groupDisplayDescription)}</p>
                                )}
                            </div>
                        )}

                        {BeforeField && <BeforeField attribute={attribute} />}

                        {(() => {
                            const { options } = attribute.validators;

                            if (options !== undefined) {
                                return (
                                    <Select id={attribute.name} name={attribute.name} defaultValue=""
                                        onChange={onChangeFactory(attribute.name)}
                                        onBlur={onBlurFactory(attribute.name)}
                                        value={value}
                                        options={options.options.map(option => {
                                            return {
                                                value: option,
                                                label: option
                                            }
                                        })}
                                        label={advancedMsg(attribute.displayName ?? "")}
                                        error={displayableErrors.length > 0 ? displayableErrors.map(({ errorMessage }) => errorMessage) : null} />
                                );
                            }

                            return (
                                <Input
                                    label={advancedMsg(attribute.displayName ?? "")}
                                    type={(() => {
                                        switch (attribute.name) {
                                            case "password-confirm":
                                            case "password":
                                                return "password";
                                            default:
                                                return "text";
                                        }
                                    })()}
                                    id={attribute.name}
                                    name={attribute.name}
                                    value={value}
                                    onChange={onChangeFactory(attribute.name)}
                                    aria-invalid={displayableErrors.length !== 0}
                                    disabled={attribute.readOnly}
                                    autoComplete={attribute.autocomplete}
                                    onBlur={onBlurFactory(attribute.name)}
                                    error={displayableErrors.length > 0 ? displayableErrors.map(({ errorMessage }) => errorMessage) : null}
                                />
                            );
                        })()}
                        {AfterField && <AfterField attribute={attribute} />}
                    </Fragment>
                );
            })}
        </>
    );
}