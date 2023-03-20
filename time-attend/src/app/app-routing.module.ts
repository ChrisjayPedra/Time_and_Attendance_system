import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UserListComponent } from './user-list/user-list.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AdduserComponent } from './adduser/adduser.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { AddemployeeComponent } from './addemployee/addemployee.component';
import { TimeInOutComponent } from './time-in-out/time-in-out.component';
const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component:HomeComponent,
  children:[ {path: 'dashboard', component:DashboardComponent},
             {path: 'attendance', component:AttendanceComponent},
             {path: 'userlist', component:UserListComponent,
              children:[{path: 'adduser', component:AdduserComponent}]},
             {path: 'employeelist', component:EmployeeListComponent,
              children:[{path: 'addemployee', component:AddemployeeComponent}]}]},
  {path: 'time_in_out', component: TimeInOutComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
