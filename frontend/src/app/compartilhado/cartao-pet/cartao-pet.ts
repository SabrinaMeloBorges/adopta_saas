import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pet } from '../../nucleo/modelos/pet.model';
import { Favoritos } from '../../nucleo/servicos/favoritos';
import { BadgeStatus } from '../badge-status/badge-status';

@Component({
  selector: 'app-cartao-pet',
  standalone: true,
  imports: [RouterLink, BadgeStatus],
  templateUrl: './cartao-pet.html',
  styleUrl: './cartao-pet.scss',
})
export class CartaoPet {
  pet = input.required<Pet>();
  /** Variação visual: muda o cantinho do card de cada pet pra evitar uniformidade */
  variante = input<number>(0);

  private favoritos = inject(Favoritos);

  protected favoritado = computed(() => this.favoritos.estaFavoritado(this.pet().id));

  protected imagemUrl = computed(() => {
    const foto = this.pet().foto_principal || this.pet().fotos?.[0];
    if (!foto) return null;
    return `data:${foto.mime_type};base64,${foto.foto_base64}`;
  });

  protected nomeOuFallback = computed(() => {
    const nome = this.pet().nome;
    if (nome) return nome;
    const especie = this.pet().especie;
    return especie === 'gato' ? 'Gatinho sem nome' : especie === 'cachorro' ? 'Cachorro sem nome' : 'Pet sem nome';
  });

  protected idadeTexto = computed(() => {
    const meses = this.pet().idade_aprox_meses;
    if (!meses) return 'Idade indefinida';
    if (meses < 12) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    const anos = Math.floor(meses / 12);
    const sobra = meses % 12;
    if (sobra === 0) return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
    return `${anos}a ${sobra}m`;
  });

  protected porteTexto = computed(() => {
    return { pequeno: 'Pequeno', medio: 'Médio', grande: 'Grande' }[this.pet().porte];
  });

  protected sexoIcone = computed(() => (this.pet().sexo === 'macho' ? 'male' : 'female'));

  alternarFavorito(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.favoritos.alternar(this.pet().id);
  }
}
