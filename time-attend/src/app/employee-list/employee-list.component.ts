import { Component, OnInit  } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { CrudHttpService } from '../crud-http-service.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {


  size: NzButtonSize = 'large';
  searchValue = '';
  visible = false;


  isCollapsed = true;
  editCache: { [key: number]: { edit: boolean; data: EmployeeList } } = {};
  employee_list: EmployeeList[] = [];

//export table

exportTableToExcel():void {

  console.log('Download');
  const downloadLink = document.createElement('a');
  const dataType = 'application/vnd.ms-excel';
  const table = document.getElementById('employeeList_sheet');
  const tableHtml = table?.outerHTML.replace(/ /g, '%20');
  document.body.appendChild(downloadLink);
  downloadLink.href = 'data:'+ dataType + ' ' + tableHtml;
  downloadLink.download = 'employeeList_sheet.xls';
  downloadLink.click();
  console.log('Download');

}


  //notification
  deleteNotif(): void {
    this.notification.create(
      'success',
      'Successful',
      'Delete employee complete',
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
  updateNotif(): void {
    this.notification.create(
      'success',
      'Successful',
      'Update employee complete',
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


  //update User
 startEdit(id: number): void {
    this.editCache[id].edit = true;
   console.log('edit', this.editCache[id])
  }

  cancelEdit(id: number): void {
    const index = this.employee_list.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.employee_list[index] },
      edit: false
    };
  }

  saveUser(id: number): void {
    const index = this.employee_list.findIndex(item => item.id === id);
    Object.assign(this.employee_list[index], this.editCache[id].data);



        this.crudHttpService.updateEmployee(id,this.editCache[id].data).subscribe((response)=>{
          this.updateNotif();
          this.employeeList();
              },(error=>{

        }));

    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.employee_list.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }





  ngOnInit(): void {
    this.employeeList();
    this.search();

  }

  //get all employee
  employeeList(){
    this.crudHttpService.employeelist().subscribe((Response)=>{
      console.log('Response');
      console.log(Response);
      this.employee_list = Object.values(Response);
      this.updateEditCache();
      },(error=>{

      }));

  }




//delete user

  deleteEmployee(employee: any){
    this.crudHttpService.deleteEmployee(employee).subscribe((response)=>{
      this.deleteNotif();
      this.employeeList();
    },(error=>{
    }));
  }





//search user
  reset(): void {
    this.searchValue = '';
    this.employeeList();
  }



  search(): void {

      this.visible = false;
      this.employee_list = this.employee_list.filter((item: EmployeeList) => item.fname.indexOf(this.searchValue) !== -1);
      console.log('employee',this.employee_list);
      console.log('employee_list lenght',Object.values(this.employee_list).length)
      this.searchValue = '';

  }

  constructor(private notification:NzNotificationService,private _http:HttpClient, private crudHttpService: CrudHttpService, private router:Router) {}




}

interface EmployeeList {
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



