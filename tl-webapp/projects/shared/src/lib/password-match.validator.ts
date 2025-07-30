import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function deleteError<TValue>(control: AbstractControl<TValue>) {
  // Nur löschen, wenn keine anderen Fehler vorhanden
  if (control.hasError('passwordMismatch')) {
    const errors = control.errors;
    if (errors) {
      delete errors['passwordMismatch'];
      if (Object.keys(errors).length === 0) {
        control.setErrors(null);
      } else {
        control.setErrors(errors);
      }
    }
  }
}

export function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const passwordControl = group.get('password');
  const confirmControl = group.get('passwordConfirm');

  if (!passwordControl || !confirmControl) return null;

  const password = passwordControl.value;
  const confirm = confirmControl.value;


  if(!passwordControl.touched || !confirmControl.touched) {
    return null;
  }

  // Wenn die Passwörter nicht übereinstimmen, Fehler an confirm setzen
  if (password !== confirm) {
    confirmControl.setErrors({...confirmControl.errors, passwordMismatch: true});
    passwordControl.setErrors({...passwordControl.errors, passwordMismatch: true});
    return {passwordMismatch: true};
  } else {
    deleteError(confirmControl);
    deleteError(passwordControl);
    return null;
  }
}
