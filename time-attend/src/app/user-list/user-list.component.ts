import { Component, OnInit  } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { CrudHttpService } from '../crud-http-service.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements  OnInit{
  size: NzButtonSize = 'large';
  searchValue = '';
  visible = false;


  isCollapsed = true;
  editCache: { [key: number]: { edit: boolean; data: adminListFinal } } = {};
  user_list: UsersList[] = [];
  user_list_final: UsersList_final[] = [];
  data_list: dataList[] = [];
  admin_list: adminList[] = [];
  admin_list2: adminList2[] = [];
  admin_list_final: adminListFinal[] = [];
//export table

exportTableToExcel():void {

  console.log('Download');
  const downloadLink = document.createElement('a');
  const dataType = 'application/vnd.ms-excel';
  const table = document.getElementById('userList_sheet');
  const tableHtml = table?.outerHTML.replace(/ /g, '%20');
  document.body.appendChild(downloadLink);
  downloadLink.href = 'data:'+ dataType + ' ' + tableHtml;
  downloadLink.download = 'userList_sheet.xls';
  downloadLink.click();
  console.log('Download');

}



  //notification
  deleteNotif(): void {
    this.notification.create(
      'success',
      'Successful',
      'Delete admin complete',
      {

        nzStyle: {
          width: '600px',
          marginLeft: '-265px',
          backgroundColor:'rgba(241, 255, 246, 0.900)',
        },
        nzClass: 'notification',

      }

    );
  }
  updateUserNotif(): void {
    this.notification.create(
      'success',
      'Successful',
      'Update admin complete',
      {

        nzStyle: {
          width: '600px',
          marginLeft: '-265px',
           backgroundColor:' rgba(241, 255, 246, 0.900)',
        },
        nzClass: 'notification',

      }

    );
    this.userList();
  }


  //update User
 startEdit(id: number): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: number): void {
    const index = this.admin_list_final.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.admin_list_final[index] },
      edit: false
    };
  }

  saveUser(id: number): void {
    const index = this.admin_list_final.findIndex(item => item.id === id);
    Object.assign(this.admin_list_final[index], this.editCache[id].data);



        this.crudHttpService.updateUser(id,this.editCache[id].data).subscribe((response)=>{
          this.userList();
          this.updateUserNotif();
              },(error=>{

        }));

    this.editCache[id].edit = false;
  }
  updateEditCache(): void {
    this.admin_list_final.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }





  ngOnInit(): void {
    this.userList();
    this.search();

  }

  //get all user
  userList(){
    this.crudHttpService.userlist().subscribe((Response)=>{
      console.log('Response');
      console.log(Response);
      this.admin_list = Object.values(Response);
      const data =  Object.values(this.admin_list)
      data.forEach((data)=>{
          if (data.accessType === 'admin'){
            this.admin_list2.push(data);
          }
      });
      console.log('user list',this.admin_list2);

      this.admin_list_final = this.admin_list2;;

      console.log('data list',this.admin_list_final);

      this.updateEditCache();
      },(error=>{

      }));

  }




//delete user

  deleteUser(user: any){
    this.crudHttpService.deleteUser(user).subscribe((response)=>{
      this.deleteNotif();
      this.userList();
    },(error=>{
    }));
  }





//search user
  reset(): void {
    this.searchValue = '';
    this.userList();
  }

  search(): void {

    this.visible = false;
    this.admin_list_final = this.admin_list_final.filter((item: adminListFinal) => item.userName.indexOf(this.searchValue) !== -1);
    console.log(this.user_list);
    this.searchValue = '';

  }

  constructor(private notification:NzNotificationService,private _http:HttpClient, private crudHttpService: CrudHttpService, private router:Router) {}




}

interface adminList{
  id:number;
  userName: string;
  email:string;
  password:string;
  accessType:string
  employeeName: string;
}
interface adminList2{
  id:number;
  userName: string;
  email:string;
  password:string;
  accessType:string
  employeeName: string;
}
interface adminListFinal{
  id:number;
  userName: string;
  email:string;
  password:string;
  accessType:string
  employeeName: string;
}


interface UsersList {
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
interface UsersList_final {

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

interface dataList {

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
