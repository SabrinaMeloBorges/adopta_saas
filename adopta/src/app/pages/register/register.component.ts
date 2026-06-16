import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService) {}

  async onSubmit() {
    this.error = '';
    this.loading = true;
    try {
      await this.auth.register(this.name, this.email, this.password);
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
      'auth/email-already-in-use': 'Este e-mail já está em uso.',
      'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
      'auth/invalid-email': 'E-mail inválido.'
    };
    return errors[code] || 'Erro ao criar conta. Tente novamente.';
  }
}