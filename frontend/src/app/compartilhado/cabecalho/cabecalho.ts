import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../nucleo/servicos/auth';
import { Favoritos } from '../../nucleo/servicos/favoritos';

@Component({
  selector: 'app-cabecalho',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './cabecalho.html',
  styleUrl: './cabecalho.scss',
})
export class Cabecalho {
  protected auth = inject(Auth);
  protected favoritos = inject(Favoritos);
  protected menuAberto = signal(false);

  protected totalFavoritos = computed(() => this.favoritos.total());

  alternarMenu() {
    this.menuAberto.update((v) => !v);
  }

  fecharMenu() {
    this.menuAberto.set(false);
  }

  sair() {
    this.auth.sair();
    this.fecharMenu();
  }
}
