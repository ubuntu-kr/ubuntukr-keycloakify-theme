# ubuntukr-keycloakify-theme

Keycloak themes of the Ubuntu Korea Community single sign-on.

| Theme name                   | Types        | Source                   | Built with                                             |
| ---------------------------- | ------------ | ------------------------ | ------------------------------------------------------ |
| `ubuntukr-keycloakify-theme` | login, email | `src/login`, `src/email` | [Keycloakify](https://keycloakify.dev) 11, Vite, React |
| `ubuntukr-account-theme`     | account      | `account-console-theme/` | plain theme files extending `keycloak.v3`              |

The login pages use the [Vanilla framework](https://vanillaframework.io) and
`@canonical/react-components`. Pages that are not implemented in `src/login/pages`
(see the `switch` in `src/login/KcPage.tsx`) fall back to the default Keycloakify pages.

## Requirements

- Node.js 20 or later (developed with Node.js 22) and npm
- No Java and no Maven (see [Building without Maven](#building-without-maven))

## Build

```bash
npm ci
npm run build-all
```

This creates:

- `dist_keycloak/ubuntukr-theme.jar`: login and email theme, for Keycloak 26 (tested with 26.8.2)
- `dist_keycloak/ubuntukr-account-theme.jar`: account console theme (Keycloak 25 and later)

The two jars can also be built separately with `npm run build-keycloak-theme` and
`npm run build-account-theme`. `build-keycloak-theme` recreates `dist_keycloak/`, so build the
account theme after it (`build-all` does it in this order).

To install, copy both jars to `/opt/keycloak/providers/` and select the themes in the realm
settings (login theme and email theme: `ubuntukr-keycloakify-theme`, account theme:
`ubuntukr-account-theme`). The supported locales of the realm should be `en` and `ko`.

### Building without Maven

Keycloakify 11 calls `mvn` to package the theme into a jar. The `build-keycloak-theme` script puts
`scripts/no-maven/mvn` first on the `PATH`: a small Node.js stand-in that zips the generated theme
(`scripts/jar.mjs`), so no JVM and no access to Maven Central are needed. It only supports jars
without bundled extensions, which is what `vite.config.ts` configures (no account v1 theme, no
Keycloak 22 to 25 target). With a real Maven installed, `npm run build && npx keycloakify build`
is the standard Keycloakify build. The stand-in is a shell-executable Node.js script and is not
usable from Windows `cmd`.

## Development

```bash
npm run dev
```

The Vite dev server renders the pages with mocked data. Without a query string the login page is
shown; other pages and states are selected with query parameters:

- `pageId`: the page, for example `?pageId=register.ftl`
- `locale`: `ko` (default) or `en`
- `overrides`: JSON merged into the mocked `kcContext`, for example
  `?pageId=register.ftl&overrides={"passwordRequired":false}`
- `fieldErrors`: JSON object of field name to error message, for example
  `?pageId=register.ftl&fieldErrors={"email":"Invalid email address."}`

Translations: `src/login/i18n.ts` holds the texts that differ from the Keycloak defaults (`en` and
`ko`), `src/login/i18n.ko.ts` is the Korean base translation (Keycloakify does not ship one).
The terms shown on the terms page are `src/login/assets/tos_ko.md` and `tos_en.md`.

## Account console theme

`account-console-theme/` contains the theme as it is packaged: `theme.properties` (parent
`keycloak.v3`, logo, favicon), a small stylesheet and message overrides. There is no build step
other than zipping it into a jar (`account-console-theme/build-jar.mjs`).
