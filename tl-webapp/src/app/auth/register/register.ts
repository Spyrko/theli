import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Router } from '@angular/router';
import { AutoErrorDirective, FieldError, HttpService, passwordMatchValidator } from 'shared';
import { REGISTER_PATH } from '../../translation-paths';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    TranslocoPipe,
    AutoErrorDirective,
    FieldError,
    MatButton
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  REGISTER_PATH = REGISTER_PATH;

  [x: string]: any;

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpService
  ) {
    // Initialize form with validation
    this.registerForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        passwordConfirm: ['', Validators.required],
      },
      {validators: passwordMatchValidator});
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    const {passwordConfirm, ...registerData} = this.registerForm.value;
    this.http.post('auth/register', registerData).then(() => this.router.navigate(["/login"])).catch((error: any) => {
      if (error?.status === 409) {
        this.registerForm.get('username')?.setErrors({usernameTaken: true});
        this.registerForm.setErrors({usernameTaken: true});
      }
    })
  }

  revalidate(): void {
    // This method is called when the form control value changes
    // It can be used to revalidate the form control if needed
    this.registerForm.updateValueAndValidity();
  }

}
