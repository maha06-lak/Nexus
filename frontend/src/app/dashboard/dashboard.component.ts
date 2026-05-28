import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, User } from '../core/services/auth.service';
import { RecordService, AppRecord } from '../core/services/record.service';

interface AsyncTask {
  name: string;
  status: 'pending' | 'loading' | 'done' | 'error';
  duration?: number;
  startTime?: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: User | null = null;
  records: AppRecord[] = [];
  filteredRecords: AppRecord[] = [];
  loading = true;
  recordsLoading = true;
  error = '';
  delayMs = 2000;
  asyncTasks: AsyncTask[] = [];
  loadStartTime = 0;
  totalLoadTime = 0;

  sortField = '';
  sortDir: 'asc' | 'desc' = 'asc';
  filterStatus = '';
  filterCategory = '';
  searchTerm = '';

  stats = { total: 0, completed: 0, inProgress: 0, pending: 0, adminOnly: 0 };

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private recordService: RecordService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    this.loadStartTime = Date.now();
    this.initAsyncTasks();
    this.loadDashboardData();
  }

  initAsyncTasks(): void {
    this.asyncTasks = [
      { name: 'Authenticating session', status: 'loading', startTime: Date.now() },
      { name: 'Loading user profile', status: 'pending' },
      { name: 'Fetching records', status: 'pending' },
      { name: 'Applying access filters', status: 'pending' },
    ];
  }

  loadDashboardData(): void {
    setTimeout(() => {
      this.asyncTasks[0].status = 'done';
      this.asyncTasks[0].duration = Date.now() - (this.asyncTasks[0].startTime || 0);
      this.asyncTasks[1].status = 'loading';
      this.asyncTasks[1].startTime = Date.now();

      this.authService.getProfile(0).pipe(takeUntil(this.destroy$)).subscribe({
        next: (profile: User) => {
          this.user = profile;
          this.asyncTasks[1].status = 'done';
          this.asyncTasks[1].duration = Date.now() - (this.asyncTasks[1].startTime || 0);
          this.loading = false;
          this.asyncTasks[2].status = 'loading';
          this.asyncTasks[2].startTime = Date.now();

          this.recordService.getAll(this.delayMs).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
              this.asyncTasks[2].status = 'done';
              this.asyncTasks[2].duration = Date.now() - (this.asyncTasks[2].startTime || 0);
              this.asyncTasks[3].status = 'loading';
              this.asyncTasks[3].startTime = Date.now();

              setTimeout(() => {
                this.records = res.records || [];
                this.filteredRecords = [...this.records];
                this.calculateStats();
                this.asyncTasks[3].status = 'done';
                this.asyncTasks[3].duration = Date.now() - (this.asyncTasks[3].startTime || 0);
                this.recordsLoading = false;
                this.totalLoadTime = Date.now() - this.loadStartTime;
              }, 300);
            },
            error: () => { this.asyncTasks[2].status = 'error'; this.recordsLoading = false; this.error = 'Failed to load records'; }
          });
        },
        error: () => { this.asyncTasks[1].status = 'error'; this.loading = false; }
      });
    }, 500);
  }

  calculateStats(): void {
    this.stats = {
      total: this.records.length,
      completed: this.records.filter((r: AppRecord) => r.status === 'Completed').length,
      inProgress: this.records.filter((r: AppRecord) => r.status === 'In Progress').length,
      pending: this.records.filter((r: AppRecord) => r.status === 'Pending').length,
      adminOnly: this.records.filter((r: AppRecord) => r.accessLevel === 'admin').length,
    };
  }

  applyFilters(): void {
    let result = [...this.records];
    if (this.searchTerm) {
      const s = this.searchTerm.toLowerCase();
      result = result.filter((r: AppRecord) => r.title.toLowerCase().includes(s) || r.category.toLowerCase().includes(s));
    }
    if (this.filterStatus) result = result.filter((r: AppRecord) => r.status === this.filterStatus);
    if (this.filterCategory) result = result.filter((r: AppRecord) => r.category === this.filterCategory);
    if (this.sortField) {
      result.sort((a: any, b: any) => {
        const av = a[this.sortField] || '';
        const bv = b[this.sortField] || '';
        return this.sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
      });
    }
    this.filteredRecords = result;
  }

  sort(field: string): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'asc';
    }
    this.applyFilters();
  }

  reloadWithDelay(): void {
    this.recordsLoading = true;
    this.asyncTasks[2].status = 'loading';
    this.asyncTasks[2].startTime = Date.now();
    this.asyncTasks[3].status = 'pending';
    const start = Date.now();
    this.recordService.getAll(this.delayMs).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.asyncTasks[2].status = 'done';
        this.asyncTasks[2].duration = Date.now() - start;
        this.asyncTasks[3].status = 'done';
        this.records = res.records || [];
        this.filteredRecords = [...this.records];
        this.calculateStats();
        this.recordsLoading = false;
      },
      error: () => { this.asyncTasks[2].status = 'error'; this.recordsLoading = false; }
    });
  }

  logout(): void { this.authService.logout(); }
  goToAdmin(): void { this.router.navigate(['/admin']); }
  isAdmin(): boolean { return this.authService.isAdmin(); }
  getInitials(name: string): string { return name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '??'; }
  getPriorityClass(p: string): string { return p?.toLowerCase().replace(' ', '-') || ''; }
  getStatusClass(s: string): string { return s?.toLowerCase().replace(' ', '-') || ''; }
  formatCurrency(amount: number): string {
    if (!amount) return '—';
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
