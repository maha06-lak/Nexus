import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { AdminGuard } from '../core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
