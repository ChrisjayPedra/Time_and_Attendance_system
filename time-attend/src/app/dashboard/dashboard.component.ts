import { TimeInOutComponent } from './../time-in-out/time-in-out.component';
import { HttpClient } from '@angular/common/http';
import { Component ,OnInit,ChangeDetectionStrategy,ViewChild,TemplateRef,} from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { CrudHttpService } from '../crud-http-service.service';
import { DatePipe } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import lottie from 'lottie-web';
import { defineElement } from 'lord-icon-element';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
registerLocaleData(en);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {
  eventForm!: FormGroup;
  inputValue!: string;
  test1!:'2';
  Empdate = '24';
  isVisible = false;
  isVisiblee = false;
  editCache:{ [key: number]: { data: employeeList } } = {};
  selectedDate!: Date;
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
  presentNow : now_present_list[]=[];
  absentNow : now_absent_list[]=[];
  lateNow : now_late_list[]=[];
  present : present_list[]=[];
  late : late_list[]=[];
  list_nowpresent:presentNow_list[]=[];
  employee_list : employeeList[]=[];
  employee_list_final : employeeListfinal[]=[];
  approval_list : approval_list[]=[];
  apply_records : applyrecords[]=[];
  calapproved : cal_approved[]=[];
  eventlist : event_list[]=[];
  timeline_item : timeline[]=[];
  currentTimee: Date | undefined;
  decidate:any;
pending_count!:number;
caldate:any;
calmonth: any;
employee_list_new: EmployeeList_new[] = [];
new_employee_count:any;
validateForm!: FormGroup;
radioValue = 'A';
time_sta= new Date();
date_from: any | null;

dateEv:any|null
timeEv:any|null;
dateEq:any;


editCachee: { [key: number]: { edit: boolean; data: event_list } } = {};

startEditt(id: number): void {
  this.editCachee[id].edit = true;
}

cancelEditt(id: number): void {
  const index = this.eventlist.findIndex(item => item.id === id);
  this.editCachee[id] = {
    data: { ...this.eventlist[index] },
    edit: false
  };
}

updateEditCachee(): void {
  this.eventlist.forEach(item => {
    this.editCachee[item.id] = {
      edit: false,
      data: { ...item }

    };

  });
}

saveUserr(id: number): void {
  const index = this.eventlist.findIndex(item => item.id === id);
  Object.assign(this.eventlist[index], this.editCachee[id].data);

      this.crudHttpService.updateevent(id,this.editCachee[id].data).subscribe((response)=>{
        this.eventList();
            },(error=>{

      }));

  this.editCachee[id].edit = false;
}



deleteEmployee(attendance: any){
  this.crudHttpService.deleteevent(attendance).subscribe((response)=>{

    this.eventList();
  },(error=>{
  }));
}





addEvent(){
  this.isVisible = true;
}
editEvent(){
  this.isVisiblee = true;
}


handleOk(): void {
  console.log('Clicked OK');
  console.log('eventForm',this.eventForm)
  this.isVisible = false;
}

handleCancel(): void {
  console.log('Clicked Cancel');
  this.isVisible = false;
}

handleCancell(): void {
  console.log('Clicked Cancel');
  this.isVisiblee = false;
}

  onDateChange(date: Date) {
    console.log('onDateChange',date)
    // Handle date change event
  }





























  // leave : leave_list[]=[];
  Approval:'pending' | undefined;
  apply_date:any;
  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {

    this.visible = false;

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














  submit(idd: number): void {

    const modal = this.modal.success({
      nzTitle: 'Leave Decided',
    });



    const data =  Object.values(this.employee_list);

    data.forEach((employee) => {
        if (employee.id === idd) {
          console.log("employee",employee);
          this.approval_list.push(employee);
          console.log("Approval List",this.approval_list);
        }
    })

    const  [{id,userName,password,accessType,fname,mname,lname,email,number,position,department,attendance,date_join,apply:{approval,date_to,date_from,reason,type,date_approval}}] = Object.values(this.approval_list)
    console.log('apply id',id,userName,password,accessType,fname,mname,lname,email,number,position,department,attendance)
      this.decidate = this.datepipe.transform((new Date), 'MMMM d, y');
    const applyrecords ={
      id:id,
      fname: fname,
      mname: mname,
      lname: lname,
      position: position,
      department: department,
      apply:{
        type:type,
        date_to:date_to,
        date_from:date_from,
        reason:reason,
        approval:approval,
        date_accepted:this.decidate,
        date_approval:date_approval,
  }
    }
    console.log(applyrecords,'apply records');
    this.crudHttpService.addrecord(applyrecords).subscribe((Response)=>{
      console.log(Response,'records added');
    });

    const approvall = {
        apply:{
            approval:approval,
            date_to:date_to,
            date_from:date_from,
            reason:reason,
            type:type,
        }
    }
    this.crudHttpService.patchEmployee(idd,approvall).subscribe((Response)=>{
          this.approval_list.pop();
          console.log(Response,'result updated');
    });


  }



createEvent(){
  console.log('eventForm',this.validateForm.value)
  this.dateEv = this.datepipe.transform((this.validateForm.value.date_from), 'MMMM d, y');
  this.timeEv = this.datepipe.transform((this.validateForm.value.timePicker), 'h:mm: a');
  let event={
    eventtype:this.validateForm.value.eventType,
    date:this.dateEv,
    time:this.timeEv,
    description:this.validateForm.value.description
  }
      this.crudHttpService.addevent(event).subscribe((response)=> {
        console.log('submit',this.validateForm.value)
        this.validateForm.reset();
        this.eventList();
    }, err=>{
      this.validateForm.reset()
    });
}



  constructor(private fb: FormBuilder,private modal: NzModalService,public datepipe: DatePipe,private _http:HttpClient,  private router:Router, private crudHttpService: CrudHttpService) {
    defineElement(lottie.loadAnimation)
    this.validateForm = this.fb.group({
      eventType: ['', [Validators.required]],
      date_from: ['', [Validators.required]],
      timePicker: [null],
      description: ['', [Validators.required]]

    });

    let currentDateTime =this.datepipe.transform((new Date), 'MMMM d, y');
    this.date =  currentDateTime;
    console.log(currentDateTime);
    setInterval(() => {
      this.currentTimee = new Date();
    }, 1000);



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



  userList(){
    this.crudHttpService.userlist().subscribe((Response)=>{

      console.log(Response);

        this.employee_list = Object.values(Response);

        const data =  Object.values(this.employee_list);

        data.forEach((employee)=>{
            if (employee.apply.approval === 'pending'){
                this.employee_list_final.push(employee);
                console.log('final---',this.employee_list_final);
            }


        })


       this.keyCountuser = Object.keys(Response).length;
    },(error=>{


    }));

  }

  updateEditCache(): void {
    this.employee_list.forEach(item => {
      this.editCache[item.id] = {
        data: { ...item }
      };
    });
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
               this.updateEditCache();
           }else if (employee.apply.approval === 'approved'){
            this.calapproved.push(employee);
            console.log('calendar_approved',this.calapproved);
           }
           if (employee.attendance === 'new Employee'){
            this.employee_list_new.push(employee)
           }
       })
       this.new_employee_count =  Object.keys(this.employee_list_new).length;
       this.pending_count = Object.keys(this.employee_list_final).length;
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
              // if (attendance.attendees.fname === 'present'){
              //   console.log('attendancewwwww',attendance);
              //   this.present.push(attendance);
              // }
              if (attendance.attendance === 'present' ){
                console.log('attendancewwwww',this.date);
                console.log('attendancewwwww',attendance);
                this.present.push(attendance);
              }
              if(attendance.attendance === 'present' && attendance.date === this.date){
                console.log('present now',this.date);
                console.log('present_now',attendance);
                this.list_nowpresent.push(attendance);
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
                this.list_nowpresent.push(attendance);
                this.lateNow.push(attendance);

              }


            });



            this.dateEq = this.datepipe.transform((new Date), 'MMMM d, y');
            let q = this.list_nowpresent
              q.forEach((data) => {
                     if (data.date === this.dateEq){
                      const item =
                      {
                      name:data.attendees.fname,
                      time:data.attendees.time_in,
                      description:'time in'
                      }
                      this.timeline_item.push(item);
                    }



              });


          // this.timeline_item.push(item);

            console.log('00000000000000000000000',this.list_nowpresent);

        // console.log('item',item)
        console.log('Timeline item',this.timeline_item)

        this.present_count = Object.keys(this.presentNow).length;
        this.absent_count = Object.keys(this.absentNow).length;
        this.late_count = Object.keys(this.lateNow).length;
        // this.leave_count = Object.keys(this.leave).length;
        console.log('',data.values());

       console.log('attendance',this.present_count);


      //  console.log('data',data);


    },(error=>{


    }));


  }


  ngOnInit(): void {
    // this.userList();
    this.employeeList();
    this.attaendanceCount()
    this.eventList();
  }
  eventList() {

    this.crudHttpService.eventlist().subscribe((Response)=>{

      this.eventlist = Object.values(Response)
      console.log('EventList',this.eventlist);
      this.dateEq = this.datepipe.transform((new Date), 'MMMM d, y');

      let q = this.eventlist
      q.forEach((data) => {
        if (data.date === this.dateEq){
          const item =
          {
          name:data.eventtype,
          time:data.time,
          description:data.description,
          }
          this.timeline_item.push(item);
        }

      });
      console.log('Timeline item',)
      this.sortAscending()
      this.updateEditCachee();
    })



  }

  // sortAscending(array: timeline[]): timeline[] {
  //   return array.sort((a, b) => a.time.getTime() - b.date.getTime());
  // }
  // sortAscending(array: timeline[], property: string): timeline[] {
  //   return array.sort((a, b) => a.time.localeCompare(b.time));
  // }
  sortAscending(){
    this.timeline_item.sort((a, b) => a.time.localeCompare(b.time));
    console.log(this.timeline_item,"===================");
  }
  // const item =this.timeline_item


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
    date_approval:string;

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
  date_join:string;
  apply:{
    type:string;
    date_to:string;
    date_from:string;
    reason:string;
    approval:string;
    date_approval:string;

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
  image: string;
  date_join:string;
  apply:{
    type:string;
    date_to:string;
    date_from:string;
    reason:string;
    approval:string;
    date_approval:string;

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
  date_join:string;
  apply:{
    type:string;
    date_to:string;
    date_from:string;
    reason:string;
    approval:string;
    date_approval:string;

  }

}


interface applyrecords{
  id:number;
  fname: string;
  mname: string;
  lname: string;
  position: string;
  department: string;
  apply:{
    type:string;
    date_to:string;
    date_from:string;
    reason:string;
    approval:string;
    date_approval:string;

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
    date_approval:string;

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

interface now_present_list {
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
interface now_absent_list {
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
interface now_late_list {
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
// interface leave_list {
//   currentDateTime: any;
//   id:number;
//   date:string;
//   attendance: string;
//   attendees:{
//     id:number;
//     fname: string;
//     mname: string;
//     lname: string;
//     position: string;
//     department: string;
//     time_in:string;
//     time_out:string;
//   }
// }

interface timeline{
  // currentDateTime:string
  // id:number;
  // date:string;
  // attendees:
  // {
    name:string;
    time:string;
    description:string;
  // }

}
interface presentNow_list {
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


interface EmployeeList_new {
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
    date_approval:string;

  },


}
