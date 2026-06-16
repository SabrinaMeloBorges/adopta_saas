import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of, catchError } from 'rxjs';
import { Favoritos as FavoritosServ } from '../../nucleo/servicos/favoritos';
import { Pets } from '../../nucleo/servicos/pets';
import { Pet } from '../../nucleo/modelos/pet.model';
import { CartaoPet } from '../../compartilhado/cartao-pet/cartao-pet';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [RouterLink, CartaoPet],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.scss',
})
export class Favoritos implements OnInit {
  private favsServ = inject(FavoritosServ);
  private petsServ = inject(Pets);

  protected pets = signal<Pet[]>([]);
  protected carregando = signal(true);

  ngOnInit() {
    const ids = this.favsServ.ids();
    if (!ids.length) {
      this.carregando.set(false);
      return;
    }
    forkJoin(
      ids.map((id) =>
        this.petsServ.detalhar(id).pipe(catchError(() => of(null)))
      )
    ).subscribe((resultados) => {
      this.pets.set(resultados.filter((p): p is Pet => p !== null));
      this.carregando.set(false);
    });
  }

  protected limparTudo() {
    if (confirm('Tem certeza que quer esvaziar a lista?')) {
      this.favsServ.limpar();
      this.pets.set([]);
    }
  }
}
