import { CrudHttpService } from './../crud-http-service.service';
import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-in-out',
  templateUrl: './in-out.component.html',
  styleUrls: ['./in-out.component.css']
})
export class InOutComponent implements OnInit {
  buttonIn=false;
  buttonOut=true;
  user_info: userInfo[]=[];
  user_info_final: userInfofinal[]=[];

 attendance_info: attendanceinfo[]=[];
 attendance_info_update: attendanceinfo_update[]=[];
  user_id!: any;
  user_name!: any;
  isCollapsed = true;
  confirmModal?: NzModalRef;
  currentDateTime:any|null;
  date: any | null;
  time: any | null;
  status:any| null;
constructor(public datepipe: DatePipe,private modal:NzModalService,private user: UserServiceService,private crudHttpService:CrudHttpService){
  this.currentDateTime =this.datepipe.transform((new Date), 'MMMM d, y h:mm:ss a');
  this.date =this.datepipe.transform((new Date), 'MMMM d, y');
  this.time =this.datepipe.transform((new Date), 'h:mm a');

  console.log('currentdatetime',this.currentDateTime);
  console.log('date',this.date);
  console.log('time',this.time);


}

  ngOnInit(): void {



   this.user_id = this.user.getUser()
   this.User_();
   console.log('id',this.user_id);

   this.crudHttpService.attendancelist().subscribe((Response) => {
    this.attendance_info = Object.values(Response);
    console.log('First data',this.attendance_info);
    const data = Object.values(this.attendance_info)
    console.log('username22222222222222222',this.user_name);
    data.forEach((attendance) => {
        if (attendance.up_to === 'latest'){
            if (attendance.attendees.id === this.user_id){
              if (attendance.attendees.time_out ==='-----'){
                console.log('button disabled')

                this.buttonOut = false;
                this.buttonIn = true;
              }else{
                console.log('button enabled')

                this.buttonOut = true;
                this.buttonIn = false;

                // this.buttonIn =   false;
                // this.buttonOut == false;
              }
              console.log('----------------',attendance.up_to);
              console.log('information_attendees',attendance);

            }


        }
    })
  });
  }

  User_() {


    this.crudHttpService.employeelist().subscribe((Response) => {
        this.user_info = Object.values(Response);
        console.log('employeee',this.user_info)
        console.log('employee id',this.user_id)
        const Employee = Object.values(this.user_info);
        Employee.forEach((employee) =>{
              if (employee.id === this.user_id){
                 console.log('employee.name = ' + employee.userName)
                 this.user_name = employee.userName;
                 this.user_info_final.push(employee)
                 console.log('user_info--------------------------------------',this.user_info_final);
              }
        })
        console.log('username11111111111111111111',this.user_name);
    });



  }

  time_in(): void {

    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete these items?',
      nzContent: 'Your Name'+this.user_name,
      nzOnOk: () =>

        new Promise((resolve, reject) => {
          this.attendance_present();
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);

        }).catch(() => console.log('Oops errors!'))
    });

  }

attendance_present(){
    if (this.time > '7:24 PM'){

        this.status = 'late'

    }else if  (this.time < '7:24 PM'){

        this.status = 'present'

    }

    console.log('time_status',this.status);

    const  [{id,userName,password,accessType,fname,mname,lname,email,number,position,department,attendance}] = Object.values(this.user_info_final)


    let employee_attendance = {
    date: this.date,
    attendance: this.status,
    up_to:"latest",
    attendees: {
      id:id,
      userName:userName,
      fname: fname,
      mname: mname,
      lname: lname,
      position: position,
      department: department,
      time_in: this.time,
      time_out: "-----"
      }
    }
    this.crudHttpService.addattendace(employee_attendance).subscribe((Response)=>{
    console.log('submit',employee_attendance);
    this.buttonIn = true;
    this.buttonOut = false;
    this.status = '';
    // disable the button after time-in
    });

}


  time_out(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete these items?',
      nzContent: 'Your Name'+this.user_name,
      nzOnOk: () =>
        new Promise((resolve, reject) => {
        this.attendance_update();
        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);

        }).catch(() => console.log('Oops errors!'))
    });
  }



  attendance_update(){

    this.crudHttpService.attendancelist().subscribe((Response) => {
      this.attendance_info = Object.values(Response);
      console.log('------------------------attendance_info',this.attendance_info);
      const data = Object.values(this.attendance_info)

      data.forEach((attendance) => {
          if (attendance.up_to === 'latest'){
              if (attendance.attendees.userName === this.user_name){
                console.log('----------------',attendance.up_to);
                console.log('username',this.user_name);
                console.log('information_attendees',attendance);
                this.attendance_info_update.push(attendance)
                console.log('attendance info update', this.attendance_info_update);
              }


          }
      })
      const [{id,attendance,attendees:{userName,fname,mname,lname,position,department,time_in}}] = Object.values(this.attendance_info_update);

      // console.log('id',id);
      console.log('attendeess',fname,"",mname);
      console.log('timeeeeee',this.time);
      let employee_attendance = {
          date: this.date,
          attendance: attendance,
          up_to: 'old',
          attendees: {
            userName:userName,
            fname: fname,
            mname: mname,
            lname: lname,
            position: position,
            department: department,
            time_in: time_in,
            time_out: this.time,
            }
      }

          this.crudHttpService.updateattendance(id,employee_attendance).subscribe((Response)=>{
              console.log('submit',employee_attendance);
              this.buttonIn = false;
              this.buttonOut = true;
              this.status = '';

              // disable the button after time-in

          });



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
      }


}


interface userInfofinal{

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
  }


}


interface attendanceinfo {


  id:number;
  date:string;
  attendance: string;
  up_to:string;
  attendees:{
    userName:string;
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

interface attendanceinfo_update {


  id:number;
  date:string;
  attendance: string;
  up_to:string;
  attendees:{
    userName:string;
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

