import { getKcContext } from "keycloakify/account";

export type KcContextExtension =
	| { pageId: "my-extra-page-1.ftl"; }
	| { pageId: "my-extra-page-2.ftl"; someCustomValue: string; }
	| {
		pageId: "sessions.ftl";
		stateChecker: string;
		sessions: {
			sessions: {
				expires: Date;
				id: string;
				ipAddress: string;
				lastAccess: Date;
				started: Date;
				clients: string[];
			}[];
		}
	}
	| {
		pageId: "federatedIdentity.ftl";
		stateChecker: string;
		federatedIdentity: {
			identities: {
				userName: string;
				displayName: string;
				providerId: string;
				connected: boolean;
			}[];
			removeLinkPossible: boolean;
		}
	};

export const { kcContext } = getKcContext<KcContextExtension>({
	//mockPageId: "password.ftl",
	mockData: [
		{
			pageId: "my-extra-page-2.ftl",
			someCustomValue: "foo bar"
		}
	]
});

export type KcContext = NonNullable<typeof kcContext>;