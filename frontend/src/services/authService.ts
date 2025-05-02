import { authApi } from './api';
import { LoginRequest, SignupRequest, JwtResponse } from '../types';

class AuthService {
  login(loginRequest: LoginRequest): Promise<JwtResponse> {
    return authApi.login(loginRequest)
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  register(signupRequest: SignupRequest): Promise<any> {
    return authApi.register(signupRequest);
  }

  getCurrentUser(): JwtResponse | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

export default new AuthService();
