import { useEffect, Fragment } from "react";
import { assert } from "keycloakify/tools/assert";
import {
    useUserProfileForm,
    getButtonToDisplayForMultivaluedAttributeField,
    type FormAction,
    type FormFieldError
} from "keycloakify/login/lib/useUserProfileForm";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { Attribute } from "keycloakify/login/KcContext";
import { Button, CheckboxInput, Field, Input, RadioInput, Select, Textarea } from "@canonical/react-components";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";

const registerFieldOrder = ["firstName", "lastName", "email", "username"];

function getRegisterRank(attributeName: string) {
    const index = registerFieldOrder.indexOf(attributeName);
    return index === -1 ? registerFieldOrder.length : index;
}

/**
 * Vanilla framework rendering of the fields of the declarative user profile
 * (kcContext.profile.attributesByName), used by the register, review profile and
 * update profile forms. Counterpart of keycloakify/login/UserProfileFormFields.
 */
export default function UserProfileFormFields(props: UserProfileFormFieldsProps<KcContext, I18n>) {
    const { kcContext, i18n, kcClsx, onIsFormSubmittableValueChange, doMakeUserConfirmPassword, BeforeField, AfterField } = props;

    const { advancedMsg } = i18n;

    const {
        formState: { formFieldStates, isFormSubmittable },
        dispatchFormAction
    } = useUserProfileForm({
        kcContext,
        i18n,
        doMakeUserConfirmPassword
    });

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable]);

    // The registration form keeps the field order it always had in this theme
    // (name, surname, e-mail, username, then the rest in user profile order).
    const orderedFormFieldStates =
        kcContext.pageId === "register.ftl"
            ? [...formFieldStates]
                  .map((formFieldState, index) => ({ formFieldState, index }))
                  .sort((a, b) => getRegisterRank(a.formFieldState.attribute.name) - getRegisterRank(b.formFieldState.attribute.name) || a.index - b.index)
                  .map(({ formFieldState }) => formFieldState)
            : formFieldStates;

    let currentGroupName = "";

    return (
        <>
            {orderedFormFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => {
                const groupNode = (() => {
                    const groupName = attribute.group?.name ?? "";

                    if (groupName === currentGroupName) {
                        return null;
                    }

                    currentGroupName = groupName;

                    if (attribute.group === undefined || groupName === "") {
                        return null;
                    }

                    const { displayHeader = "", displayDescription = "" } = attribute.group;

                    return (
                        <div>
                            <p className="p-heading--5" id={`header-${groupName}`}>
                                {displayHeader !== "" ? advancedMsg(displayHeader) : groupName}
                            </p>
                            {displayDescription !== "" && <p id={`description-${groupName}`}>{advancedMsg(displayDescription)}</p>}
                        </div>
                    );
                })();

                const isHidden =
                    attribute.annotations.inputType === "hidden" || (attribute.name === "password-confirm" && !doMakeUserConfirmPassword);

                return (
                    <Fragment key={attribute.name}>
                        {groupNode}
                        {BeforeField !== undefined && (
                            <BeforeField
                                attribute={attribute}
                                dispatchFormAction={dispatchFormAction}
                                displayableErrors={displayableErrors}
                                valueOrValues={valueOrValues}
                                kcClsx={kcClsx}
                                i18n={i18n}
                            />
                        )}
                        <div style={{ display: isHidden ? "none" : undefined }}>
                            {attribute.annotations.inputHelperTextBefore !== undefined && (
                                <p className="p-form-help-text" id={`form-help-text-before-${attribute.name}`} aria-live="polite">
                                    {advancedMsg(attribute.annotations.inputHelperTextBefore)}
                                </p>
                            )}
                            <InputFieldByType
                                attribute={attribute}
                                valueOrValues={valueOrValues}
                                displayableErrors={displayableErrors}
                                dispatchFormAction={dispatchFormAction}
                                i18n={i18n}
                            />
                        </div>
                        {AfterField !== undefined && (
                            <AfterField
                                attribute={attribute}
                                dispatchFormAction={dispatchFormAction}
                                displayableErrors={displayableErrors}
                                valueOrValues={valueOrValues}
                                kcClsx={kcClsx}
                                i18n={i18n}
                            />
                        )}
                    </Fragment>
                );
            })}
        </>
    );
}

type InputFieldByTypeProps = {
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: React.Dispatch<FormAction>;
    i18n: I18n;
};

