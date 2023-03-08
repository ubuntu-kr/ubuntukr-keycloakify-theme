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
                "password":"암호",
                "passwordConfirm": "암호 확인",
                "rememberMe": "로그인 유지",
                "noAccount": "신규 사용자 입니까?",
                "registerTitle": "회원가입",
                "doRegister": "회원가입",
                "firstName": "이름",
                "lastName": "성",
                "backToLogin": "« 로그인 화면으로 돌아가기",
                "emailForgotTitle": "암호를 잊어버리셨습니까?",
                "doSubmit":"제출"
            }
        },
    });
}

export type I18n = NonNullable<ReturnType<typeof useI18n>>;
