import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'trmrk-spinner',
  imports: [MatProgressSpinnerModule],
  templateUrl: './trmrk-spinner.html',
  styleUrl: './trmrk-spinner.scss',
})
export class TrmrkSpinner {}
