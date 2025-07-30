import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { AuthService, AutoErrorDirective, FieldError } from 'shared';
import { LOGIN_PATH, REGISTER_PATH } from '../../translation-paths';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { MatButton } from '@angular/material/button';


const REDIRECT_URL = '';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatFormField,
    TranslocoPipe,
    FieldError,
    AutoErrorDirective,
    MatButton
  ]
})
export class Login implements OnInit {
  // Form group for username and password
  loginForm: FormGroup;
  errorMessage: string | null = null;
  LOGIN_PATH = LOGIN_PATH

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: AuthService,
    private translocoService: TranslocoService
  ) {
    // Initialize form with validation
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.loginService.isLoggedIn()) {
      // If user is already logged in, redirect to home page
      this.router.navigate([REDIRECT_URL]);
    }
  }

  // Submit login data to backend
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = null;

    this.loginService.login(this.loginForm.value).then(() => this.router.navigate([REDIRECT_URL])).catch(() => this.errorMessage = this.translocoService.translate(`${this.LOGIN_PATH}.errors.invalidCredentials`))
  }

  protected readonly REGISTER_PATH = REGISTER_PATH;
}
