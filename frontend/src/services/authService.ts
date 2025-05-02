import api from './api';
import { LoginRequest, SignupRequest, JwtResponse } from '../types';

class AuthService {
  async login(loginRequest: LoginRequest): Promise<JwtResponse> {
    const response = await api.post('/auth/signin', loginRequest);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  register(signupRequest: SignupRequest): Promise<any> {
    return api.post('/auth/signup', signupRequest);
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export default new AuthService();
