import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import { useGetClassName } from "keycloakify/account/lib/useGetClassName";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Form, Button, Input, Card, List } from "@canonical/react-components";

export default function Sessions(props: PageProps<Extract<KcContext, { pageId: "sessions.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        "classes": {
            ...classes,
            "kcBodyClass": clsx(classes?.kcBodyClass, "user")
        }
    });

    const { url, realm, messagesPerField, stateChecker, sessions } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="sessions">

            <h2>{msg("sessionsHtmlTitle")}</h2>
            {sessions.sessions.map((session, index) => (
                <Card title={session.ipAddress}>
                    <List items={[
                        {
                            content: <><b>{msg("lastAccess")}:</b> {session.lastAccess}</>
                        },
                        {
                            content: <><b>{msg("started")}:</b> {session.started}</>
                        },
                        {
                            content: <><b>{msg("expires")}:</b> {session.expires}</>
                        },
                        {
                            content: <><b>{msg("clients")}:</b> {session.clients.join(", ")}</>
                        }
                    ]} divided split />
                    {sessions.sessions.length > 1 && (
                        <Form method="delete" action={url.sessionsUrl + "/" + session.id}>
                            <Button type="submit" element={"input"} appearance="negative">{msg("doSignOut")}</Button>
                        </Form>
                    )}
                </Card>
            ))}
            {sessions.sessions.length > 1 && (
                <Form action={url.sessionsUrl} method="post">
                    <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />
                    <Button id="logout-all-sessions" appearance="negative">{msg("doLogOutAllSessions")}</Button>
                </Form>
            )}
        </Template>
    );
}