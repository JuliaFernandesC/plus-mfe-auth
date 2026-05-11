export interface LoginResponse {
  token:   string;
  refresh: string;
  user?:   AuthUser;
}

export interface AuthUser {
  id:        string;
  email:     string;
  name?:     string;
  avatarUrl?: string;
}

export interface LoginCredentials {
  email:    string;
  password: string;
}