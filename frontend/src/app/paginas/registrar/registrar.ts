import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../nucleo/servicos/auth';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './registrar.html',
  styleUrl: './registrar.scss',
})
export class Registrar {
  private auth = inject(Auth);
  private router = inject(Router);

  protected nome = signal('');
  protected email = signal('');
  protected senha = signal('');
  protected telefone = signal('');
  protected cidade = signal('');
  protected estado = signal('');
  protected enviando = signal(false);
  protected erro = signal<string | null>(null);

  enviar() {
    if (!this.nome().trim() || !this.email() || !this.senha()) {
      this.erro.set('Preenche pelo menos nome, e-mail e senha.');
      return;
    }
    if (this.senha().length < 6) {
      this.erro.set('A senha precisa de pelo menos 6 caracteres.');
      return;
    }
    this.enviando.set(true);
    this.erro.set(null);
    this.auth.registrar({
      nome: this.nome().trim(),
      email: this.email().trim(),
      senha: this.senha(),
      telefone: this.telefone().trim() || undefined,
      cidade: this.cidade().trim() || undefined,
      estado: this.estado().trim() || undefined,
    }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.enviando.set(false);
        this.erro.set(err?.error?.erro || 'Não conseguimos criar sua conta agora.');
      },
    });
  }
}
