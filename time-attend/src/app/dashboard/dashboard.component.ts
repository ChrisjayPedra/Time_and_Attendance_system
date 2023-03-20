import { HttpClient } from '@angular/common/http';
import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { CrudHttpService } from '../crud-http-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  size: NzButtonSize = 'large';
  keyCountuser:any;
  date:any;
  keyCountemployee:any;
  present_count:any;
  absent_count:any;
  late_count:any;
  leave_count:any;
  myDate = new Date();
  attendance_list:AttendanceList[]=[];
  absent : absent_list[]=[];
  present : present_list[]=[];
  late : late_list[]=[];
  leave : leave_list[]=[];


  constructor( public datepipe: DatePipe,private _http:HttpClient,  private router:Router, private crudHttpService: CrudHttpService) {
    let currentDateTime =this.datepipe.transform((new Date), 'MMMM d, y h:mm:ss a');
    this.date =  currentDateTime;
    console.log(currentDateTime);


  }

  userList(){
    this.crudHttpService.userlist().subscribe((Response)=>{

      console.log(Response);

       this.keyCountuser = Object.keys(Response).length;
    },(error=>{


    }));

  }

  employeeList(){


    this.crudHttpService.employeelist().subscribe((Response)=>{

      console.log(Response);

       this.keyCountemployee = Object.keys(Response).length;
    },(error=>{


    }));

  }


  attaendanceCount(){


    this.crudHttpService.attendancelist().subscribe((Response)=>{

      console.log(Response);

       this.attendance_list = Object.values(Response);
          // const data = Object.values(this.attendance_list);


          const data = this.attendance_list

          // const [attendance] = data;

            data.forEach((attendance) => {
              if (attendance.attendees.fname === 'present'){
                console.log('attendancewwwww',attendance);
                this.present.push(attendance);
              }
              if (attendance.attendance === 'present'){
                console.log('attendancewwwww',attendance);
                this.present.push(attendance);
              }
              if (attendance.attendance === 'absent'){
                console.log('attendancewwwww',attendance);
                this.absent.push(attendance);
              }
              if (attendance.attendance === 'late'){
                console.log('attendancewwwww',attendance);
                this.late.push(attendance);
              }
              if (attendance.attendance === 'leave'){
                console.log('attendancewwwww',attendance);
                this.leave.push(attendance);
              }

            })
        this.present_count = Object.keys(this.present).length;
        this.absent_count = Object.keys(this.absent).length;
        this.late_count = Object.keys(this.late).length;
        this.leave_count = Object.keys(this.leave).length;
        console.log('',data.values());

       console.log('attendance',this.present_count);

      //  console.log('data',data);


    },(error=>{


    }));

  }


  ngOnInit(): void {
    this.userList();
    this.employeeList();
    this.attaendanceCount()
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
interface present_list {
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

interface absent_list {
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
interface late_list {
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
interface leave_list {
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
