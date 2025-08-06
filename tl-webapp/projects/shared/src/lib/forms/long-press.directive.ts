import { Directive, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective implements OnDestroy {
  @Input() duration = 500;
  @Output() longPress = new EventEmitter<MouseEvent | TouchEvent>();
  @Output() shortPress = new EventEmitter<void>();

  private pressTimeoutId: any;

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onPressStart(event: MouseEvent | TouchEvent) {
    this.pressTimeoutId = setTimeout(() => {
      this.pressTimeoutId = null;
      this.longPress.emit(event);
    }, this.duration);
  }

  @HostListener('mouseup')
  @HostListener('touchend')
  @HostListener('touchcancel')
  onPressEndHandler() {
    if (this.pressTimeoutId) {
      clearTimeout(this.pressTimeoutId);
      this.pressTimeoutId = null;
      this.shortPress.emit();
    }
  }

  ngOnDestroy() {
    if (this.pressTimeoutId) {
      clearTimeout(this.pressTimeoutId);
    }
  }
}
