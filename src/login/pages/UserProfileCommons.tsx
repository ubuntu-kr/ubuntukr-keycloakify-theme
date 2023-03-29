import React, { useEffect, Fragment } from "react";
import { useFormValidation } from "keycloakify/login/lib/useFormValidation";
import type { ClassKey } from "keycloakify/login/TemplateProps";
import type { Attribute } from "keycloakify/login/kcContext/KcContext";
import type { I18n } from "keycloakify/login/i18n";
import { Select, Input } from "@canonical/react-components";


export type UserProfileFormFieldsProps = {
    kcContext: Parameters<typeof useFormValidation>[0]["kcContext"];
    i18n: I18n;
    getClassName: (classKey: ClassKey) => string;
    onIsFormSubmittableValueChange: (isFormSubmittable: boolean) => void;
    BeforeField?: (props: { attribute: Attribute }) => JSX.Element | null;
    AfterField?: (props: { attribute: Attribute }) => JSX.Element | null;
};

export function UserProfileFormFields(props: UserProfileFormFieldsProps) {
    const { kcContext, onIsFormSubmittableValueChange, i18n, getClassName, BeforeField, AfterField } = props;

    const { advancedMsg } = i18n;

    const {
        formValidationState: { fieldStateByAttributeName, isFormSubmittable },
        formValidationDispatch,
        attributesWithPassword
    } = useFormValidation({
        kcContext,
        i18n
    });

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable]);

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
                                        onChange={event =>
                                            formValidationDispatch({
                                                "action": "update value",
                                                "name": attribute.name,
                                                "newValue": event.target.value
                                            })
                                        }
                                        onBlur={() =>
                                            formValidationDispatch({
                                                "action": "focus lost",
                                                "name": attribute.name
                                            })
                                        }
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
                                    onChange={event =>
                                        formValidationDispatch({
                                            "action": "update value",
                                            "name": attribute.name,
                                            "newValue": event.target.value
                                        })
                                    }
                                    onBlur={() =>
                                        formValidationDispatch({
                                            "action": "focus lost",
                                            "name": attribute.name
                                        })
                                    }
                                    aria-invalid={displayableErrors.length !== 0}
                                    disabled={attribute.readOnly}
                                    autoComplete={attribute.autocomplete}
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