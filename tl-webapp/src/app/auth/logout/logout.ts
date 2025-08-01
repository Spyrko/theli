import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'shared';

@Component({
  selector: 'app-logout',
  imports: [],
  template: '',
})
export class Logout implements OnInit {
  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    // Perform logout login. clearing tokens, redirecting to login page
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
