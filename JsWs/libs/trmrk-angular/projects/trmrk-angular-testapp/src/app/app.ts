import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppService } from './services/app-service';
import { ComponentIdService, ModalIdService } from 'trmrk-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(
    private appService: AppService,
    private componentIdService: ComponentIdService,
    private modalIdService: ModalIdService
  ) {
    console.log('componentId', componentIdService.getNextId());
    console.log('modalId', modalIdService.getNextId());
    console.log('componentId', componentIdService.getNextId());
    console.log('modalId', modalIdService.getNextId());
  }
}
