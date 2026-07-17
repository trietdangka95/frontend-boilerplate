export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface AuthResponse {
  accessToken: string;
}
