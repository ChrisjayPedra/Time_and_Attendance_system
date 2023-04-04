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
  user_info_data: userInfo_data[]=[];
  user_id!: any;
  user_name!: any;
  image!:any;
  isCollapsed = true;
  confirmModal?: NzModalRef;
constructor(private user: UserServiceService,private crudHttpService:CrudHttpService,private modal:NzModalService,private router:Router){

}
  ngOnInit(): void {
   this.user_id = this.user.getUser()
   this.User_();
   this.image = this.user.getImage();
   console.log('id',this.user_id);
   console.log('image',this.image);
  }
  User_() {
    this.crudHttpService.getEmployeeID(this.user_id).subscribe((Response) => {

        this.user_info = Object.values(Response);
        // console.log('user_info datadatadtda',this.user_info);
        const [userName] = Object.values(this.user_info);

        this.user_info_data = Object.values(this.user_info);

        const data = Object.values(this.user_info_data);
        data.forEach((item) => {
          if (item.id === this.user_id){
            this.user_info_data.push(item);
            console.log(this.user_info_data,'datdatdatda');
          }
        })

        this.user_name = userName;

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
  image:string;
  apply:{
    type:string;
    date_to:string;
    date_from:string;
    reason:string;
    approval:string;
  },

}

interface userInfo_data{

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
  apply:{
    type:string;
    date_to:string;
    date_from:string;
    reason:string;
    approval:string;
  },

}
