// Copy pasted from: https://github.com/InseeFrLab/keycloakify/blob/main/src/login/Template.tsx

import { clsx } from "keycloakify/tools/clsx";
import { usePrepareTemplate } from "keycloakify/lib/usePrepareTemplate";
import { type TemplateProps } from "keycloakify/account/TemplateProps";
import { useGetClassName } from "keycloakify/account/lib/useGetClassName";
import type { KcContext } from "./kcContext";
import type { I18n } from "./i18n";
import { assert } from "keycloakify/tools/assert";
import { Navigation, Row, Strip, Col, Notification, Button, Input } from "@canonical/react-components";
import { useState } from "react";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, active, classes, children } = props;

    const { getClassName } = useGetClassName({ doUseDefaultCss, classes });

    const { msg, changeLocale, labelBySupportedLanguageTag, currentLanguageTag } = i18n;

    const { locale, url, features, realm, message, referrer } = kcContext;

    const { isReady } = usePrepareTemplate({
        "doFetchDefaultThemeResources": doUseDefaultCss,
        url,
        "stylesCommon": [],
        "styles": [],
        "htmlClassName": undefined,
        "bodyClassName": undefined
    });

    const [isLangSelectorHidden, toggleLangSelector] = useState(true);

    if (!isReady) {
        return null;
    }

    return (
        <div className="l-site">
            <header id="navigation" className="p-navigation is-dark">
                <div className="p-navigation__row">
                    <div className="p-navigation__banner">
                        <div className="p-navigation__tagged-logo">
                            <a className="p-navigation__link" href="#">
                                <div className="p-navigation__logo-tag">
                                    <img className="p-navigation__logo-icon" src="https://github.com/ubuntu-kr/logo-artworks/raw/main/UbuntuKrCircleWhite.svg" alt="" />
                                </div>
                                <span className="p-navigation__logo-title">SSO Account Console</span>
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
                        <ul className="p-navigation__items">
                            {(realm.internationalizationEnabled && (assert(locale !== undefined), true) && locale.supported.length > 1) ?
                                (

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

                                ) : (<></>)}
                            {referrer?.url !== undefined && (
                                <li className="p-navigation__item">
                                    <a className="p-navigation__link" href={referrer.url} id="referrer">
                                        {msg("backTo", referrer.name)}
                                    </a>
                                </li>
                            )}
                            <li className="p-navigation__item">
                                <a className="p-navigation__link" href={url.getLogoutUrl()}>
                                    {msg("doSignOut")}
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header >
            <Strip includeCol={false}>
                <aside className="col-3">
                    <nav className="p-side-navigation--raw-html is-sticky" id="drawer" aria-label="Table of contents">
                        <a href="#drawer" className="p-side-navigation__toggle js-drawer-toggle" aria-controls="drawer">
                            Menu
                        </a>

                        <div className="p-side-navigation__overlay js-drawer-toggle" aria-controls="drawer"></div>

                        <div className="p-side-navigation__drawer">
                            <div className="p-side-navigation__drawer-header">
                                <a href="#" className="p-side-navigation__toggle--in-drawer js-drawer-toggle"
                                    aria-controls="drawer">
                                    Menu
                                </a>
                            </div>
                            <ul>
                                <li>
                                    <a className={active === "account" ? "is-active" : ""} href={url.accountUrl}>{msg("account")}</a>
                                </li>
                                {features.passwordUpdateSupported && (
                                    <li>
                                        <a className={active === "password" ? "is-active" : ""} href={url.passwordUrl}>{msg("password")}</a>
                                    </li>
                                )}
                                <li>
                                    <a className={active === "totp" ? "is-active" : ""} href={url.totpUrl}>{msg("authenticator")}</a>
                                </li>
                                {features.identityFederation && (
                                    <li>
                                        <a className={active === "social" ? "is-active" : ""} href={url.socialUrl}>{msg("federatedIdentity")}</a>
                                    </li>
                                )}
                                <li>
                                    <a className={active === "sessions" ? "is-active" : ""} href={url.sessionsUrl}>{msg("sessions")}</a>
                                </li>
                                <li>
                                    <a className={active === "applications" ? "is-active" : ""} href={url.applicationsUrl}>{msg("applications")}</a>
                                </li>
                                {features.log && (
                                    <li>
                                        <a className={active === "log" ? "is-active" : ""} href={url.logUrl}>{msg("log")}</a>
                                    </li>
                                )}
                                {realm.userManagedAccessAllowed && features.authorization && (
                                    <li>
                                        <a className={active === "authorization" ? "is-active" : ""} href={url.resourceUrl}>{msg("myResources")}</a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </nav>

                </aside>

                <main className="col-9" id="main-content">
                    {children}
                </main>

            </Strip>
            <footer className="l-footer--sticky p-strip--light">
                <nav className="row" aria-label="Footer">
                    <div className="has-cookie">
                        <p>© 2023-Present Ubuntu Korea Community.</p>
                        <ul className="p-inline-list--middot">
                            <li className="p-inline-list__item">
                                <a href="https://ubuntu.com/community/code-of-conduct"><small>우분투 행동강령 (Ubuntu Code of Conducts)</small></a>
                            </li>
                            <li className="p-inline-list__item">
                                <a href="https://disclosures.ubuntu-kr.org/legal/"><small>정관 및 세칙 (Articles and bylaws)</small></a>
                            </li>
                            <li className="p-inline-list__item">
                                <a href="https://disclosures.ubuntu-kr.org/privacy-policy/"><small>개인정보처리방침 (Privacy policy)</small></a>
                            </li>
                            <li className="p-inline-list__item">
                                <a href="mailto:contact@ubuntu-kr.org"><small>문의 (Contact)</small></a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </footer>
        </div>
    );
}