/** Label, help text and error message shared by every kind of field. */
function getFieldProps(props: InputFieldByTypeProps & { fieldIndex?: number }) {
    const { attribute, displayableErrors, i18n, fieldIndex } = props;

    const { advancedMsg } = i18n;

    const errors = displayableErrors.filter(error => error.fieldIndex === fieldIndex);

    return {
        label: advancedMsg(attribute.displayName ?? ""),
        help:
            attribute.annotations.inputHelperTextAfter === undefined ? undefined : advancedMsg(attribute.annotations.inputHelperTextAfter),
        error:
            errors.length === 0 ? null : (
                <span id={`input-error-${attribute.name}${fieldIndex === undefined ? "" : `-${fieldIndex}`}`} aria-live="polite">
                    {errors.map(({ errorMessage }, i) => (
                        <Fragment key={i}>
                            {errorMessage}
                            {errors.length - 1 !== i && <br />}
                        </Fragment>
                    ))}
                </span>
            ),
        html5DataAnnotations: Object.fromEntries(
            Object.entries(attribute.html5DataAnnotations ?? {}).map(([key, value]) => [`data-${key}`, value])
        )
    };
}

function InputFieldByType(props: InputFieldByTypeProps) {
    const { attribute, valueOrValues } = props;

    switch (attribute.annotations.inputType) {
        case "hidden":
            return <input type="hidden" name={attribute.name} value={valueOrValues} />;
        case "textarea":
            return <TextareaTag {...props} />;
        case "select":
        case "multiselect":
            return <SelectTag {...props} />;
        case "select-radiobuttons":
        case "multiselect-checkboxes":
            return <InputTagSelects {...props} />;
        default:
            if (valueOrValues instanceof Array) {
                return (
                    <>
                        {valueOrValues.map((...[, i]) => (
                            <InputTag key={i} {...props} fieldIndex={i} />
                        ))}
                    </>
                );
            }

            return <InputTag {...props} fieldIndex={undefined} />;
    }
}

function InputTag(props: InputFieldByTypeProps & { fieldIndex: number | undefined }) {
    const { attribute, fieldIndex, dispatchFormAction, valueOrValues, i18n } = props;

    const { advancedMsgStr, msg } = i18n;

    const { label, help, error, html5DataAnnotations } = getFieldProps(props);

    const { annotations } = attribute;

    const toInt = (value: string | number | undefined) => (value === undefined ? undefined : parseInt(`${value}`));

    return (
        <>
            <Input
                // Only the first input of a multivalued attribute carries the label.
                label={fieldIndex === undefined || fieldIndex === 0 ? label : undefined}
                help={help}
                error={error}
                type={(() => {
                    if (attribute.name === "password" || attribute.name === "password-confirm") {
                        return "password";
                    }

                    const { inputType } = annotations;

                    if (inputType?.startsWith("html5-")) {
                        return inputType.slice(6);
                    }

                    return inputType ?? "text";
                })()}
                id={fieldIndex === undefined || fieldIndex === 0 ? attribute.name : `${attribute.name}-${fieldIndex}`}
                name={attribute.name}
                value={(() => {
                    if (fieldIndex !== undefined) {
                        assert(valueOrValues instanceof Array);
                        return valueOrValues[fieldIndex];
                    }

                    assert(typeof valueOrValues === "string");

                    return valueOrValues;
                })()}
                disabled={attribute.readOnly}
                autoComplete={attribute.autocomplete}
                placeholder={annotations.inputTypePlaceholder === undefined ? undefined : advancedMsgStr(annotations.inputTypePlaceholder)}
                pattern={annotations.inputTypePattern}
                size={toInt(annotations.inputTypeSize)}
                maxLength={toInt(annotations.inputTypeMaxlength)}
                minLength={toInt(annotations.inputTypeMinlength)}
                max={annotations.inputTypeMax}
                min={annotations.inputTypeMin}
                step={annotations.inputTypeStep}
                {...html5DataAnnotations}
                onChange={event =>
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: (() => {
                            if (fieldIndex !== undefined) {
                                assert(valueOrValues instanceof Array);

                                return valueOrValues.map((value, i) => (i === fieldIndex ? event.target.value : value));
                            }

                            return event.target.value;
                        })()
                    })
                }
                onBlur={() =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex
                    })
                }
            />
            {(() => {
                if (fieldIndex === undefined) {
                    return null;
                }

                assert(valueOrValues instanceof Array);

                const values = valueOrValues;

                const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({ attribute, values, fieldIndex });

                const idPostfix = `-${attribute.name}-${fieldIndex + 1}`;

                return (
                    <>
                        {hasRemove && (
                            <Button
                                id={`kc-remove${idPostfix}`}
                                type="button"
                                appearance="link"
                                onClick={() =>
                                    dispatchFormAction({
                                        action: "update",
                                        name: attribute.name,
                                        valueOrValues: values.filter((_, i) => i !== fieldIndex)
                                    })
                                }
                            >
                                {msg("remove")}
                            </Button>
                        )}
                        {hasAdd && (
                            <Button
                                id={`kc-add${idPostfix}`}
                                type="button"
                                appearance="link"
                                onClick={() =>
                                    dispatchFormAction({
                                        action: "update",
                                        name: attribute.name,
                                        valueOrValues: [...values, ""]
                                    })
                                }
                            >
                                {msg("addValue")}
                            </Button>
                        )}
                    </>
                );
            })()}
        </>
    );
}

