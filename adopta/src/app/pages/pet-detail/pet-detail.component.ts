import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PetService, Pet } from '../../services/pet.service';
import { AdoptionService } from '../../services/adoption.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './pet-detail.component.html'
})
export class PetDetailComponent implements OnInit {
  pet: Pet | null = null;
  loading = true;
  message = '';
  sending = false;
  success = false;
  error = '';
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private adoptionService: AdoptionService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.pet = await this.petService.getById(id);
    this.authService.user$.subscribe(u => this.currentUser = u);
    this.loading = false;
  }

  async sendRequest() {
    if (!this.currentUser || !this.pet) return;
    this.sending = true;
    this.error = '';
    try {
      await this.adoptionService.create({
        petId: this.pet.id!,
        petName: this.pet.name,
        requesterId: this.currentUser.uid,
        requesterName: this.currentUser.displayName || this.currentUser.email,
        requesterEmail: this.currentUser.email,
        shelterId: this.pet.shelterId,
        status: 'pending',
        message: this.message,
        createdAt: new Date()
      });
      this.success = true;
    } catch {
      this.error = 'Erro ao enviar solicitação. Tente novamente.';
    } finally {
      this.sending = false;
    }
  }
}