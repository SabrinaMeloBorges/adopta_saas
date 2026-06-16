import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService) {}

  async onSubmit() {
    this.error = '';
    this.loading = true;
    try {
      await this.auth.login(this.email, this.password);
    } catch (e: any) {
      this.error = this.getError(e.code);
    } finally {
      this.loading = false;
    }
  }

  async googleLogin() {
    try {
      await this.auth.loginWithGoogle();
    } catch (e: any) {
      this.error = 'Erro ao entrar com Google.';
    }
  }

  getError(code: string) {
    const errors: any = {
      'auth/user-not-found': 'Usuário não encontrado.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/invalid-email': 'E-mail inválido.',
      'auth/invalid-credential': 'E-mail ou senha incorretos.'
    };
    return errors[code] || 'Erro ao entrar. Tente novamente.';
  }
}