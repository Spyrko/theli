import { AfterContentInit, ContentChild, Directive, ElementRef } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FieldError } from './field-error/field-error';
import { MatLabel } from '@angular/material/input';

@Directive({
  selector: '[autoError]'
})
export class AutoErrorDirective implements AfterContentInit {

  @ContentChild(MatFormFieldControl)
  formFieldControl!: MatFormFieldControl<any>;

  @ContentChild(MatLabel, {read: ElementRef})
  matLabelRef!: ElementRef<HTMLElement>;

  @ContentChild(FieldError)
  fieldError!: FieldError;

  get fieldLabel(): string | undefined {
    return this.matLabelRef?.nativeElement.textContent?.trim();
  }

  ngAfterContentInit(): void {
    if (!this.formFieldControl) {
      throw new Error(`AutoErrorDirective of field "${this.fieldLabel}" requires a MatFormFieldControl to be present in the content.`);
    }
    if (!this.fieldError) {
      throw new Error(`AutoErrorDirective of field "${this.fieldLabel}" requires a FieldError to be present in the content.`);
    }
    this.fieldError.formFieldControl = this.formFieldControl;
  }


}
