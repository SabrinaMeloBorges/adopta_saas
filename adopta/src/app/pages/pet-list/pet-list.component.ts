import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PetService, Pet } from '../../services/pet.service';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [RouterLink, FormsModule, SlicePipe],
  templateUrl: './pet-list.component.html'
})
export class PetListComponent implements OnInit {
  pets: Pet[] = [];
  filtered: Pet[] = [];
  species = '';
  loading = true;

  constructor(private petService: PetService) {}

  async ngOnInit() {
    this.pets = await this.petService.getAll({ status: 'available' });
    this.filtered = this.pets;
    this.loading = false;
  }

  filter() {
    this.filtered = this.species
      ? this.pets.filter(p => p.species === this.species)
      : this.pets;
  }
}