function getOptions(attribute: Attribute): string[] {
    walk: {
        const { inputOptionsFromValidation } = attribute.annotations;

        if (inputOptionsFromValidation === undefined) {
            break walk;
        }

        const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

        if (validator === undefined || validator.options === undefined) {
            break walk;
        }

        return validator.options;
    }

    return attribute.validators.options?.options ?? [];
}

function inputLabel(i18n: I18n, attribute: Attribute, option: string) {
    const { advancedMsg } = i18n;

    if (attribute.annotations.inputOptionLabels !== undefined) {
        const { inputOptionLabels } = attribute.annotations;

        return advancedMsg(inputOptionLabels[option] ?? option);
    }

    if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
        return advancedMsg(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`);
    }

    return option;
}

function InputTagSelects(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, i18n, valueOrValues } = props;

    const { label, help, error } = getFieldProps(props);

    const isRadio = attribute.annotations.inputType === "select-radiobuttons";

    const TickInput = isRadio ? RadioInput : CheckboxInput;

    return (
        <Field label={label} help={help} error={error} forId={`${attribute.name}-${getOptions(attribute)[0]}`}>
            {getOptions(attribute).map(option => (
                <TickInput
                    key={option}
                    id={`${attribute.name}-${option}`}
                    name={attribute.name}
                    value={option}
                    label={inputLabel(i18n, attribute, option)}
                    disabled={attribute.readOnly}
                    checked={valueOrValues instanceof Array ? valueOrValues.includes(option) : valueOrValues === option}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: (() => {
                                const isChecked = event.target.checked;

                                if (valueOrValues instanceof Array) {
                                    const newValues = [...valueOrValues];

                                    if (isChecked) {
                                        newValues.push(option);
                                    } else {
                                        newValues.splice(newValues.indexOf(option), 1);
                                    }

                                    return newValues;
                                }

                                return isChecked ? option : "";
                            })()
                        })
                    }
                    onBlur={() =>
                        dispatchFormAction({
                            action: "focus lost",
                            name: attribute.name,
                            fieldIndex: undefined
                        })
                    }
                />
            ))}
        </Field>
    );
}

function TextareaTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, valueOrValues } = props;

    const { label, help, error, html5DataAnnotations } = getFieldProps(props);

    assert(typeof valueOrValues === "string");

    const toInt = (value: string | number | undefined) => (value === undefined ? undefined : parseInt(`${value}`));

    return (
        <Textarea
            label={label}
            help={help}
            error={error}
            id={attribute.name}
            name={attribute.name}
            disabled={attribute.readOnly}
            cols={toInt(attribute.annotations.inputTypeCols)}
            rows={toInt(attribute.annotations.inputTypeRows)}
            maxLength={toInt(attribute.annotations.inputTypeMaxlength)}
            value={valueOrValues}
            {...html5DataAnnotations}
            onChange={event =>
                dispatchFormAction({
                    action: "update",
                    name: attribute.name,
                    valueOrValues: event.target.value
                })
            }
            onBlur={() =>
                dispatchFormAction({
                    action: "focus lost",
                    name: attribute.name,
                    fieldIndex: undefined
                })
            }
        />
    );
}

function SelectTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, i18n, valueOrValues } = props;

    const { label, help, error, html5DataAnnotations } = getFieldProps(props);

    const isMultiple = attribute.annotations.inputType === "multiselect";

    return (
        <Select
            label={label}
            help={help}
            error={error}
            id={attribute.name}
            name={attribute.name}
            disabled={attribute.readOnly}
            multiple={isMultiple}
            size={attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`)}
            value={valueOrValues}
            {...html5DataAnnotations}
            onChange={event =>
                dispatchFormAction({
                    action: "update",
                    name: attribute.name,
                    valueOrValues: isMultiple ? Array.from(event.target.selectedOptions).map(option => option.value) : event.target.value
                })
            }
            onBlur={() =>
                dispatchFormAction({
                    action: "focus lost",
                    name: attribute.name,
                    fieldIndex: undefined
                })
            }
            options={[
                ...(isMultiple ? [] : [{ value: "", label: "" }]),
                ...getOptions(attribute).map(option => ({
                    value: option,
                    // <option> only takes text, the label can not be a React node here
                    label: inputLabelStr(i18n, attribute, option)
                }))
            ]}
        />
    );
}

function inputLabelStr(i18n: I18n, attribute: Attribute, option: string) {
    const { advancedMsgStr } = i18n;

    if (attribute.annotations.inputOptionLabels !== undefined) {
        return advancedMsgStr(attribute.annotations.inputOptionLabels[option] ?? option);
    }

    if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
        return advancedMsgStr(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`);
    }

    return option;
}
