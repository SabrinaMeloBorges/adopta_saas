import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecalho } from './compartilhado/cabecalho/cabecalho';
import { Rodape } from './compartilhado/rodape/rodape';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Cabecalho, Rodape],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
