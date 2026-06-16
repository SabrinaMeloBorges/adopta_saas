import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pets } from '../../nucleo/servicos/pets';
import { Pet } from '../../nucleo/modelos/pet.model';
import { CartaoPet } from '../../compartilhado/cartao-pet/cartao-pet';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CartaoPet],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private petsServ = inject(Pets);

  protected destaques = signal<Pet[]>([]);
  protected adotados = signal<Pet[]>([]);
  protected carregando = signal(true);
  protected erro = signal<string | null>(null);

  ngOnInit() {
    this.carregar();
  }

  private carregar() {
    this.carregando.set(true);
    this.petsServ.listar({ status: 'disponivel', limit: 6 }).subscribe({
      next: (r) => {
        this.destaques.set(r.itens);
        this.carregarAdotados();
      },
      error: () => {
        this.erro.set('Não conseguimos buscar os pets agora. Tenta de novo daqui a pouquinho?');
        this.carregando.set(false);
      },
    });
  }

  private carregarAdotados() {
    this.petsServ.listar({ status: 'adotado', limit: 3 }).subscribe({
      next: (r) => {
        this.adotados.set(r.itens);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }
}
