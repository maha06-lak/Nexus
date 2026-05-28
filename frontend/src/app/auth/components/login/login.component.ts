import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMsg = '';
  showPassword = false;

  features = [
    'Role-based access control',
    'Real-time async data processing',
    'Admin user management console',
    'Configurable API delay simulation',
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) { this.router.navigate(['/dashboard']); return; }
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['General User', Validators.required],
      delayMs: [0],
    });
  }

  fillDemo(type: 'admin' | 'user'): void {
    const map: any = {
      admin: { userId: 'admin01', password: 'admin123', role: 'Admin' },
      user: { userId: 'user01', password: 'user123', role: 'General User' },
    };
    this.loginForm.patchValue(map[type]);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.loading = true;
    this.errorMsg = '';
    const { userId, password, delayMs } = this.loginForm.value;
    this.authService.login(userId, password, delayMs || 0).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/dashboard']); },
      error: (err: any) => { this.loading = false; this.errorMsg = err?.error?.message || 'Login failed. Please try again.'; },
    });
  }

  get f() { return this.loginForm.controls; }
}
