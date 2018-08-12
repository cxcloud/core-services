export type Status = 'SUCCESS';

export interface RegisterResult {
  username: string;
}

export interface CodeDeliveryResult {
  CodeDeliveryDetails: {
    Destination: string;
    DeliveryMedium: string;
    AttributeName: string;
  };
}

export interface LoginSuccessResult {
  refreshToken: string;
  accessToken: string;
  accessTokenExpiresAt: number;
  idToken: string;
  idTokenExpiresAt: number;
}

export interface LoginNextStepResult {
  nextStep: 'MFA_AUTH' | 'NEW_PASSWORD_REQUIRED';
  loginSession: string;
}

export interface AttributesHash {
  [key: string]: string;
}

export interface CognitoAttribute {
  Name: string;
  Value: string;
}
