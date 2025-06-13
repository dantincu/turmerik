import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {}
