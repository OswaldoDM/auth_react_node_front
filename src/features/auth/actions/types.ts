export interface AuthActionState {
  error?: string;
  success?: boolean;
}

export interface RegisterActionState extends AuthActionState {
  email?: string;
}
