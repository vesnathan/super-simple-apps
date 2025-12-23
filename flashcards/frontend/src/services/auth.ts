/* eslint-disable no-console */
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  confirmSignUp,
  fetchAuthSession,
} from "aws-amplify/auth";

// Import amplify to ensure it's configured before any auth calls
import "@/lib/amplify";

const cognitoErrorMessages: Record<string, string> = {
  UserNotFoundException: "Incorrect email or password",
  NotAuthorizedException: "Incorrect email or password",
  UsernameExistsException: "An account with this email already exists",
  InvalidPasswordException: "Password does not meet requirements",
  CodeMismatchException: "Invalid verification code",
  ExpiredCodeException:
    "Verification code has expired, please request a new one",
  LimitExceededException: "Too many attempts, please try again later",
  UserNotConfirmedException: "Please verify your email address first",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const cognitoError = (error as { name?: string; __type?: string }).name || (error as { __type?: string }).__type;
    return (
      (cognitoError && cognitoErrorMessages[cognitoError]) ||
      error.message ||
      "An unexpected error occurred"
    );
  }
  return "An unexpected error occurred";
}

export const authService = {
  async signIn(email: string, password: string) {
    try {
      // First sign out any existing user
      await signOut();

      return await signIn({ username: email, password });
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  },

  async signUp(email: string, password: string) {
    try {
      return await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email },
        },
      });
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  },

  async signOut() {
    return signOut();
  },

  async getCurrentUser() {
    return getCurrentUser();
  },

  async getSession() {
    try {
      const session = await fetchAuthSession();

      return session;
    } catch (error) {
      console.error("Failed to get session:", error);

      return null;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      const session = await fetchAuthSession();

      return session.tokens?.accessToken?.toString() || null;
    } catch (error) {
      console.error("Failed to get token:", error);

      return null;
    }
  },

  async confirmSignUp(email: string, code: string) {
    try {
      return await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  },
};
