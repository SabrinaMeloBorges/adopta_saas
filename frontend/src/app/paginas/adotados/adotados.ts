import { Component, OnInit, inject, signal } from '@angular/core';
import { Pets } from '../../nucleo/servicos/pets';
import { Pet } from '../../nucleo/modelos/pet.model';
import { CartaoPet } from '../../compartilhado/cartao-pet/cartao-pet';

@Component({
  selector: 'app-adotados',
  standalone: true,
  imports: [CartaoPet],
  templateUrl: './adotados.html',
  styleUrl: './adotados.scss',
})
export class Adotados implements OnInit {
  private petsServ = inject(Pets);

  protected pets = signal<Pet[]>([]);
  protected carregando = signal(true);

  ngOnInit() {
    this.petsServ.listar({ status: 'adotado', limit: 48 }).subscribe({
      next: (r) => { this.pets.set(r.itens); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
  }
}
