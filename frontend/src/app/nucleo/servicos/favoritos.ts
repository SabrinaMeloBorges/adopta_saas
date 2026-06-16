import { Injectable, computed, signal } from '@angular/core';

const CHAVE = 'adopta:favoritos';

@Injectable({ providedIn: 'root' })
export class Favoritos {
  private _ids = signal<number[]>(this.ler());

  readonly ids = computed(() => this._ids());
  readonly total = computed(() => this._ids().length);

  estaFavoritado(petId: number): boolean {
    return this._ids().includes(petId);
  }

  alternar(petId: number): boolean {
    const atuais = this._ids();
    const idx = atuais.indexOf(petId);
    let novos: number[];
    if (idx >= 0) {
      novos = atuais.filter((id) => id !== petId);
    } else {
      novos = [...atuais, petId];
    }
    this._ids.set(novos);
    this.salvar(novos);
    return novos.includes(petId);
  }

  limpar(): void {
    this._ids.set([]);
    this.salvar([]);
  }

  private ler(): number[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(CHAVE) || '[]');
    } catch {
      return [];
    }
  }

  private salvar(ids: number[]): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(CHAVE, JSON.stringify(ids));
  }
}
