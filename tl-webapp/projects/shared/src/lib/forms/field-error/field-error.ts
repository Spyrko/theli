import { Component, Input } from '@angular/core';
import { MatError, MatFormFieldControl } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, map, mergeMap, Observable, of, Subject } from 'rxjs';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { AsyncPipe, NgIf } from '@angular/common';
import { SharedLibConfig } from '../../lib-config';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-field-error',
  templateUrl: './field-error.html',
  styleUrls: ['./field-error.scss'],
  imports: [
    ReactiveFormsModule,
    MatTimepickerModule,
    MatError,
    NgIf,
    AsyncPipe
  ]
})
export class FieldError {
  readonly ERROR_PATH: string;

  @Input()
  public set formFieldControl(formFieldControl: MatFormFieldControl<any>) {
    if (formFieldControl?.ngControl) {
      formFieldControl.stateChanges.pipe(map(() => Object.keys(formFieldControl.ngControl?.errors ?? {})[0])).subscribe(error => this.errorSubj$.next(error));
      formFieldControl.stateChanges.pipe(map(() => formFieldControl.errorState)).subscribe(show => this.showError$.next(show));
    }
  };

  @Input()
  public customErrorPath?: string;

  protected errorSubj$: Subject<string | null> = new BehaviorSubject<string | null>(null);
  protected error$: Observable<string | null>;
  protected showError$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private sharedLibConfig: SharedLibConfig, private translocoService: TranslocoService) {
    this.ERROR_PATH = this.sharedLibConfig.translationPaths.error;
    this.error$ = this.errorSubj$.pipe(mergeMap(error => {
      if (error) {
        return this.translocoService.selectTranslate([`${this.customErrorPath}.${error}`, `${this.ERROR_PATH}.${error}`]).pipe(map(([translation, fallback]) => {
          if (translation !== `${this.customErrorPath}.${error}`) {
            return translation;
          } else {
            return fallback;
          }
        }));
      }
      return of(null);
    }));
  }

}
