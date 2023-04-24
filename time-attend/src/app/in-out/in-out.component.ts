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
  isVisiblee = false;
 attendance_info: attendanceinfo[]=[];
 attendance_info_update: attendanceinfo_update[]=[];
  user_id!: any;
  user_name!: any;
  isCollapsed = true;
  confirmModal?: NzModalRef;

  date: any | null;
  time: any | null;
  status:any| null;
  currentTimee: Date | undefined;

  selectedDate!: Date;
  attendance_list:AttendanceList[]=[];
  absent : absent_list[]=[];
  presentNow : now_present_list[]=[];
  absentNow : now_absent_list[]=[];
  lateNow : now_late_list[]=[];
  present : present_list[]=[];
  late : late_list[]=[];
  employee_list : employeeList[]=[];
  employee_list_final : employeeListfinal[]=[];
  approval_list : approval_list[]=[];
  calapproved : cal_approved[]=[];
  eventlist : event_list[]=[];

  caldate:any;
  calmonth: any;
  event_count!: number;

constructor(public datepipe: DatePipe,private modal:NzModalService,private user: UserServiceService,private crudHttpService:CrudHttpService){

  let currentDateTime =this.datepipe.transform((new Date), 'MMMM d, y');
  this.time =this.datepipe.transform((new Date), 'h:mm a');
  this.date =  currentDateTime;
  console.log(currentDateTime);
  setInterval(() => {
    this.currentTimee = new Date();
  }, 1000);

   console.log('date',this.date);
  console.log('time',this.time);


}




onDateChange(date: Date) {
  console.log('onDateChange',date)
  // Handle date change event
}

handleCancell(): void {
  console.log('Clicked Cancel');
  this.isVisiblee = false;
}
Event(){
  this.isVisiblee = true;
}




getMonthData(item_date:any,date: any): number | null {

  this.calmonth =this.datepipe.transform((date), 'MMMM d, y');
  //  console.log('month',this.calmonth)
    // console.log('month',item_date)
  if (this.calmonth === item_date) {
    return 1394;
  }
  return null;




}

getDateData(item_date:any,date: any): number | null {

  this.calmonth =this.datepipe.transform((date), 'MMMM d, y');
  //  console.log('Date',this.calmonth)
    // console.log('date',item_date)
  if (this.calmonth === item_date) {
    return 1394;
  }
  return null;
}








  ngOnInit(): void {
   this.employeeList()
   this.eventList();
   this.attaendanceCount()
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
      nzTitle: 'Good luck on your work',
      nzContent: this.user_name,
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

    }else{
        this.status ='absent'
    }

    console.log('time_status',);

    const  [{id,userName,password,accessType,fname,mname,lname,email,number,position,department,image,attendance}] = Object.values(this.user_info_final)


    let employee_attendance = {
    date: this.date,
    attendance: this.status,
    up_to:"latest",
    attendees: {
      image:image,
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
    // this.attaendanceCount();

    // disable the button after time-in
    });
    console.log('prog-flow');
    let emp_status={
      attendance:'active'
    }
    this.crudHttpService.patchEmployee(id,emp_status).subscribe((Response)=>{
      // this.attaendanceCount();
      console.log(Response,'result updated');
        });

}


  time_out(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Thank you for your work!',
      nzContent: this.user_name,
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
      this.attendance_list = Object.values(Response);

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


      const [{id,attendance,attendees:{userName,fname,mname,lname,image,position,department,time_in}}] = Object.values(this.attendance_info_update);

      // console.log('id',id);
      console.log('attendeess',fname,"",mname);
      console.log('timeeeeee',this.time);
      let employee_attendance = {
          date: this.date,
          attendance: attendance,
          up_to: 'old',
          attendees: {
            image:image,
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


  attaendanceCount(){

    this.crudHttpService.attendancelist().subscribe((Response)=>{

      console.log(Response);

       this.attendance_list = Object.values(Response);

          const data = this.attendance_list
            data.forEach((attendance) => {
                if (attendance.attendance === 'present' ){
                console.log('attendancewwwww',this.date);
                console.log('attendancewwwww',attendance);
                this.present.push(attendance);
              }
              if(attendance.attendance === 'present' && attendance.date === this.date){
                console.log('present now',this.date);
                console.log('present_now',attendance);
                this.presentNow.push(attendance);
              }
              if (attendance.attendance === 'absent'){
                console.log('attendancewwwww',attendance);
                this.absent.push(attendance);
              }
              if(attendance.attendance === 'absent' && attendance.date === this.date){
                console.log('present now',this.date);
                console.log('present_now',attendance);
                this.absentNow.push(attendance);
              }
              if (attendance.attendance === 'late'){
                console.log('attendancewwwww',attendance);
                this.late.push(attendance);
              }
              if(attendance.attendance === 'late' && attendance.date === this.date){
                console.log('present now',this.date);
                console.log('present_now',attendance);
                this.lateNow.push(attendance);
              }

            })
         console.log('',data.values());





    },(error=>{


    }));

  }


  eventList() {

    this.crudHttpService.eventlist().subscribe((Response)=>{

      this.eventlist = Object.values(Response)
      console.log('EventList',this.eventlist);
      this.event_count = Object.keys(this.eventlist).length;
    })



  }

  employeeList(){


    this.crudHttpService.employeelist().subscribe((Response)=>{

      console.log(Response);

       this.employee_list = Object.values(Response);

       const data =  Object.values(this.employee_list);

       data.forEach((employee)=>{
           if (employee.apply.approval === 'pending'){
               this.employee_list_final.push(employee);
               console.log('final',this.employee_list_final);

           }else if (employee.apply.approval === 'approved'){
            this.calapproved.push(employee);
            console.log('calendar_approved',this.calapproved);
          }
       })

    },(error=>{


    }));

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
      date_join:string;
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
  image:string;
  date_join:string;
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
    image:string;
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
    image:string;
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






interface event_list{
  id: number;
  eventtype: string,
  time:string,
  date:string,
  description:string,
}

interface employeeList{

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


interface employeeListfinal{

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


interface cal_approved{

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



interface approval_list{

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
interface present_list {
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

interface now_present_list {
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
interface absent_list {
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
interface now_absent_list {
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
interface now_late_list {
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
interface late_list {
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

