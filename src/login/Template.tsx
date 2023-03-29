// Copy pasted from: https://github.com/InseeFrLab/keycloakify/blob/main/src/lib/components/shared/Template.tsx

// You can replace all relative imports by cherry picking files from the keycloakify module.  
// For example, the following import:  
// import { assert } from "./tools/assert";
// becomes:  
import { assert } from "keycloakify/tools/assert";
import { clsx } from "keycloakify/tools/clsx";
import { usePrepareTemplate } from "keycloakify/lib/usePrepareTemplate";
import { type TemplateProps } from "keycloakify/login/TemplateProps";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { KcContext } from "./kcContext";
import type { I18n } from "./i18n";
import { Navigation, Tooltip, Strip, Col, Notification, Button, Input } from "@canonical/react-components";
import { useState } from "react";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        displayWide = false,
        showAnotherWayIfPresent = true,
        headerNode,
        showUsernameNode = null,
        infoNode = null,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { getClassName } = useGetClassName({ doUseDefaultCss, classes });

    const { msg, changeLocale, labelBySupportedLanguageTag, currentLanguageTag } = i18n;

    const { realm, locale, auth, url, message, isAppInitiatedAction } = kcContext;

    const { isReady } = usePrepareTemplate({
        "doFetchDefaultThemeResources": doUseDefaultCss,
        url,
        "stylesCommon": [
            "node_modules/patternfly/dist/css/patternfly.min.css",
            "node_modules/patternfly/dist/css/patternfly-additions.min.css",
            "lib/zocial/zocial.css"
        ],
        "styles": ["css/login.css"],
        "htmlClassName": getClassName("kcHtmlClass"),
        "bodyClassName": undefined
    });

    const [isLangSelectorHidden, toggleLangSelector] = useState(true);

    if (!isReady) {
        return null;
    }

    return (
        <div>
            <header id="navigation" className="p-navigation is-dark">
                <div className="p-navigation__row">
                    <div className="p-navigation__banner">
                        <div className="p-navigation__tagged-logo">
                            <a className="p-navigation__link" href="#">
                                <div className="p-navigation__logo-tag">
                                    <img className="p-navigation__logo-icon" src="https://github.com/ubuntu-kr/logo-artworks/raw/main/UbuntuKrCircleWhite.svg" alt="" />
                                </div>
                                <span className="p-navigation__logo-title">{msg("loginTitleHtml", realm.displayName)}</span>
                            </a>
                        </div>
                        <a href="#navigation" className="p-navigation__toggle--open" title="menu">Menu</a>
                        <a href="#navigation-closed" className="p-navigation__toggle--close" title="close menu">Close menu</a>
                    </div>
                    <nav className="p-navigation__nav" aria-label="Example sub navigation">
                        <ul className="p-navigation__items">
                            <li className="p-navigation__item">
                                <a className="p-navigation__link" href="https://ubuntu-kr.org">ubuntu-kr.org</a>
                            </li>
                        </ul>
                        {(realm.internationalizationEnabled && (assert(locale !== undefined), true) && locale.supported.length > 1) ?
                            (
                                <ul className="p-navigation__items">
                                    <li className={`p-navigation__item--dropdown-toggle ${isLangSelectorHidden ? "" : "is-active"}`} id="link-4">
                                        <a className="p-navigation__link" aria-controls="account-menu" onClick={() => toggleLangSelector(!isLangSelectorHidden)}>
                                            {labelBySupportedLanguageTag[currentLanguageTag]}
                                        </a>

                                        <ul className="p-navigation__dropdown--right" id="account-menu" aria-hidden={isLangSelectorHidden}>
                                            {locale.supported.map(({ languageTag }) =>
                                                <li>
                                                    <a onClick={() => changeLocale(languageTag)} className="p-navigation__dropdown-item">{labelBySupportedLanguageTag[languageTag]}</a>
                                                </li>
                                            )}
                                        </ul>
                                    </li>
                                </ul>
                            ) : (<></>)}
                    </nav>
                </div>
            </header >
            {/* Page title area  */}
            <Strip shallow includeCol={false} element="section" type="suru-topped" rowClassName="u-vertically-center">
                <Col size={8}>
                    {!(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                        <h2 id="kc-page-title">{headerNode}</h2>
                    ) : (
                        <h2 id="kc-page-title">{showUsernameNode}</h2>
                    )}
                </Col>
            </Strip>

            <Strip includeCol={false} element="section" rowClassName="u-vertically-center">
                <Col size={8}>

                    {!(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                        displayRequiredFields ? (
                            <div className={getClassName("kcContentWrapperClass")}>
                                <div className={clsx(getClassName("kcLabelWrapperClass"), "subtitle")}>
                                    <span className="subtitle">
                                        <span className="required">*</span>
                                        {msg("requiredFields")}
                                    </span>
                                </div>
                            </div>
                        ) : (<></>
                        )
                    ) : displayRequiredFields ? (
                        <div className={getClassName("kcContentWrapperClass")}>
                            <div className={clsx(getClassName("kcLabelWrapperClass"), "subtitle")}>
                                <span className="subtitle">
                                    <span className="required">*</span> {msg("requiredFields")}
                                </span>
                            </div>
                            <div id="kc-username">
                                <Button appearance="base"><i className="p-icon--user"></i> <span id="kc-attempted-username">{auth?.attemptedUsername}</span></Button>
                                <Tooltip message={msg("restartLoginTooltip")}>
                                    <Button appearance="base" element="a" id="reset-login" href={url.loginRestartFlowUrl}><i className="p-icon--close"></i></Button>
                                </Tooltip>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={getClassName("kcFormGroupClass")}>
                                <div id="kc-username">
                                    <Button appearance="base"><i className="p-icon--user"></i> <span id="kc-attempted-username">{auth?.attemptedUsername}</span></Button>
                                    <Tooltip message={msg("restartLoginTooltip")}>
                                        <Button appearance="base" element="a" id="reset-login" href={url.loginRestartFlowUrl}><i className="p-icon--close"></i></Button>
                                    </Tooltip>
                                </div>
                            </div>
                        </>
                    )}
                    {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                    {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                        <>
                            {message.type === "success" && <Notification
                                severity="positive"
                            >
                                {message.summary}
                            </Notification>}
                            {message.type === "warning" && <Notification
                                severity="caution"
                            >
                                {message.summary}
                            </Notification>}
                            {message.type === "error" && <Notification
                                severity="negative"
                            >
                                {message.summary}
                            </Notification>}
                            {message.type === "info" && <Notification
                                severity="information"
                            >
                                {message.summary}
                            </Notification>}
                        </>
                    )}
                    {children}
                    {auth !== undefined && auth.showTryAnotherWayLink && showAnotherWayIfPresent && (
                        <form
                            id="kc-select-try-another-way-form"
                            action={url.loginAction}
                            method="post"
                            className={clsx(displayWide && getClassName("kcContentWrapperClass"))}>
                            <div className={clsx(
                                displayWide && [getClassName("kcFormSocialAccountContentClass"), getClassName("kcFormSocialAccountClass")]
                            )}>
                                <div className={getClassName("kcFormGroupClass")}>
                                    <input type="hidden" name="tryAnotherWay" value="on" />
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a href="#" id="try-another-way" onClick={() => {
                                        document.forms["kc-select-try-another-way-form" as never].submit();
                                        return false;
                                    }}>
                                        {msg("doTryAnotherWay")}
                                    </a>
                                </div>
                            </div>
                        </form>
                    )}
                    {displayInfo && (
                        <div id="kc-info" className={getClassName("kcSignUpClass")}>
                            <div id="kc-info-wrapper" className={getClassName("kcInfoAreaWrapperClass")}>
                                {infoNode}
                            </div>
                        </div>
                    )}
                </Col>
            </Strip>
        </div >
    );
}
