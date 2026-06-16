import { Component, OnInit, inject, signal } from '@angular/core';
import { Pets } from '../../nucleo/servicos/pets';
import { FiltrosPet as FiltrosTipo, ListagemPets, Pet } from '../../nucleo/modelos/pet.model';
import { CartaoPet } from '../../compartilhado/cartao-pet/cartao-pet';
import { FiltrosPet } from '../../compartilhado/filtros-pet/filtros-pet';

@Component({
  selector: 'app-pets-lista',
  standalone: true,
  imports: [CartaoPet, FiltrosPet],
  templateUrl: './pets-lista.html',
  styleUrl: './pets-lista.scss',
})
export class PetsLista implements OnInit {
  private petsServ = inject(Pets);

  protected pets = signal<Pet[]>([]);
  protected total = signal(0);
  protected carregando = signal(true);
  protected filtrosAtuais: FiltrosTipo = { limit: 24 };

  ngOnInit() {
    this.buscar();
  }

  protected aoAlterarFiltros(f: FiltrosTipo) {
    this.filtrosAtuais = { ...f, limit: 24 };
    this.buscar();
  }

  private buscar() {
    this.carregando.set(true);
    this.petsServ.listar(this.filtrosAtuais).subscribe({
      next: (r: ListagemPets) => {
        this.pets.set(r.itens);
        this.total.set(r.total);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }
}
