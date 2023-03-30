import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import { useGetClassName } from "keycloakify/account/lib/useGetClassName";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Form, Button, Input, Card, MainTable } from "@canonical/react-components";

export default function Sessions(props: PageProps<Extract<KcContext, { pageId: "applications.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        "classes": {
            ...classes,
            "kcBodyClass": clsx(classes?.kcBodyClass, "user")
        }
    });

    const { url, realm, messagesPerField, stateChecker, applications } = kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="applications">
            <h2>{msg("applicationsHtmlTitle")}</h2>
            <Form action={url.applicationsUrl} method="post">
                <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />
                <input type="hidden" id="referrer" name="referrer" value={stateChecker} />
                {applications.applications.map((app, index) => (
                    <Card>
                        <div>
                            <Button element={"a"} href={app.effectiveUrl ? app.effectiveUrl : undefined} appearance="base">
                                <h3>{app.client.name ? advancedMsg(app.client.name) : app.client.clientId}</h3>
                            </Button>
                            {((app.client.consentRequired && app.clientScopesGranted.length > 0) || app.additionalGrants.length > 0) ? (
                                <Button appearance="negative" id={`revoke-${app.client.clientId}`}
                                    name='clientId' value={app.client.id}>
                                    {msg("revoke")}
                                </Button>
                            ) : (<></>)}
                        </div>

                        <MainTable
                            rows={[
                                {
                                    columns: [
                                        {
                                            content: msgStr("availableRoles"),
                                            role: "rowheader"
                                        },
                                        {
                                            content: (<>
                                                {app.realmRolesAvailable.map((role, index) => (
                                                    <span>{role.description ? advancedMsg(role.description) : advancedMsg(role.name)}{index + 1 < app.realmRolesAvailable.length ? ", " : ""}</span>
                                                ))}
                                                {Object.keys(app.resourceRolesAvailable).map((resource, index) => (
                                                    <span>
                                                        {app.realmRolesAvailable ? ", " : ""}
                                                        {app.resourceRolesAvailable[resource].map((clientRole, index) => (
                                                            <>
                                                                {clientRole.roleDescription ? advancedMsg(clientRole.roleDescription) : clientRole.roleName}
                                                                {" "}{msg("inResource")}{" "}
                                                                <strong>{clientRole.clientName ? advancedMsg(clientRole.clientName) : clientRole.clientId}</strong>
                                                                {index + 1 < app.resourceRolesAvailable[resource]?.length ? ", " : ""}
                                                            </>
                                                        ))}
                                                    </span>
                                                ))}
                                            </>)
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            content: msgStr("grantedPermissions"),
                                            role: "rowheader"
                                        },
                                        {
                                            content: (<>
                                                {app.client.consentRequired ? (
                                                    <span>
                                                        {app.clientScopesGranted.map((claim, index) => (
                                                            <>
                                                                {advancedMsg(claim)}
                                                                {index + 1 < app.clientScopesGranted.length ? ", " : ""}
                                                            </>
                                                        ))}
                                                    </span>
                                                ) : (<span>{msg("fullAccess")}</span>)}
                                            </>)
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            content: msgStr("additionalGrants"),
                                            role: "rowheader"
                                        },
                                        {
                                            content: (<span>{app.additionalGrants.join(", ")}</span>)
                                        }
                                    ]
                                },
                            ]}
                        />
                    </Card>
                ))}
            </Form>
        </Template>
    );
}