import { createUseI18n } from "keycloakify/account";

//NOTE: See src/login/i18n.ts for instructions on customization of i18n messages.
export const { useI18n } = createUseI18n({
    "ko": {
        "account":"계정",
        "authenticator":"인증기",
        "federatedIdentity":"통합 인증",
        "sessions":"세션",
        "applications":"애플리케이션",
        "log":"로그",
        "myResources":"내 리소스",
        "doSignOut": "로그아웃",

        "editAccountHtmlTitle": "계정 수정",
        "requiredFields": "필수 입력 항목",
        "username": "사용자명(ID)",
        "email": "이메일",
        "firstName": "이름",
        "lastName": "성",

        "changePasswordHtmlTitle": "암호 변경",
        "allFieldsRequired": "모든 항목 입력 필수",
        "password": "암호",
        "passwordNew": "새 암호",
        "passwordConfirm": "암호 확인",
        "doSave": "저장",
        "doCancel": "취소",

        "sessionsHtmlTitle": "세션",
        "lastAccess": "최근 접속",
        "started": "시작 일시",
        "expires": "만료 일시",
        "clients": "클라이언트",
        "doLogOutAllSessions": "모든 세션 로그아웃",
       
        "federatedIdentitiesHtmlTitle": "통합 인증",
        "doRemove": "삭제",
        "doAdd": "추가",

        "applicationsHtmlTitle": "애플리케이션",
        "revoke": "승인 회수",
        "availableRoles": "사용 가능 역할",
        "grantedPermissions": "승인된 권한",
        "fullAccess": "전체 접근 권한",
        "additionalGrants": "추가 승인 권한",
        "inResource": "-"
    }
});


export type I18n = NonNullable<ReturnType<typeof useI18n>>;