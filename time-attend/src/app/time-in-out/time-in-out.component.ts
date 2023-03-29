import { CrudHttpService } from './../crud-http-service.service';
import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
@Component({
  selector: 'app-time-in-out',
  templateUrl: './time-in-out.component.html',
  styleUrls: ['./time-in-out.component.css']
})
export class TimeInOutComponent implements OnInit {
  user_info: userInfo[]=[];
  user_id!: any;
  user_name!: any;
  isCollapsed = true;
  confirmModal?: NzModalRef;
constructor(private user: UserServiceService,private crudHttpService:CrudHttpService,private modal:NzModalService,private router:Router){

}
  ngOnInit(): void {
   this.user_id = this.user.getUser()
   this.User_();
   console.log('id',this.user_id);
  }
  User_() {
    this.crudHttpService.getEmployeeID(this.user_id).subscribe((Response) => {

        this.user_info = Object.values(Response);
        console.log('user_info',this.user_info);
        const [userName] = Object.values(this.user_info);
        this.user_name = userName;
        console.log('username',userName);
    });
  }

  time_in(){

  }


  logout(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you want to logout?',
      nzOnOk: () =>
        new Promise((resolve, reject) => {

        setTimeout(Math.random() > 0.5 ? resolve : reject, 800);
        this.router.navigate([''])

        }).catch(() => console.log('Oops errors!'))
    });
  }


}

interface userInfo{

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


}
