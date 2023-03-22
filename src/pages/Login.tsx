// This is a copy paste from https://github.com/InseeFrLab/keycloakify/blob/main/src/lib/pages/Login.tsx
import { useState, type FormEventHandler } from "react";
// You can replace all relative imports by cherry picking files from the keycloakify module.  
// For example, the following import:  
// import { clsx } from "./tools/clsx";
// becomes:  
import { useConstCallback } from "keycloakify/tools/useConstCallback";
import type { PageProps } from "keycloakify/login/pages/PageProps";
// Here use your own KcContext and I18n that you might have overloaded.  
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Icon, Button, Form, Input } from "@canonical/react-components";


export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl"; }>, I18n>) {
	const { kcContext, i18n, doUseDefaultCss, Template, ...kcProps } = props;

	const { social, realm, url, usernameEditDisabled, login, auth, registrationDisabled } = kcContext;

	const { msg, msgStr } = i18n;

	const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

	const onSubmit = useConstCallback<FormEventHandler<HTMLFormElement>>(e => {
		e.preventDefault();

		setIsLoginButtonDisabled(true);

		const formElement = e.target as HTMLFormElement;

		//NOTE: Even if we login with email Keycloak expect username and password in
		//the POST request.
		formElement.querySelector("input[name='email']")?.setAttribute("name", "username");

		formElement.submit();
	});

	return (
		<Template
			{...{ kcContext, i18n, doUseDefaultCss, ...kcProps }}
			displayInfo={social.displayInfo}
			displayWide={realm.password && social.providers !== undefined}
			headerNode={msg("doLogIn")}
			infoNode={
				realm.password &&
				realm.registrationAllowed &&
				!registrationDisabled && (
					<div id="kc-registration">
						<Button element="a" href={url.registrationUrl} appearance="base">
							{msg("noAccount")} - {msg("doRegister")}
						</Button>
					</div>
				)
			}>
			<div id="kc-form">
				<div id="kc-form-wrapper">
					{realm.password && (
						<Form id="kc-form-login" onSubmit={onSubmit} action={url.loginAction} method="post">
							<fieldset>
								{(() => {
									const label = !realm.loginWithEmailAllowed
										? "username"
										: realm.registrationEmailAsUsername
											? "email"
											: "usernameOrEmail";

									const autoCompleteHelper: typeof label = label === "usernameOrEmail" ? "username" : label;

									return (
										<Input
											tabIndex={1}
											id={autoCompleteHelper}
											name={autoCompleteHelper}
											defaultValue={login.username ?? ""}
											type="text" label={msg(label)}
											{...(usernameEditDisabled
												? { "disabled": true }
												: {
													"autoFocus": true,
													"autoComplete": "off"
												})}
										/>
									);
								})()}
								<Input tabIndex={2}
									id="password"
									name="password"
									type="password"
									autoComplete="off"
									label={msg("password")} />
								{realm.rememberMe && !usernameEditDisabled && (
									<Input
										id="rememberMe"
										name="rememberMe"
										tabIndex={3}
										label={msg("rememberMe")}
										type="checkbox"
										{...(login.rememberMe
											? {
												"checked": true
											}
											: {})}
									/>
								)}


								<input
									type="hidden"
									id="id-hidden-input"
									name="credentialId"
									{...(auth?.selectedCredential !== undefined
										? {
											"value": auth.selectedCredential
										}
										: {})}
								/>
								<Button element={'input'}
									tabIndex={4}
									className={"p-button"}
									name="login"
									id="kc-login"
									type="submit"
									value={msgStr("doLogIn")}
									disabled={isLoginButtonDisabled}
									appearance="positive"
								/>
								{realm.resetPasswordAllowed && (
									<Button element="a" tabIndex={5} href={url.loginResetCredentialsUrl} appearance="base">
										{msg("doForgotPassword")}
									</Button>
								)}

								{realm.password && social.providers !== undefined && (
									<>
										<hr></hr>
										<div id="kc-social-providers" >
											{social.providers.map(p => (
												<Button hasIcon element="a" href={p.loginUrl} id={`zocial-${p.alias}`} >
													<Icon name={p.alias} style={{ height: '14px' }} /> <span>{p.displayName}</span>
												</Button>
											))}
										</div>
									</>
								)}
							</fieldset>
						</Form>
					)}
				</div>
			</div>
		</Template>
	);
}
