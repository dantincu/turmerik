import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppService } from './services/app-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(private appService: AppService) {}
}
