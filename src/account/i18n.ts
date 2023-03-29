import { createUseI18n } from "keycloakify/account";

//NOTE: See src/login/i18n.ts for instructions on customization of i18n messages.
export const { useI18n } = createUseI18n({
    "ko": {
        "account":"계정",
        "authenticator":"인증기",
        "federatedIdentity":"소셜 로그인",
        "sessions":"세션",
        "applications":"애플리케이션",
        "log":"로그",
        "myResources":"내 리소스",
        "doSignOut": "로그아웃",

        "editAccountHtmlTitle": "계정 수정",
        "requiredFields": "필수항목",
        "username": "사용자명(ID)",
        "email": "이메일",
        "firstName": "이름",
        "lastName": "성",
        "password": "암호",
        "passwordNew": "새 암호",
        "passwordConfirm": "암호 확인",
        "doSave": "저장",
        "doCancel": "취소",
       
    }
});


export type I18n = NonNullable<ReturnType<typeof useI18n>>;