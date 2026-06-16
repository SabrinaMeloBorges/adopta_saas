import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pets } from '../../nucleo/servicos/pets';
import { Pet } from '../../nucleo/modelos/pet.model';
import { BadgeStatus } from '../../compartilhado/badge-status/badge-status';

@Component({
  selector: 'app-pets-crud',
  standalone: true,
  imports: [RouterLink, BadgeStatus],
  templateUrl: './pets-crud.html',
  styleUrl: './pets-crud.scss',
})
export class PetsCrud implements OnInit {
  private petsServ = inject(Pets);

  protected pets = signal<Pet[]>([]);
  protected carregando = signal(true);

  ngOnInit() {
    this.recarregar();
  }

  protected recarregar() {
    this.carregando.set(true);
    this.petsServ.listar({ limit: 50 }).subscribe({
      next: (r) => { this.pets.set(r.itens); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
  }

  protected deletar(pet: Pet) {
    if (!confirm(`Apagar ${pet.nome || 'esse pet'}? Essa ação não dá pra desfazer.`)) return;
    this.petsServ.deletar(pet.id).subscribe(() => this.recarregar());
  }
}
