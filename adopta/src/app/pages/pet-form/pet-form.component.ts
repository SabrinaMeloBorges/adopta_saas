import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pet-form.component.html'
})
export class PetFormComponent {
  pet = { name: '', species: 'dog', breed: '', age: 1, gender: 'male', description: '' };
  photoFile: File | null = null;
  loading = false;
  error = '';
  currentUser: any = null;

  constructor(
    private petService: PetService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.user$.subscribe(u => this.currentUser = u);
  }

  onFileChange(event: any) {
    this.photoFile = event.target.files[0] || null;
  }

  async onSubmit() {
    if (!this.currentUser) return;
    this.loading = true;
    this.error = '';
    try {
      const docRef = await this.petService.create({
        ...this.pet,
        photos: [],
        status: 'available',
        shelterId: this.currentUser.uid,
        shelterName: this.currentUser.displayName || this.currentUser.email,
        createdAt: new Date()
      });

      if (this.photoFile) {
        const url = await this.petService.uploadPhoto(this.photoFile, docRef.id);
        await this.petService.update(docRef.id, { photos: [url] });
      }

      this.router.navigate(['/dashboard']);
    } catch {
      this.error = 'Erro ao cadastrar pet. Tente novamente.';
    } finally {
      this.loading = false;
    }
  }
}