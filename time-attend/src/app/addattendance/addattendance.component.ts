import { NzCronExpressionModule } from 'ng-zorro-antd/cron-expression';
import { Component, OnInit  } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { CrudHttpService } from '../crud-http-service.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, ValidationErrors, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AttendanceComponent } from '../attendance/attendance.component';
@Component({
  selector: 'app-addattendance',
  templateUrl: './addattendance.component.html',
  styleUrls: ['./addattendance.component.css']
})
export class AddattendanceComponent {


  validateForm!: FormGroup;
  size: NzButtonSize = 'large';
  searchValue = '';
  searchDate:any;
  visible = false;
  selectedValue = null;
  dateattendance :any;
  status :any;
  date = null;
  attendancetime:any;
  Date:any ;
  isCollapsed = true;
  editCache: { [key: number]: { edit: boolean; data: AttendanceList } } = {};
  attendance_list: AttendanceList[] = [];
  employee_list: EmployeeList[] = [];
  employee_list_add: EmployeeList_add[] = [];
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



  constructor(private attendanceComponent:AttendanceComponent,private message:NzMessageService ,private fb:FormBuilder,public datepipe: DatePipe,private notification:NzNotificationService,private _http:HttpClient, private crudHttpService: CrudHttpService, private router:Router) {

  let currentDateTime =this.datepipe.transform((new Date), 'MMMM d, y h:mm:ss a');
      this.Date =  currentDateTime;
     console.log(currentDateTime);
      this.onChange(this.Date);

      this.validateForm = this.fb.group({
        employee: ['', [Validators.required]],
        attendance: ['', [ Validators.required]],
        time: [null,[ Validators.required]],
      });



  }

  submitForm(){
      const data  = this.employee_list
      data.forEach((employee)=>{
        if ( employee.fname === this.validateForm.value.employee){
              console.log('employee',employee.fname);

              this.dateattendance =this.datepipe.transform((new Date), 'MMMM d, y');
             this.attendancetime =this.datepipe.transform((this.validateForm.value.time), 'h:mm a');

              if (this.validateForm.value ==='absent'){
                  this.status = 'old';
                  console.log('Old',this.status);

              }else{
                this.status = 'latest';
                console.log('latest',this.status);

              }

              let data = {
                  date: this.dateattendance,
                  attendance:this.validateForm.value.attendance,
                  up_to: this.status,
                  attendees:{
                    userName:employee.userName,
                    id:employee.id,
                    fname:employee.fname,
                    mname:employee.mname,
                    lname:employee.lname,
                    position:employee.position,
                    department:employee.department,
                    time_in:this.attendancetime,
                    time_out:'-----'

                  }

              }


              this.crudHttpService.addattendace(data).subscribe((response)=> {
                console.log('submit',this.validateForm.value)
                this.validateForm.reset();
                this.status = '';
               this.addUserNotif();
                 this.attendanceComponent.attendanceList();
                this.router.navigate(['/home/attendance'])

            }, err=>{
              this.message.create('error','Something went wrong');
              this.validateForm.reset()
            });

        }

      })

  }


  addUserNotif(): void {
    this.notification.create(
      'success',
      'Successful',
      'Attendance Complete',
      {

        nzStyle: {
          width: '600px',
          marginLeft: '-265px',
          backgroundColor:'rgba(241, 255, 246, 0.900)',
        },
        nzClass: 'test-class',


      }

    );
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
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
  apply:{
    type:string;
    date_to:string;
    date_from:string;
    reason:string;
    approval:string;
  }
}

interface EmployeeList_add {
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


interface AttendanceList {
  currentDateTime: any;
  id:number;
  date:string;
  attendance: string;
  attendees:{
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


interface AttendanceList_add {
  currentDateTime: any;
  id:number;
  date:string;
  attendance: string;
  attendees:{
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

