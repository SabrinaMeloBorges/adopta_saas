import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Solicitacoes as SolicServ } from '../../nucleo/servicos/solicitacoes';
import { Solicitacao, StatusSolicitacao } from '../../nucleo/modelos/solicitacao.model';

@Component({
  selector: 'app-solicitacoes',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './solicitacoes.html',
  styleUrl: './solicitacoes.scss',
})
export class Solicitacoes implements OnInit {
  private servSol = inject(SolicServ);

  protected itens = signal<Solicitacao[]>([]);
  protected carregando = signal(true);
  protected filtroStatus = signal<string>('');
  protected respondendoId = signal<number | null>(null);
  protected respostaTexto = signal('');

  ngOnInit() {
    this.recarregar();
  }

  protected recarregar() {
    this.carregando.set(true);
    this.servSol.listar().subscribe({
      next: (lista) => { this.itens.set(lista); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
  }

  protected get filtradas() {
    if (!this.filtroStatus()) return this.itens();
    return this.itens().filter((s) => s.status === this.filtroStatus());
  }

  protected mudarStatus(s: Solicitacao, novo: StatusSolicitacao) {
    this.servSol.atualizarStatus(s.id, novo, this.respostaTexto() || s.resposta_admin || undefined).subscribe(() => {
      this.respondendoId.set(null);
      this.respostaTexto.set('');
      this.recarregar();
    });
  }

  protected abrirResposta(id: number, mensagemAtual: string | null) {
    this.respondendoId.set(id);
    this.respostaTexto.set(mensagemAtual || '');
  }
}
