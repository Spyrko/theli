import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label-above',
  template: `
    <div class="custom-label-wrapper">
      <label class="custom-label-wrapper__label">
        {{ labelText }}
        @if (required) {
          <span class="">*</span>
        }
      </label>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./label-above.scss'],
  imports: []
})
export class LabelAbove {
  @Input() labelText = '';

  @Input() required = false;
}
