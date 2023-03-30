import { CrudHttpService } from './../crud-http-service.service';
import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-em-settings',
  templateUrl: './em-settings.component.html',
  styleUrls: ['./em-settings.component.css']
})
export class EmSettingsComponent {
  currentTimee: Date | undefined;
  isVisible = false;
  user_id: any;
user_info: userInfo[]=[];
user_info_final: userInfo_final[]=[];
editCache: { [key: number]: { edit: boolean; data: userInfo_final } } = {};




  constructor(private notification:NzNotificationService,public datepipe: DatePipe,private modal:NzModalService,private user: UserServiceService,private crudHttpService:CrudHttpService){

    let currentDateTime =this.datepipe.transform((new Date), 'MMMM d, y');
    console.log(currentDateTime);
    setInterval(() => {
      this.currentTimee = new Date();
    }, 1000);



  }

  editProfile() {
    // Show a modal or navigate to the edit profile page
    this.isVisible = true;
    console.log('Edit button clicked');
  }
  handleCancel(): void {
    console.log('Clicked Cancel');
    this.isVisible = false;
  }

  ngOnInit(): void {
    this.user_id = this.user.getUser()
    console.log('id',this.user_id);
    this.crudHttpService.employeelist().subscribe((Response) => {
        this.user_info = Object.values(Response)
        const data = Object.values(this.user_info)
        data.forEach((item) => {
          if (item.id === this.user_id){
              this.user_info_final.push(item)
              this.updateEditCache()
              console.log('USer Information', this.user_info_final)
          }
        })
    })
  }



  startEdit(id: number): void {
    this.editCache[id].edit = true;
   console.log('edit', this.editCache[id])
  }


  cancelEdit(id: number): void {
    const index = this.user_info_final.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.user_info_final[index] },
      edit: false
    };
  }

  saveUser(id: number): void {
    const index = this.user_info_final.findIndex(item => item.id === id);
    Object.assign(this.user_info_final[index], this.editCache[id].data);



        this.crudHttpService.updateEmployee(id,this.editCache[id].data).subscribe((response)=>{
           this.updateNotif();
          // this.employeeList();
              },(error=>{

        }));


    this.editCache[id].edit = false;
  }

  updateNotif(): void {
    this.notification.create(
      'success',
      'Successful',
      'Update Employee complete',
      {

        nzStyle: {
          width: '600px',
          marginLeft: '-265px',

           backgroundColor:' rgba(241, 255, 246, 0.900)',
        },
        nzClass: 'notification',

      }

    );
  }





  updateEditCache(): void {
    this.user_info_final.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
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
  apply:{
    type:string;
    date_to:string;
    date_from:string;
    reason:string;
    approval:string;
  }


}

interface userInfo_final{

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
  apply:{
    type:string;
    date_to:string;
    date_from:string;
    reason:string;
    approval:string;
  }


}
