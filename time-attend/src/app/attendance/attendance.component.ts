import { NzCronExpressionModule } from 'ng-zorro-antd/cron-expression';
import { Component, OnInit  } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { CrudHttpService } from '../crud-http-service.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  size: NzButtonSize = 'large';
  searchValue = '';
  searchDate:any;
  visible = false;

  date = null;
  Date:any ;
  isCollapsed = true;
  editCache: { [key: number]: { edit: boolean; data: AttendanceList } } = {};
  attendance_list: AttendanceList[] = [];
  employee_list: EmployeeList[] = [];
  attendance_list_add: AttendanceList_add[] = [];
  // attendees_list: attendees[] = [];

  // final_list: list[] = [];

  // update_list: updatelist[] =[];

//export table

exportTableToExcel():void {

  console.log('Download');
  const downloadLink = document.createElement('a');
  const dataType = 'application/vnd.ms-excel';
  const table = document.getElementById('attendance_sheet');
  const tableHtml = table?.outerHTML.replace(/ /g, '%20');
  document.body.appendChild(downloadLink);
  downloadLink.href = 'data:'+ dataType + ' ' + tableHtml;
  downloadLink.download = 'attendance_sheet.xls';
  downloadLink.click();
  console.log('Download');

}



  //notification
  deleteNotif(): void {
    this.notification.create(
      'success',
      'Successful',
      'Delete user complete',
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
      'Update user complete',
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
  }

  cancelEdit(id: number): void {
    const index = this.attendance_list.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.attendance_list[index] },
      edit: false
    };
  }

  saveUser(id: number): void {
    const index = this.attendance_list.findIndex(item => item.id === id);
    Object.assign(this.attendance_list[index], this.editCache[id].data);




        this.crudHttpService.updateattendance(id,this.editCache[id].data).subscribe((response)=>{
          this.updateNotif();
          this.attendanceList();
              },(error=>{

        }));

    this.editCache[id].edit = false;
  }
  updateEditCache(): void {
    this.attendance_list.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }

      };

    });
  }





  ngOnInit(): void {
    this.attendanceList();
    this.employeeList()
    this.search();

  }

  //get all employee attendance
  attendanceList(){
    this.crudHttpService.attendancelist().subscribe((Response)=>{

      console.log('Response');
      console.log(Response);

      this.attendance_list = Object.values(Response);





      this.updateEditCache();
      },(error=>{

      }));

  }
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

  deleteEmployee(attendance: any){
    this.crudHttpService.deleteattendance(attendance).subscribe((response)=>{
      this.deleteNotif();
      this.attendanceList();
    },(error=>{
    }));
  }





//search user
  reset(): void {
    this.searchValue = '';
    this.searchDate='';
    this.attendanceList();
  }

  search(): void {

    this.visible = false;
    this.attendance_list = this.attendance_list.filter((item: AttendanceList) => item.date.indexOf(this.searchValue) !== -1);
    console.log(this.attendance_list);
    this.searchValue = '';

  }



//search date
onChange(result: Date): void {

  if (result == null) {
    this.attendanceList();
    this.onChange(this.Date);
  }


this.searchDate = this.datepipe.transform((result), 'MMMM d, y');


  this.visible = false;
  this.attendance_list = this.attendance_list.filter((item: AttendanceList) => item.date.indexOf(this.searchDate) !== -1);
  console.log(this.attendance_list);
  console.log('onChange: ', result);
}



  constructor(public datepipe: DatePipe,private notification:NzNotificationService,private _http:HttpClient, private crudHttpService: CrudHttpService, private router:Router) {

  let currentDateTime =this.datepipe.transform((new Date), 'MMMM d, y h:mm:ss a');
      this.Date =  currentDateTime;
     console.log(currentDateTime);
      this.onChange(this.Date);


  }



}

interface AttendanceList {
      currentDateTime: any;
      id:number;
      date:string;
      attendance: string;
      attendees:{
        image:string;
        id:number;
        fname: string;
        mname: string;
        lname: string;
        position: string;
        department: string;
        time_in:string;
        time_out:string;
      }

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
  image:string;
  apply:{
    type:string;
    date_to:string;
    date_from:string;
    reason:string;
    approval:string;
  }
}


interface AttendanceList_add {
  currentDateTime: any;
  id:number;
  date:string;
  attendance: string;
  attendees:{
    image:string;
    id:number;
    fname: string;
    mname: string;
    lname: string;
    position: string;
    department: string;
    time_in:string;
    time_out:string;
  }

}


