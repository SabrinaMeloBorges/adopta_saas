import { Component, computed, input } from '@angular/core';
import { StatusPet } from '../../nucleo/modelos/pet.model';

@Component({
  selector: 'app-badge-status',
  imports: [],
  templateUrl: './badge-status.html',
  styleUrl: './badge-status.scss',
})
export class BadgeStatus {
  status = input.required<StatusPet>();

  protected rotulo = computed(() => {
    switch (this.status()) {
      case 'disponivel':  return 'Disponível pra adoção';
      case 'em_processo': return 'Em processo de adoção';
      case 'adotado':     return 'Já foi adotado';
    }
  });

  protected modificador = computed(() => `badge-status--${this.status()}`);
}
