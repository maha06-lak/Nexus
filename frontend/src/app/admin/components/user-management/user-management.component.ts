import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users: any[] = [];
  loading = true;
  error = '';
  successMsg = '';
  delayMs = 0;

  showModal = false;
  editingUser: any = null;
  userForm!: FormGroup;
  formLoading = false;
  formError = '';

  deleteConfirmId: string | null = null;
  searchTerm = '';
  filterRole = '';

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm(user?: any): void {
    this.userForm = this.fb.group({
      userId: [user?.userId || '', [Validators.required, Validators.minLength(3)]],
      name: [user?.name || '', [Validators.required]],
      email: [user?.email || '', [Validators.required, Validators.email]],
      password: ['', user ? [] : [Validators.required, Validators.minLength(6)]],
      role: [user?.role || 'General User', Validators.required],
      department: [user?.department || ''],
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll(this.delayMs).pipe(takeUntil(this.destroy$)).subscribe({
      next: (users: any[]) => { this.users = users; this.loading = false; },
      error: (err: any) => { this.error = err?.error?.message || 'Failed to load users'; this.loading = false; },
    });
  }

  get filteredUsers(): any[] {
    return this.users.filter((u) => {
      const s = this.searchTerm.toLowerCase();
      const matchSearch = !s || u.name?.toLowerCase().includes(s) || u.userId?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s);
      const matchRole = !this.filterRole || u.role === this.filterRole;
      return matchSearch && matchRole;
    });
  }

  openCreate(): void { this.editingUser = null; this.initForm(); this.formError = ''; this.showModal = true; }
  openEdit(user: any): void { this.editingUser = user; this.initForm(user); this.formError = ''; this.showModal = true; }
  closeModal(): void { this.showModal = false; this.editingUser = null; this.formError = ''; }

  onSubmit(): void {
    if (this.userForm.invalid) { this.userForm.markAllAsTouched(); return; }
    this.formLoading = true;
    this.formError = '';
    const data = { ...this.userForm.value };
    if (!data.password) delete data.password;

    const req$ = this.editingUser
      ? this.userService.update(this.editingUser._id || this.editingUser.id, data)
      : this.userService.create(data);

    req$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => { this.formLoading = false; this.closeModal(); this.showSuccess(this.editingUser ? 'User updated!' : 'User created!'); this.loadUsers(); },
      error: (err: any) => { this.formLoading = false; this.formError = err?.error?.message || 'Operation failed'; },
    });
  }

  confirmDelete(id: string): void { this.deleteConfirmId = id; }

  deleteUser(id: string): void {
    this.userService.delete(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => { this.deleteConfirmId = null; this.showSuccess('User deleted!'); this.loadUsers(); },
      error: (err: any) => { this.error = err?.error?.message || 'Delete failed'; this.deleteConfirmId = null; },
    });
  }

  toggleStatus(user: any): void {
    const id = user._id || user.id;
    this.userService.toggleStatus(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        const idx = this.users.findIndex((u) => (u._id || u.id) === id);
        if (idx !== -1) this.users[idx] = res.user;
        this.showSuccess(`User ${res.user.isActive ? 'activated' : 'deactivated'}`);
      },
      error: () => { this.showSuccess('Status updated (mock mode)'); this.loadUsers(); },
    });
  }

  showSuccess(msg: string): void { this.successMsg = msg; setTimeout(() => (this.successMsg = ''), 3000); }
  getInitials(name: string): string { return name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '??'; }
  goToDashboard(): void { this.router.navigate(['/dashboard']); }
  logout(): void { this.authService.logout(); }
  get f() { return this.userForm.controls; }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
