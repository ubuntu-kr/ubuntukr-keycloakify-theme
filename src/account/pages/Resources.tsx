import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import { useGetClassName } from "keycloakify/account/lib/useGetClassName";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Form, Button, Input, MainTable, SearchAndFilter } from "@canonical/react-components";

export default function Resources(props: PageProps<Extract<KcContext, { pageId: "resources.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        "classes": {
            ...classes,
            "kcBodyClass": clsx(classes?.kcBodyClass, "user")
        }
    });

    const { url, realm, messagesPerField, stateChecker, authorization } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="sessions">

            <h2>{msg("myResources")}</h2>

            <div className="p-tabs">
                <div className="p-tabs__list" role="tablist" aria-label="Juju technology">
                    <div className="p-tabs__item">
                        <button className="p-tabs__link" role="tab" aria-selected="true" aria-controls="needMyApproval-tab" id="needMyApproval">{msg("needMyApproval")}</button>
                    </div>
                    <div className="p-tabs__item">
                        <button className="p-tabs__link" role="tab" aria-selected="false" aria-controls="myResourcesSub-tab" id="myResourcesSub" tabIndex={-1}>{msg("myResourcesSub")}</button>
                    </div>
                    <div className="p-tabs__item">
                        <button className="p-tabs__link" role="tab" aria-selected="false" aria-controls="resourcesSharedWithMe-tab" id="resourcesSharedWithMe" tabIndex={-1}>{msg("resourcesSharedWithMe")}</button>
                    </div>
                    <div className="p-tabs__item">
                        <button className="p-tabs__link" role="tab" aria-selected="false" aria-controls="requestsWaitingApproval-tab" id="requestsWaitingApproval" tabIndex={-1}>{msg("requestsWaitingApproval")}</button>
                    </div>
                </div>

                <div tabIndex={0} role="tabpanel" id="needMyApproval-tab" aria-labelledby="needMyApproval">
                    <MainTable
                        headers={[
                            {
                                content: msg("resource")
                            },
                            {
                                content: msg("requestor")
                            },
                            {
                                content: msg("permissionRequestion")
                            },
                            {
                                content: msg("action")
                            }
                        ]}
                        rows={authorization.resourcesWaitingApproval.map(resource => {
                            resource.permissions.map(permission => {
                                return {
                                    columns: [
                                        {
                                            content: resource.displayName ? resource.displayName : resource.name,
                                        },
                                        {
                                            content: permission.requester.email? permission.requester.email : permission.requester.username
                                        },
                                        {
                                            content: <>
                                            <SearchAndFilter/>
                                            </>,
                                        },
                                        {
                                            content: permission.permission.name,
                                        }
                                    ]
                            }
                        })
                        })}
                    />
                </div>

                <div tabIndex={0} role="tabpanel" id="myResourcesSub-tab" aria-labelledby="myResourcesSub" hidden={true}>
                    <p>A set of tools to help you write Charmed Operators and to package them as Charms.</p>
                </div>

                <div tabIndex={0} role="tabpanel" id="resourcesSharedWithMe-tab" aria-labelledby="resourcesSharedWithMe" hidden={true}>
                    <p>A repository for charms - from Observability to Data to Identity and more.</p>
                </div>

                <div tabIndex={0} role="tabpanel" id="requestsWaitingApproval-tab" aria-labelledby="requestsWaitingApproval" hidden={true}>
                    <p>A repository for charms - from Observability to Data to Identity and more.</p>
                </div>
            </div>

        </Template>
    );
}