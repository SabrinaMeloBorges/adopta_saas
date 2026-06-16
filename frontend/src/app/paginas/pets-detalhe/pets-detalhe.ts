import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Pets } from '../../nucleo/servicos/pets';
import { Auth } from '../../nucleo/servicos/auth';
import { Favoritos } from '../../nucleo/servicos/favoritos';
import { Solicitacoes } from '../../nucleo/servicos/solicitacoes';
import { Pet } from '../../nucleo/modelos/pet.model';
import { BadgeStatus } from '../../compartilhado/badge-status/badge-status';

@Component({
  selector: 'app-pets-detalhe',
  standalone: true,
  imports: [RouterLink, FormsModule, BadgeStatus, DatePipe],
  templateUrl: './pets-detalhe.html',
  styleUrl: './pets-detalhe.scss',
})
export class PetsDetalhe implements OnInit {
  /** Vem do withComponentInputBinding() — route param :id */
  id = input.required<string>();

  private petsServ = inject(Pets);
  private solicServ = inject(Solicitacoes);
  protected auth = inject(Auth);
  private favsServ = inject(Favoritos);
  private router = inject(Router);

  protected pet = signal<Pet | null>(null);
  protected carregando = signal(true);
  protected erro = signal<string | null>(null);
  protected fotoAtiva = signal(0);

  protected mostrarFormulario = signal(false);
  protected mensagem = signal('');
  protected enviando = signal(false);
  protected sucesso = signal(false);
  protected erroEnvio = signal<string | null>(null);

  protected favoritado = computed(() => {
    const p = this.pet();
    return p ? this.favsServ.estaFavoritado(p.id) : false;
  });

  protected fotoAtual = computed(() => {
    const p = this.pet();
    if (!p?.fotos?.length) return null;
    const f = p.fotos[this.fotoAtiva()];
    return `data:${f.mime_type};base64,${f.foto_base64}`;
  });

  protected idadeTexto = computed(() => {
    const meses = this.pet()?.idade_aprox_meses;
    if (!meses) return 'Idade não informada';
    if (meses < 12) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    const anos = Math.floor(meses / 12);
    const sobra = meses % 12;
    if (sobra === 0) return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
    return `${anos} ano${anos > 1 ? 's' : ''} e ${sobra} mês${sobra > 1 ? 'es' : ''}`;
  });

  ngOnInit() {
    this.carregar();
  }

  private carregar() {
    this.carregando.set(true);
    this.petsServ.detalhar(Number(this.id())).subscribe({
      next: (p) => {
        this.pet.set(p);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(err?.status === 404 ? 'Esse pet não existe (ou já saiu pra dar uma volta).' : 'Erro ao carregar o pet.');
        this.carregando.set(false);
      },
    });
  }

  protected alternarFavorito() {
    const p = this.pet();
    if (p) this.favsServ.alternar(p.id);
  }

  protected abrirFormulario() {
    if (!this.auth.autenticado()) {
      this.router.navigate(['/login'], { queryParams: { volta: this.router.url } });
      return;
    }
    this.mostrarFormulario.set(true);
  }

  protected enviarSolicitacao() {
    const p = this.pet();
    if (!p) return;
    if (this.mensagem().trim().length < 10) {
      this.erroEnvio.set('Conta um pouquinho mais sobre você — mínimo 10 caracteres.');
      return;
    }
    this.enviando.set(true);
    this.erroEnvio.set(null);
    this.solicServ.criar({ pet_id: p.id, mensagem: this.mensagem().trim() }).subscribe({
      next: () => {
        this.enviando.set(false);
        this.sucesso.set(true);
      },
      error: (err) => {
        this.enviando.set(false);
        this.erroEnvio.set(err?.error?.erro || 'Não conseguimos enviar agora. Tenta de novo?');
      },
    });
  }

  protected mudarFoto(idx: number) {
    this.fotoAtiva.set(idx);
  }
}
