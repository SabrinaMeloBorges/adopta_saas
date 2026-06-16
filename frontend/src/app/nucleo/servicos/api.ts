import { Injectable } from '@angular/core';

/**
 * Configurações de base da API. Centraliza a URL e helpers de construção de URL.
 */
@Injectable({ providedIn: 'root' })
export class Api {
  // Backend exposto em :3000 (Docker mapeia pra host)
  readonly baseUrl = 'http://localhost:3000/api';

  url(caminho: string): string {
    if (!caminho.startsWith('/')) caminho = '/' + caminho;
    return `${this.baseUrl}${caminho}`;
  }
}
