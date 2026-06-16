import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FiltrosPet as FiltrosTipo } from '../../nucleo/modelos/pet.model';

@Component({
  selector: 'app-filtros-pet',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filtros-pet.html',
  styleUrl: './filtros-pet.scss',
})
export class FiltrosPet {
  alterados = output<FiltrosTipo>();

  protected busca = signal('');
  protected especie = signal<string>('');
  protected porte = signal<string>('');
  protected sexo = signal<string>('');
  protected cidade = signal('');
  protected debounce?: ReturnType<typeof setTimeout>;

  protected emitir() {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      const filtros: FiltrosTipo = {};
      if (this.busca().trim()) filtros.busca = this.busca().trim();
      if (this.especie()) filtros.especie = this.especie() as FiltrosTipo['especie'];
      if (this.porte()) filtros.porte = this.porte() as FiltrosTipo['porte'];
      if (this.sexo()) filtros.sexo = this.sexo() as FiltrosTipo['sexo'];
      if (this.cidade().trim()) filtros.cidade = this.cidade().trim();
      this.alterados.emit(filtros);
    }, 250);
  }

  protected limpar() {
    this.busca.set('');
    this.especie.set('');
    this.porte.set('');
    this.sexo.set('');
    this.cidade.set('');
    this.alterados.emit({});
  }
}
