import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Api } from './api';
import {
  DadosLogin,
  DadosRegistro,
  RespostaAuth,
  Usuario,
} from '../modelos/usuario.model';

const CHAVE_TOKEN = 'adopta:token';
const CHAVE_USUARIO = 'adopta:usuario';

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private api = inject(Api);

  private _token = signal<string | null>(this.lerToken());
  private _usuario = signal<Usuario | null>(this.lerUsuario());

  readonly usuario = computed(() => this._usuario());
  readonly token = computed(() => this._token());
  readonly autenticado = computed(() => !!this._token() && !!this._usuario());
  readonly ehAdmin = computed(() => this._usuario()?.role === 'admin');

  login(dados: DadosLogin): Observable<RespostaAuth> {
    return this.http
      .post<RespostaAuth>(this.api.url('/auth/login'), dados)
      .pipe(tap((r) => this.salvarSessao(r)));
  }

  registrar(dados: DadosRegistro): Observable<RespostaAuth> {
    return this.http
      .post<RespostaAuth>(this.api.url('/auth/registrar'), dados)
      .pipe(tap((r) => this.salvarSessao(r)));
  }

  sair(): void {
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_USUARIO);
    this._token.set(null);
    this._usuario.set(null);
  }

  private salvarSessao({ token, usuario }: RespostaAuth) {
    localStorage.setItem(CHAVE_TOKEN, token);
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
    this._token.set(token);
    this._usuario.set(usuario);
  }

  private lerToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(CHAVE_TOKEN);
  }

  private lerUsuario(): Usuario | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(CHAVE_USUARIO);
    return raw ? JSON.parse(raw) as Usuario : null;
  }
}
