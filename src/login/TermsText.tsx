import Markdown from "react-markdown";
import type { I18n } from "./i18n";
import tos_en from "./assets/tos_en.md?raw";
import tos_ko from "./assets/tos_ko.md?raw";

/** The terms of service bundled with the theme (assets/tos_*.md), in the current language. */
export default function TermsText(props: { i18n: I18n }) {
    const { i18n } = props;

    return <Markdown>{i18n.currentLanguage.languageTag === "ko" ? tos_ko : tos_en}</Markdown>;
}
