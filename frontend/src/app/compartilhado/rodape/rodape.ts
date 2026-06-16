import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rodape',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './rodape.html',
  styleUrl: './rodape.scss',
})
export class Rodape {}
