import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from './api';
import {
  NovaSolicitacao,
  Solicitacao,
  StatusSolicitacao,
} from '../modelos/solicitacao.model';

@Injectable({ providedIn: 'root' })
export class Solicitacoes {
  private http = inject(HttpClient);
  private api = inject(Api);

  listar(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(this.api.url('/solicitacoes'));
  }

  criar(dados: NovaSolicitacao): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(this.api.url('/solicitacoes'), dados);
  }

  atualizarStatus(id: number, status: StatusSolicitacao, resposta_admin?: string): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(this.api.url(`/solicitacoes/${id}/status`), {
      status,
      resposta_admin,
    });
  }

  indicadores(): Observable<{ solicitacoes: Record<StatusSolicitacao, number> }> {
    return this.http.get<{ solicitacoes: Record<StatusSolicitacao, number> }>(
      this.api.url('/solicitacoes/admin/indicadores'),
    );
  }
}
