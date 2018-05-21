import { getClient } from './sdk';

export interface RegisterResult {
  username: string;
}

export interface RegisterCodeResentResult {
  CodeDeliveryDetails: {
    Destination: string;
    DeliveryMedium: string;
    AttributeName: string;
  };
}

export interface LoginSuccessResult {
  refreshToken: string;
  accessToken: string;
  accessTokenExpiresAt: string;
  idToken: string;
  idTokenExpiresAt: string;
}

export interface LoginNextStepResult {
  nextStep: 'MFA_AUTH' | 'NEW_PASSWORD_REQUIRED';
  loginSession: string;
}

export namespace Auth {
  export function register(
    username: string,
    password: string
  ): Promise<RegisterResult> {
    return getClient().signup({
      username,
      password
    });
  }

  export function registerConfirmation(
    username: string,
    confirmationCode: string
  ): Promise<string> {
    return getClient().signupConfirm({
      username,
      confirmationCode
    });
  }
  export function registerResendCode(
    username: string
  ): Promise<RegisterCodeResentResult> {
    return getClient().signupResend({
      username
    });
  }

  export function login(
    username: string,
    password: string
  ): Promise<LoginSuccessResult | LoginNextStepResult> {
    return getClient().login({
      username,
      password
    });
  }

  export function forgotPassword(email: string) {
  }

  export function forgotPasswordSubmit(
    email: string,
    code: string,
    newPassword: string
  ) {
  }
}
