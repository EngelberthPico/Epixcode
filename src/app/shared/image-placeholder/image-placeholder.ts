import { Component, input } from '@angular/core';

@Component({
  selector: 'app-image-placeholder',
  templateUrl: './image-placeholder.html',
  styleUrl: './image-placeholder.scss',
})
export class ImagePlaceholder {
  readonly label = input.required<string>();
}
