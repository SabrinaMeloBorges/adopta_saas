import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Pets } from '../../nucleo/servicos/pets';
import { FotoPet, Pet, VacinaPet } from '../../nucleo/modelos/pet.model';

interface FotoNova {
  foto_base64: string;
  mime_type: string;
}

@Component({
  selector: 'app-pet-formulario',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './pet-formulario.html',
  styleUrl: './pet-formulario.scss',
})
export class PetFormulario implements OnInit {
  private petsServ = inject(Pets);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected petId = signal<number | null>(null);
  protected modo = computed(() => (this.petId() ? 'editar' : 'novo'));

  protected nome = signal('');
  protected especie = signal<'cachorro' | 'gato' | 'outro'>('cachorro');
  protected raca = signal('SRD');
  protected sexo = signal<'macho' | 'femea'>('macho');
  protected idadeMeses = signal<number | null>(null);
  protected porte = signal<'pequeno' | 'medio' | 'grande'>('medio');
  protected pesoKg = signal<number | null>(null);
  protected cor = signal('');
  protected castrado = signal(false);
  protected vermifugado = signal(false);
  protected descricao = signal('');
  protected historia = signal('');
  protected status = signal<'disponivel' | 'em_processo' | 'adotado'>('disponivel');
  protected cidade = signal('');
  protected estado = signal('');
  protected abrigo = signal('');
  protected dataResgate = signal('');
  protected microchip = signal('');
  protected bomCriancas = signal<boolean | null>(null);
  protected bomPets = signal<boolean | null>(null);
  protected bomApto = signal<boolean | null>(null);
  protected tags = signal<string[]>([]);
  protected tagNova = signal('');
  protected fotosExistentes = signal<FotoPet[]>([]);
  protected fotosRemovidas = signal<number[]>([]);
  protected fotosNovas = signal<FotoNova[]>([]);
  protected vacinas = signal<VacinaPet[]>([]);
  protected vacinaNova = signal<VacinaPet>({ nome_vacina: '', data_aplicacao: '', proxima_dose: '', observacoes: '' });
  /** IDs das vacinas carregadas do banco — pra detectar quais foram removidas no save */
  private idsVacinasOriginais: number[] = [];

