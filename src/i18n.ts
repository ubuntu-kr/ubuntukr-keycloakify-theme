import { useI18n as useI18nBase } from "keycloakify";

type Props = Omit<Parameters<typeof useI18nBase>[0], "extraMessages">;

export function useI18n(props: Props) {
    const { kcContext } = props;


    return useI18nBase({
        kcContext,
        // NOTE: Here you can override the default i18n messages
        // or define new ones that, for example, you would have
        // defined in the Keycloak admin UI for UserProfile
        // https://user-images.githubusercontent.com/6702424/182050652-522b6fe6-8ee5-49df-aca3-dba2d33f24a5.png
        "extraMessages": {
            "ko": {
                "alphanumericalCharsOnly": "로마자와 숫자만 가능",
                "gender": "성별",
                "doLogIn": "로그인",
                "doForgotPassword": "암호를 잊어버렸습니다",
                "usernameOrEmail": "사용자명 또는 이메일",
                "username": "사용자명",
                "email": "이메일",
                "password": "암호",
                "passwordConfirm": "암호 확인",
                "rememberMe": "로그인 유지",
                "noAccount": "신규 사용자 입니까?",
                "registerTitle": "회원가입",
                "doRegister": "회원가입",
                "firstName": "이름",
                "lastName": "성",
                "backToLogin": "« 로그인 화면으로 돌아가기",
                "emailForgotTitle": "암호를 잊어버리셨습니까?",
                "doSubmit": "제출",
                "termsTitle": "이용약관",
                "doAccept": "수락",
                "doDecline": "거부",

                "invalidUserMessage": "잘못된 사용자명 또는 암호입니다.",
                "invalidUsernameMessage": "잘못된 사용자명입니다.",
                "invalidUsernameOrEmailMessage": "잘못된 사용자명 또는 이메일입니다.",
                "invalidPasswordMessage":"잘못된 암호입니다.",
                "invalidEmailMessage": "잘못된 이메일 주소입니다.",
                "accountDisabledMessage": "계정이 비활성화 되었습니다. 관리자에게 문의하십시오.",
                "accountTemporarilyDisabledMessage": "계정이 일시적으로 비활성화 되었습니다. 관리자에게 문의하시거나, 잠시 후 다시 시도하십시오.",
                "expiredCodeMessage": "로그인 시간이 초과되었습니다. 디시 로그인 하십시오.",
                "expiredActionMessage":"작업이 만료되었습니다. 지금 로그인을 계속하십시오.",
                "expiredActionTokenNoSessionMessage": "작업이 만료되었습니다.",
                "expiredActionTokenSessionExistsMessage": "작업이 만료되었습니다. 다시 시작하십시오.",
                "sessionLimitExceeded": "세션이 너무 많습니다",
                
                "missingFirstNameMessage": "이름을 입력해 주십시오.",
                "missingLastNameMessage": "성을 입력해 주십시오.",
                "missingEmailMessage": "이메일을 입력해 주십시오.",
                "missingUsernameMessage": "사용자명을 입력해 주십시오.",
                "missingPasswordMessage": "암호를 입력해 주십시오.",
                "missingTotpMessage": "인증기 코드(OTP 코드)를 입력해 주십시오.",
                "missingTotpDeviceNameMessage": "장치 이름을 입력해 주십시오.",
                "notMatchPasswordMessage": "암호가 일치하지 않습니다."
            }
        },
    });
}

export type I18n = NonNullable<ReturnType<typeof useI18n>>;
