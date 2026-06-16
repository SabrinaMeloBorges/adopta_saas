import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Solicitacoes } from '../../nucleo/servicos/solicitacoes';
import { Solicitacao } from '../../nucleo/modelos/solicitacao.model';

@Component({
  selector: 'app-minhas-solicitacoes',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './minhas-solicitacoes.html',
  styleUrl: './minhas-solicitacoes.scss',
})
export class MinhasSolicitacoes implements OnInit {
  private servSol = inject(Solicitacoes);

  protected itens = signal<Solicitacao[]>([]);
  protected carregando = signal(true);

  ngOnInit() {
    this.servSol.listar().subscribe({
      next: (lista) => { this.itens.set(lista); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
  }

  protected rotuloStatus(s: string): string {
    return { pendente: 'Aguardando resposta', aprovada: 'Aprovada — em contato', rejeitada: 'Não rolou dessa vez', concluida: 'Adoção concluída' }[s] || s;
  }
}