  protected salvando = signal(false);
  protected erro = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.petId.set(Number(id));
      this.carregar(Number(id));
    }
  }

  private carregar(id: number) {
    this.petsServ.detalhar(id).subscribe({
      next: (p) => this.preencher(p),
      error: () => {
        this.erro.set('Pet não encontrado.');
        setTimeout(() => this.router.navigate(['/admin/pets']), 2000);
      },
    });
  }

  private preencher(p: Pet) {
    this.nome.set(p.nome || '');
    this.especie.set(p.especie);
    this.raca.set(p.raca);
    this.sexo.set(p.sexo);
    this.idadeMeses.set(p.idade_aprox_meses);
    this.porte.set(p.porte);
    this.pesoKg.set(p.peso_kg);
    this.cor.set(p.cor_pelagem || '');
    this.castrado.set(p.castrado);
    this.vermifugado.set(p.vermifugado);
    this.descricao.set(p.descricao || '');
    this.historia.set(p.historia || '');
    this.status.set(p.status);
    this.cidade.set(p.cidade || '');
    this.estado.set(p.estado || '');
    this.abrigo.set(p.abrigo || '');
    // Parse data de forma segura usando Date constructor
    this.dataResgate.set(
      p.data_resgate ? new Date(p.data_resgate).toISOString().split('T')[0] : ''
    );
    this.microchip.set(p.microchip || '');
    this.bomCriancas.set(p.bom_com_criancas);
    this.bomPets.set(p.bom_com_outros_pets);
    this.bomApto.set(p.bom_em_apartamento);
    this.tags.set(p.tags || []);
    this.vacinas.set(p.vacinas || []);
    this.fotosExistentes.set(p.fotos || []);
    this.idsVacinasOriginais = (p.vacinas || []).map((v) => v.id!).filter((id) => id != null);
  }

  protected adicionarTag() {
    const t = this.tagNova().trim();
    if (t && !this.tags().includes(t)) {
      this.tags.set([...this.tags(), t]);
      this.tagNova.set('');
    }
  }
  protected removerTag(t: string) {
    this.tags.set(this.tags().filter((x) => x !== t));
  }

  protected adicionarVacina() {
    const v = this.vacinaNova();
    if (!v.nome_vacina || !v.data_aplicacao) {
      this.erro.set('Vacina precisa de nome e data.');
      return;
    }
    this.vacinas.set([...this.vacinas(), v]);
    this.vacinaNova.set({ nome_vacina: '', data_aplicacao: '', proxima_dose: '', observacoes: '' });
    this.erro.set(null);
  }
  protected removerVacina(idx: number) {
    this.vacinas.set(this.vacinas().filter((_, i) => i !== idx));
  }

  protected async aoSelecionarArquivos(evento: Event) {
    const input = evento.target as HTMLInputElement;
    if (!input.files) return;
    for (const arquivo of Array.from(input.files)) {
      const base64 = await this.lerArquivoBase64(arquivo);
      this.fotosNovas.set([...this.fotosNovas(), { foto_base64: base64, mime_type: arquivo.type }]);
    }
    input.value = '';
  }

  private lerArquivoBase64(arquivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUri = reader.result as string;
        // tira o prefixo "data:mime;base64,"
        const base64 = dataUri.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(arquivo);
    });
  }

  protected removerFotoNova(idx: number) {
    this.fotosNovas.set(this.fotosNovas().filter((_, i) => i !== idx));
  }

  protected removerFotoExistente(idx: number) {
    const fotos = this.fotosExistentes();
    const foto = fotos[idx];
    if (!foto) return;

    // Registrar para remoção no backend apenas se tiver ID
    if (foto.id != null) {
      this.fotosRemovidas.set([...this.fotosRemovidas(), foto.id]);
    } else {
      // Se não tem ID (foto nova não salva), não pode remover no servidor
      console.warn('Foto sem ID não pode ser removida do servidor');
    }
    this.fotosExistentes.set(fotos.filter((_, i) => i !== idx));
  }

  protected salvar() {
    // Prevenir múltiplos cliques (race condition)
    if (this.salvando()) {
      return;
    }
    
    // Validação incluindo nome obrigatório
    if (
      !this.nome().trim() ||
      !this.especie() ||
      !this.sexo() ||
      !this.porte()
    ) {
      this.erro.set('Nome, espécie, sexo e porte são obrigatórios.');
      return;
    }
    this.salvando.set(true);
    this.erro.set(null);

    const payload: Partial<Pet> & { tags?: string[]; fotos?: FotoNova[]; vacinas?: VacinaPet[] } = {
      nome: this.nome().trim(),
      especie: this.especie(),
      raca: this.raca().trim() || 'SRD',
      sexo: this.sexo(),
      idade_aprox_meses: this.idadeMeses(),
      porte: this.porte(),
      peso_kg: this.pesoKg(),
      cor_pelagem: this.cor().trim() || null,
      castrado: this.castrado(),
      vermifugado: this.vermifugado(),
      descricao: this.descricao().trim() || null,
      historia: this.historia().trim() || null,
      status: this.status(),
      cidade: this.cidade().trim() || null,
      estado: this.estado().trim().toUpperCase() || null,
      abrigo: this.abrigo().trim() || null,
      data_resgate: this.dataResgate() || null,
      microchip: this.microchip().trim() || null,
      bom_com_criancas: this.bomCriancas(),
      bom_com_outros_pets: this.bomPets(),
      bom_em_apartamento: this.bomApto(),
      tags: this.tags(),
    };

    if (this.modo() === 'novo') {
      payload.fotos = this.fotosNovas();
      payload.vacinas = this.vacinas();
      this.petsServ.criar(payload).subscribe({
        next: () => this.router.navigate(['/admin/pets']),
        error: (err) => { this.salvando.set(false); this.erro.set(err?.error?.erro || 'Erro ao salvar.'); },
      });
    } else {
      const idPet = this.petId()!;
      this.petsServ.atualizar(idPet, payload).subscribe({
        next: () => this.persistirRelacionados(idPet),
        error: (err) => { this.salvando.set(false); this.erro.set(err?.error?.erro || 'Erro ao salvar.'); },
      });
    }
  }

  /** Após atualizar o pet, persiste fotos novas, fotos removidas, vacinas novas e remove vacinas que foram tiradas. */
  private persistirRelacionados(idPet: number) {
    const idsAtuais = this.vacinas().map((v) => v.id).filter((id): id is number => id != null);
    const vacinasNovas = this.vacinas().filter((v) => !v.id);
    const vacinasRemovidas = this.idsVacinasOriginais.filter((id) => !idsAtuais.includes(id));

    // Calcular total de fotos (existentes após remoção + novas) para determinar foto principal
    const totalFotosAoFinal = this.fotosExistentes().length + this.fotosNovas().length;

    const ops = [
      ...this.fotosRemovidas().map((fotoId) => this.petsServ.removerFoto(idPet, fotoId)),
      ...this.fotosNovas().map((f, i) =>
        // Foto é principal apenas se for a PRIMEIRA entre todas as fotos finais
        this.petsServ.adicionarFoto(
          idPet,
          f.foto_base64,
          f.mime_type,
          totalFotosAoFinal > 0 && this.fotosExistentes().length === 0 && i === 0
        )
      ),
      ...vacinasNovas.map((v) => this.petsServ.adicionarVacina(idPet, v)),
      ...vacinasRemovidas.map((vid) => this.petsServ.removerVacina(idPet, vid)),
    ];

    if (ops.length === 0) {
      this.router.navigate(['/admin/pets']);
      return;
    }

    forkJoin(ops).subscribe({
      next: () => this.router.navigate(['/admin/pets']),
      error: (err) => {
        this.salvando.set(false);
        this.erro.set(err?.error?.erro || 'Pet salvo, mas houve erro ao salvar fotos/vacinas.');
      },
    });
  }

  protected setBomCriancas(v: boolean | null) { this.bomCriancas.set(v); }
  protected setBomPets(v: boolean | null) { this.bomPets.set(v); }
  protected setBomApto(v: boolean | null) { this.bomApto.set(v); }
}
