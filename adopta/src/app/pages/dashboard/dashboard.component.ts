import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PetService, Pet } from '../../services/pet.service';
import { AdoptionService, Adoption } from '../../services/adoption.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  myPets: Pet[] = [];
  myAdoptions: Adoption[] = [];
  receivedRequests: Adoption[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private petService: PetService,
    private adoptionService: AdoptionService
  ) {}

  async ngOnInit() {
    this.authService.user$.subscribe(async user => {
      if (!user) return;
      this.currentUser = user;
      const [pets, adoptions, requests] = await Promise.all([
        this.petService.getAll(),
        this.adoptionService.getByRequester(user.uid),
        this.adoptionService.getByShelter(user.uid)
      ]);
      this.myPets = pets.filter(p => p.shelterId === user.uid);
      this.myAdoptions = adoptions;
      this.receivedRequests = requests;
      this.loading = false;
    });
  }

  formatDate(createdAt: any): string {
    if (!createdAt) return '';
    const date = createdAt.seconds
      ? new Date(createdAt.seconds * 1000)
      : new Date(createdAt);
    return date.toLocaleDateString('pt-BR');
  }

  async updateStatus(id: string, status: 'approved' | 'rejected') {
    await this.adoptionService.updateStatus(id, status);
    this.receivedRequests = this.receivedRequests.map(r =>
      r.id === id ? { ...r, status } : r
    );
  }

  async deletePet(id: string) {
    if (!confirm('Tem certeza que deseja remover este pet?')) return;
    await this.petService.delete(id);
    this.myPets = this.myPets.filter(p => p.id !== id);
  }
}