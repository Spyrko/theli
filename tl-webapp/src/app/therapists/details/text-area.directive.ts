import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'textarea'
})
export class TextareaDirective implements AfterViewInit {
  constructor(private el: ElementRef<HTMLTextAreaElement>) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.findParentByTag(this.el.nativeElement, 'mat-form-field')?.classList.add('resizable-textarea');
    })
  }

  findParentByTag(element: HTMLElement, tagName: string): HTMLElement | null {
    let parent = element.parentElement;
    tagName = tagName.toUpperCase();

    while (parent) {
      if (parent.tagName === tagName) {
        return parent;
      }
      parent = parent.parentElement;
    }

    return null;
  }
}
