import { Component, OnInit  } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { CrudHttpService } from '../crud-http-service.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserServiceService } from '../user-service.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent {

  employee_details: Employeedetails[] = [];


  constructor(private user:UserServiceService,private notification:NzNotificationService,private _http:HttpClient, private crudHttpService: CrudHttpService, private router:Router) {}
  ngOnInit(){
     this.employee_details = this.user.getdetails();
      console.log('data userserveiceddddddddd',this.employee_details);
    }

    back(){
      this.user.employee_details.pop();
      this.router.navigate(['home/employeelist'])
    }

}


interface Employeedetails{

  id:number;
  userName: string;
  password: string;
  accessType: string;
  fname: string;
  mname: string;
  lname: string;
  email: string;
  number: string;
  position: string;
  department: string;
  attendance: string;
  image:string;
  date_join:string;
  apply:{
    type:string;
    date_to:string;
    date_from:string;
    reason:string;
    approval:string;
  }


}
