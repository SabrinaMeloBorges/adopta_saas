import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from './api';
import { FiltrosPet, ListagemPets, Pet, VacinaPet } from '../modelos/pet.model';

@Injectable({ providedIn: 'root' })
export class Pets {
  private http = inject(HttpClient);
  private api = inject(Api);

  listar(filtros: FiltrosPet = {}): Observable<ListagemPets> {
    let params = new HttpParams();
    for (const [chave, valor] of Object.entries(filtros)) {
      if (valor !== undefined && valor !== null && valor !== '') {
        params = params.set(chave, String(valor));
      }
    }
    return this.http.get<ListagemPets>(this.api.url('/pets'), { params });
  }

  detalhar(id: number): Observable<Pet> {
    return this.http.get<Pet>(this.api.url(`/pets/${id}`));
  }

  criar(dados: Partial<Pet> & {
    tags?: string[];
    fotos?: { foto_base64: string; mime_type: string }[];
    vacinas?: VacinaPet[];
  }): Observable<Pet> {
    return this.http.post<Pet>(this.api.url('/pets'), dados);
  }

  atualizar(id: number, dados: Partial<Pet> & { tags?: string[] }): Observable<Pet> {
    return this.http.put<Pet>(this.api.url(`/pets/${id}`), dados);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(this.api.url(`/pets/${id}`));
  }

  adicionarFoto(petId: number, foto_base64: string, mime_type = 'image/jpeg', eh_principal = false): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.api.url(`/pets/${petId}/fotos`), {
      foto_base64,
      mime_type,
      eh_principal,
    });
  }

  removerFoto(petId: number, fotoId: number): Observable<void> {
    return this.http.delete<void>(this.api.url(`/pets/${petId}/fotos/${fotoId}`));
  }

  adicionarVacina(petId: number, vacina: VacinaPet): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.api.url(`/pets/${petId}/vacinas`), vacina);
  }

  removerVacina(petId: number, vacinaId: number): Observable<void> {
    return this.http.delete<void>(this.api.url(`/pets/${petId}/vacinas/${vacinaId}`));
  }
}
