import { AfterViewInit, ApplicationRef, ComponentFactoryResolver, ComponentRef, Directive, ElementRef, Injector, OnDestroy, Renderer2 } from '@angular/core';
import { LabelAbove } from './label-above';

@Directive({
  selector: '[labelAbove]'
})
export class LabelAboveDirective implements AfterViewInit, OnDestroy {

  private componentRef?: ComponentRef<LabelAbove>;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private injector: Injector,
    private appRef: ApplicationRef,
    private cfr: ComponentFactoryResolver,
  ) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const matFormField = this.el.nativeElement;

      // 1. Find <field-label> or <mat-label>
      const labelElement = matFormField.querySelector('field-label') || matFormField.querySelector('mat-label');
      if (!labelElement) return;

      // 2. hide label
      this.renderer.setStyle(labelElement, 'display', 'none');

      // 3. get label text
      const labelText = labelElement.textContent?.replace('*', '').trim() || '';

      // 4. check if required
      const inputRequired = !!matFormField.querySelector('input[required], textarea[required], select[required]');
      const formFieldRequired = matFormField.hasAttribute('required');
      const isRequired = inputRequired || formFieldRequired;

      // 5. get parent element of mat-form-field
      const parent = matFormField.parentElement;
      if (!parent) return;

      // 6. create wrapper component
      const factory = this.cfr.resolveComponentFactory(LabelAbove);
      this.componentRef = factory.create(this.injector);

      this.componentRef.instance.labelText = labelText;
      this.componentRef.instance.required = isRequired;

      this.appRef.attachView(this.componentRef.hostView);

      // 7. get the root element of the component
      const wrapperElement = ( this.componentRef.hostView as any ).rootNodes[0] as HTMLElement;

      // 8. replace mat-form-field with wrapper
      this.renderer.insertBefore(parent, wrapperElement, matFormField);
      this.renderer.removeChild(parent, matFormField);

      // 9. add mat-form-field to wrapper
      wrapperElement.appendChild(matFormField);

      this.componentRef.changeDetectorRef.detectChanges();
    })
  }

  ngOnDestroy() {
    this.componentRef?.destroy()
  }
}
