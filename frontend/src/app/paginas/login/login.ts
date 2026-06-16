import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../nucleo/servicos/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected email = signal('');
  protected senha = signal('');
  protected enviando = signal(false);
  protected erro = signal<string | null>(null);

  enviar() {
    if (!this.email() || !this.senha()) {
      this.erro.set('Preenche e-mail e senha.');
      return;
    }
    this.enviando.set(true);
    this.erro.set(null);
    this.auth.login({ email: this.email(), senha: this.senha() }).subscribe({
      next: () => {
        const volta = this.route.snapshot.queryParamMap.get('volta') || '/';
        this.router.navigateByUrl(volta);
      },
      error: (err) => {
        this.enviando.set(false);
        this.erro.set(err?.error?.erro || 'Não foi possível entrar.');
      },
    });
  }
}
