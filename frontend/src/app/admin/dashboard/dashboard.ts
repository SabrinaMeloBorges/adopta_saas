import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pets } from '../../nucleo/servicos/pets';
import { Solicitacoes } from '../../nucleo/servicos/solicitacoes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private petsServ = inject(Pets);
  private solServ = inject(Solicitacoes);

  protected disponiveis = signal(0);
  protected emProcesso = signal(0);
  protected adotados = signal(0);
  protected solPendentes = signal(0);
  protected solAprovadas = signal(0);
  protected carregando = signal(true);

  ngOnInit() {
    Promise.all([
      this.contar('disponivel', this.disponiveis.set.bind(this.disponiveis)),
      this.contar('em_processo', this.emProcesso.set.bind(this.emProcesso)),
      this.contar('adotado', this.adotados.set.bind(this.adotados)),
    ]).finally(() => {
      this.solServ.indicadores().subscribe({
        next: (r) => {
          this.solPendentes.set(r.solicitacoes.pendente || 0);
          this.solAprovadas.set(r.solicitacoes.aprovada || 0);
          this.carregando.set(false);
        },
        error: () => this.carregando.set(false),
      });
    });
  }

  private contar(status: 'disponivel' | 'em_processo' | 'adotado', setter: (n: number) => void) {
    return new Promise<void>((resolve) => {
      this.petsServ.listar({ status, limit: 1 }).subscribe({
        next: (r) => { setter(r.total); resolve(); },
        error: () => resolve(),
      });
    });
  }
}
