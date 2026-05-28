import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { UserManagementComponent } from './components/user-management/user-management.component';

@NgModule({
  declarations: [UserManagementComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AdminRoutingModule],
})
export class AdminModule {}
