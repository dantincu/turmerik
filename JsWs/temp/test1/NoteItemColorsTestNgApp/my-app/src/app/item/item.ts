import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Entity } from '../services/types';

@Component({
  selector: 'app-item',
  imports: [CommonModule],
  templateUrl: './item.html',
  styleUrl: './item.scss',
})
export class Item {
  @Input() cssClass!: string;
  @Input() entity!: Entity;
  @Output() itemToggled = new EventEmitter<Entity>();
  @Output() itemClicked = new EventEmitter<Entity>();
}
