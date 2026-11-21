import "./KcCustomStyle.scss";
import { useEffect, useState } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import { Tooltip, Strip, Col, Notification, Button } from "@canonical/react-components";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import logoUrl from "./assets/UbuntuKrCircleWhite.svg";

const severityByMessageType = {
    success: "positive",
    warning: "caution",
    error: "negative",
    info: "information"
} as const;

/**
 * Ubuntu Korea page layout (Vanilla framework): dark navigation bar with the language
 * selector, "suru" title strip, content column and footer.
 * It replaces keycloakify/login/Template for the pages listed in ./KcPage.tsx.
 */
export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, currentLanguage, enabledLanguages } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        if (documentTitle !== undefined) {
            document.title = documentTitle;
        }
    }, [documentTitle]);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    // Loads the scripts Keycloak asks for (kcContext.scripts, e.g. reCAPTCHA) and the
    // session checker. With doUseDefaultCss=false no stylesheet is fetched.
    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    const [isLangSelectorHidden, setIsLangSelectorHidden] = useState(true);

    if (!isReadyToRender) {
        return null;
    }

    const isUsernameShown = auth !== undefined && auth.showUsername && !auth.showResetCredentials;

    const attemptedUsernameNode = (
        <div id="kc-username">
            <Button appearance="base" type="button">
                <i className="p-icon--user"></i> <span id="kc-attempted-username">{auth?.attemptedUsername}</span>
            </Button>
            <Tooltip message={msg("restartLoginTooltip")}>
                <Button appearance="base" element="a" id="reset-login" href={url.loginRestartFlowUrl}>
                    <i className="p-icon--close"></i>
                </Button>
            </Tooltip>
        </div>
    );

    return (
        <div className="l-site">
            <header id="navigation" className="p-navigation is-dark">
                <div className="p-navigation__row">
                    <div className="p-navigation__banner">
                        <div className="p-navigation__tagged-logo">
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a className="p-navigation__link" href="#">
                                <div className="p-navigation__logo-tag">
                                    <img className="p-navigation__logo-icon" src={logoUrl} alt="" />
                                </div>
                                <span className="p-navigation__logo-title">{msg("loginTitleHtml", realm.displayName || realm.name)}</span>
                            </a>
                        </div>
                        <a href="#navigation" className="p-navigation__toggle--open" title="menu">
                            Menu
                        </a>
                        <a href="#navigation-closed" className="p-navigation__toggle--close" title="close menu">
                            Close menu
                        </a>
                    </div>
                    <nav className="p-navigation__nav" aria-label="Site navigation">
                        <ul className="p-navigation__items">
                            <li className="p-navigation__item">
                                <a className="p-navigation__link" href="https://ubuntu-kr.org">
                                    ubuntu-kr.org
                                </a>
                            </li>
                        </ul>
                        {enabledLanguages.length > 1 && (
                            <ul className="p-navigation__items">
                                <li className={clsx("p-navigation__item--dropdown-toggle", !isLangSelectorHidden && "is-active")} id="kc-locale">
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a
                                        className="p-navigation__link"
                                        id="kc-current-locale-link"
                                        href="#"
                                        role="button"
                                        aria-controls="language-switch"
                                        aria-expanded={!isLangSelectorHidden}
                                        onClick={event => {
                                            event.preventDefault();
                                            setIsLangSelectorHidden(!isLangSelectorHidden);
                                        }}
                                    >
                                        {currentLanguage.label}
                                    </a>
                                    <ul className="p-navigation__dropdown--right" id="language-switch" aria-hidden={isLangSelectorHidden}>
                                        {enabledLanguages.map(({ languageTag, label, href }) => (
                                            <li key={languageTag}>
                                                <a href={href} className="p-navigation__dropdown-item" id={`language-${languageTag}`}>
                                                    {label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        )}
                    </nav>
                </div>
            </header>

            {/* Page title area */}
            <Strip shallow includeCol={false} element="section" type="suru-topped" rowClassName="u-vertically-center">
                <Col size={8}>
                    {/* When Keycloak shows the attempted username (e.g. OTP step) it stands in for the title. */}
                    <h2 id="kc-page-title">{!isUsernameShown && headerNode}</h2>
                </Col>
            </Strip>

            <Strip includeCol={false} element="section" rowClassName="u-vertically-center">
                <Col size={8}>
                    {displayRequiredFields && (
                        <div className="subtitle">
                            <span className="required">*</span> {msg("requiredFields")}
                        </div>
                    )}
                    {isUsernameShown && attemptedUsernameNode}
                    {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                    {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                        <Notification severity={severityByMessageType[message.type]}>
                            <span className="kc-feedback-text" dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                        </Notification>
                    )}
                    {children}
                    {auth !== undefined && auth.showTryAnotherWayLink && (
                        <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                            <input type="hidden" name="tryAnotherWay" value="on" />
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a
                                href="#"
                                id="try-another-way"
                                onClick={event => {
                                    event.preventDefault();
                                    document.forms["kc-select-try-another-way-form" as never].requestSubmit();
                                }}
                            >
                                {msg("doTryAnotherWay")}
                            </a>
                        </form>
                    )}
                    {socialProvidersNode}
                    {displayInfo && (
                        <div id="kc-info">
                            <div id="kc-info-wrapper">{infoNode}</div>
                        </div>
                    )}
                </Col>
            </Strip>

            <footer className="l-footer--sticky p-strip--light">
                <nav className="row" aria-label="Footer">
                    <div className="has-cookie">
                        <p>© 2023-Present Ubuntu Korea Community.</p>
                        <ul className="p-inline-list--middot">
                            <li className="p-inline-list__item">
                                <a href="https://ubuntu.com/community/code-of-conduct">
                                    <small>우분투 행동강령 (Ubuntu Code of Conducts)</small>
                                </a>
                            </li>
                            <li className="p-inline-list__item">
                                <a href="https://disclosures.ubuntu-kr.org/legal/">
                                    <small>정관 및 세칙 (Articles and bylaws)</small>
                                </a>
                            </li>
                            <li className="p-inline-list__item">
                                <a href="https://disclosures.ubuntu-kr.org/privacy-policy/">
                                    <small>개인정보처리방침 (Privacy policy)</small>
                                </a>
                            </li>
                            <li className="p-inline-list__item">
                                <a href="mailto:contact@ubuntu-kr.org">
                                    <small>문의 (Contact)</small>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </footer>
        </div>
    );
}
