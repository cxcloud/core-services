import { getClient } from './sdk';

export interface SignupResult {
  username: string;
}

export namespace Auth {
  export function register(
    email: string,
    password: string
  ): Promise<SignupResult> {
    return getClient().signup({
      username: email,
      password
    });
  }

  export function login(email: string, password: string) {
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
