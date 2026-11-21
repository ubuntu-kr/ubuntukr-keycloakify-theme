import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/**
 * @see: https://docs.keycloakify.dev/features/i18n
 *
 * - "ko" is not part of Keycloakify's default message set, it is added as an extra
 *   language. The base Korean texts are in ./i18n.ko.ts.
 * - withCustomTranslations() holds the wording specific to this theme. Keycloakify
 *   requires every language listed here to define the same keys (a language that is
 *   missing would silently get the texts of another one), so "en" repeats the stock
 *   English texts for the keys that are reworded in Korean.
 * - Both objects must stay plain literals: Keycloakify evaluates them statically at
 *   build time to generate the messages_*.properties files of the theme.
 */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withExtraLanguages({
        ko: {
            label: "한국어",
            getMessages: () => import("./i18n.ko")
        }
    })
    .withCustomTranslations({
        en: {
            current: "English",
            label: "English",
            locale_ko: "한국어",
            alphanumericalCharsOnly: "Only alphanumerical characters",
            gender: "Gender",
            doLogIn: "Sign In",
            doForgotPassword: "Forgot Password?",
            usernameOrEmail: "Username or email",
            username: "Username",
            email: "Email",
            password: "Password",
            passwordConfirm: "Confirm password",
            rememberMe: "Remember me",
            noAccount: "New user?",
            registerTitle: "Register",
            doRegister: "Register",
            firstName: "First name",
            lastName: "Last name",
            backToLogin: "&laquo; Back to Login",
            emailForgotTitle: "Forgot Your Password?",
            doSubmit: "Submit",
            termsTitle: "Terms and Conditions",
            doAccept: "Accept",
            doDecline: "Decline",
            doCancel: "Cancel",
            doTryAnotherWay: "Try Another Way",
            "identity-provider-login-label": "Or sign in with",

            invalidUserMessage: "Invalid username or password.",
            invalidUsernameMessage: "Invalid username.",
            invalidUsernameOrEmailMessage: "Invalid username or email.",
            invalidPasswordMessage: "Invalid password.",
            invalidEmailMessage: "Invalid email address.",
            accountDisabledMessage: "Account is disabled, contact your administrator.",
            accountTemporarilyDisabledMessage: "Account is temporarily disabled; contact your administrator or retry later.",
            expiredCodeMessage: "Login timeout. Please sign in again.",
            expiredActionMessage: "Action expired. Please continue with login now.",
            expiredActionTokenNoSessionMessage: "Action expired.",
            expiredActionTokenSessionExistsMessage: "Action expired. Please start again.",
            sessionLimitExceeded: "There are too many sessions",

            missingFirstNameMessage: "Please specify first name.",
            missingLastNameMessage: "Please specify last name.",
            missingEmailMessage: "Please specify email.",
            missingUsernameMessage: "Please specify username.",
            missingPasswordMessage: "Please specify password.",
            missingTotpMessage: "Please specify authenticator code.",
            missingTotpDeviceNameMessage: "Please specify device name.",
            notMatchPasswordMessage: "Passwords don't match.",

            loginTotpTitle: "Mobile Authenticator Setup",
            loginTotpStep1: "Install one of the following applications on your mobile:",
            loginTotpStep2: "Open the application and scan the barcode:",
            loginTotpUnableToScan: "Unable to scan?",
            loginTotpStep3: "Enter the one-time code provided by the application and click Submit to finish the setup.",
            loginTotpStep3DeviceName: "Provide a Device Name to help you manage your OTP devices.",
            authenticatorCode: "One-time code",
            loginTotpDeviceName: "Device Name",
            loginTotpManualStep2: "Open the application and enter the key:",
            loginTotpManualStep3: "Use the following configuration values if the application allows setting them:",
            loginTotpScanBarcode: "Scan barcode?",
            loginTotpType: "Type",
            loginTotpAlgorithm: "Algorithm",
            loginTotpDigits: "Digits",
            loginTotpInterval: "Interval",
            loginTotpCounter: "Counter",

            backToApplication: "&laquo; Back to Application",
            errorTitle: "We are sorry...",
            errorTitleHtml: "We are <strong>sorry</strong> ...",

            loginProfileTitle: "Update Account Information",

            loginIdpReviewProfileTitle: "Update Account Information",

            emailVerifyTitle: "Email verification",
            emailVerifyInstruction1: "An email with instructions to verify your email address has been sent to your address {0}.",
            emailVerifyInstruction2: "Haven't received a verification code in your email?",
            emailVerifyInstruction3: "to re-send the email.",
            doClickHere: "Click here",

            confirmLinkIdpTitle: "Account already exists",
            federatedIdentityConfirmLinkMessage: "User with {0} {1} already exists. How do you want to continue?",
            federatedIdentityConfirmReauthenticateMessage: "Authenticate to link your account with {0}",
            confirmLinkIdpReviewProfile: "Review profile",
            confirmLinkIdpContinue: "Add to existing account",

            emailLinkIdpTitle: "Link {0}",
            emailLinkIdp1: "An email with instructions to link {0} account {1} with your {2} account has been sent to you.",
            emailLinkIdp2: "Haven't received a verification code in your email?",
            emailLinkIdp3: "to re-send the email.",
            emailLinkIdp4: "If you already verified the email in different browser",
            emailLinkIdp5: "to continue.",

            pageExpiredTitle: "Page has expired",
            pageExpiredMsg1: "To restart the login process",
            pageExpiredMsg2: "To continue the login process",
            alreadyLoggedIn: "You are already logged in."
        },
        ko: {
            current: "한국어",
            label: "한국어",
            locale_ko: "한국어",
            alphanumericalCharsOnly: "로마자와 숫자만 가능",
            gender: "성별",
            doLogIn: "로그인",
            doForgotPassword: "암호를 잊어버렸습니다",
            usernameOrEmail: "사용자명(ID) 또는 이메일",
            username: "사용자명(ID)",
            email: "이메일",
            password: "암호",
            passwordConfirm: "암호 확인",
            rememberMe: "로그인 유지",
            noAccount: "신규 사용자 입니까?",
            registerTitle: "회원가입",
            doRegister: "회원가입",
            firstName: "이름",
            lastName: "성",
            backToLogin: "« 로그인 화면으로 돌아가기",
            emailForgotTitle: "암호를 잊어버리셨습니까?",
            doSubmit: "제출",
            termsTitle: "이용약관",
            doAccept: "수락",
            doDecline: "거부",
            doCancel: "취소",
            doTryAnotherWay: "다른 방법 시도하기",
            "identity-provider-login-label": "또는 다음 계정으로 로그인",

            invalidUserMessage: "잘못된 사용자명 또는 암호입니다.",
            invalidUsernameMessage: "잘못된 사용자명입니다.",
            invalidUsernameOrEmailMessage: "잘못된 사용자명 또는 이메일입니다.",
            invalidPasswordMessage: "잘못된 암호입니다.",
            invalidEmailMessage: "잘못된 이메일 주소입니다.",
            accountDisabledMessage: "계정이 비활성화 되었습니다. 관리자에게 문의하십시오.",
            accountTemporarilyDisabledMessage: "계정이 일시적으로 비활성화 되었습니다. 관리자에게 문의하시거나, 잠시 후 다시 시도하십시오.",
            expiredCodeMessage: "로그인 시간이 초과되었습니다. 디시 로그인 하십시오.",
            expiredActionMessage: "작업이 만료되었습니다. 지금 로그인을 계속하십시오.",
            expiredActionTokenNoSessionMessage: "작업이 만료되었습니다.",
            expiredActionTokenSessionExistsMessage: "작업이 만료되었습니다. 다시 시작하십시오.",
            sessionLimitExceeded: "세션이 너무 많습니다",

            missingFirstNameMessage: "이름을 입력해 주십시오.",
            missingLastNameMessage: "성을 입력해 주십시오.",
            missingEmailMessage: "이메일을 입력해 주십시오.",
            missingUsernameMessage: "사용자명을 입력해 주십시오.",
            missingPasswordMessage: "암호를 입력해 주십시오.",
            missingTotpMessage: "인증기 코드(OTP 코드)를 입력해 주십시오.",
            missingTotpDeviceNameMessage: "장치 이름을 입력해 주십시오.",
            notMatchPasswordMessage: "암호가 일치하지 않습니다.",

            loginTotpTitle: "모바일 인증기 설정",
            loginTotpStep1: "모바일 인증기 앱(OTP 앱)을 휴대전화에 설치 하십시오",
            loginTotpStep2: "앱을 열고 아래 바코드를 스캔 하십사오.",
            loginTotpUnableToScan: "스캔하실 수 없습니까?",
            loginTotpStep3: "앱에서 제공하는 일회용 코드를 입력하고, 제출을 클릭하여 설정을 완료하십시오.",
            loginTotpStep3DeviceName: "OTP 장치를 더 쉽게 관리하기 위해, 장치 이름도 입력 해 주시기 바랍니다.",
            authenticatorCode: "일회용 코드",
            loginTotpDeviceName: "장치 이름",
            loginTotpManualStep2: "앱을 열고 키를 입력하십시오:",
            loginTotpManualStep3: "앱에서 구성 값 변경이 가능한 경우, 다음 구성 값을 이용하십시오:",
            loginTotpScanBarcode: "바코드를 스캔하시겠습니까?",
            loginTotpType: "유형",
            loginTotpAlgorithm: "알고리즘",
            loginTotpDigits: "숫자",
            loginTotpInterval: "간격",
            loginTotpCounter: "카운터",

            backToApplication: "« 앱으로 돌아가기",
            errorTitle: "죄송합니다...",
            errorTitleHtml: "<strong>죄송합니다</strong>...",

            loginProfileTitle: "계정 정보 수정",

            loginIdpReviewProfileTitle: "계정 정보 업데이트",

            emailVerifyTitle: "이메일 확인",
            emailVerifyInstruction1: "이메일 확인을 위한 절차가 담긴 이메일을 이메일 주소 {0} (으)로 보내드렸습니다.",
            emailVerifyInstruction2: "아직 확인 코드를 이메일로 받지 못하셨습니까?",
            emailVerifyInstruction3: "하여 이메일을 다시 받아보십시오",
            doClickHere: "여기를 클릭",

            confirmLinkIdpTitle: "이미 존재하는 계정입니다",
            federatedIdentityConfirmLinkMessage: "{0} 이 {1} 인 계정이 이미 존재합니다. 어떻게 하시겠습니까?",
            federatedIdentityConfirmReauthenticateMessage: "인증하여 계정에 {0} (을)를 연결",
            confirmLinkIdpReviewProfile: "프로필 검토",
            confirmLinkIdpContinue: "기존 계정에 추가",

            emailLinkIdpTitle: "{0} 연결하기",
            emailLinkIdp1: "{2} 계정 {1} 에 {0} (을)를 연결하기 위한 절차가 담긴 이메일을 보내 드렸습니다.",
            emailLinkIdp2: "이메일로 인증코드를 받지 못하셨습니까?",
            emailLinkIdp3: "하여 다시 이메일을 발송할 수 있습니다.",
            emailLinkIdp4: "이미 이메일을 다른 브라우저에서 인증 하셨다면",
            emailLinkIdp5: "하여 계속하실 수 있습니다.",

            pageExpiredTitle: "페이지가 만료되었습니다",
            pageExpiredMsg1: "로그인을 다시 시작하려면,",
            pageExpiredMsg2: "로그인을 계속 진행하려면,",
            alreadyLoggedIn: "이미 로그인 하셨습니다."
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
