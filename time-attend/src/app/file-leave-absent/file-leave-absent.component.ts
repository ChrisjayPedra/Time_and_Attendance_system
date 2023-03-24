import { CrudHttpService } from './../crud-http-service.service';
import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, ValidationErrors, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-file-leave-absent',
  templateUrl: './file-leave-absent.component.html',
  styleUrls: ['./file-leave-absent.component.css']
})
export class FileLeaveAbsentComponent implements OnInit {

  open_card = true;
  open_result_pending = false;
  open_result_approved = false;
  open_result_declined = false;
  open_result_ongoing = false;
  open_result_ended = false;
  validateForm!: FormGroup;
  radioValue = 'A';
  date_to: any | null;
  date_from: any | null;

  searchDate: any;
  confirmModal?: NzModalRef;
  user_id: any;

  user_info: userInfo[]=[];

  user_info_update: userInfo_update[]=[];
  user_name!: any;

  currentDateTime:any|null;
  date: any | null;
  time: any | null;

  constructor(public datepipe: DatePipe,private modal:NzModalService,private user: UserServiceService,private crudHttpService:CrudHttpService, private fb: FormBuilder){

    this.currentDateTime =this.datepipe.transform((new Date), 'MMMM d, y h:mm:ss a');
    this.date =this.datepipe.transform((new Date), 'MMMM d, y');
    this.time =this.datepipe.transform((new Date), 'h:mm a');


    this.validateForm = this.fb.group({
      applyType: ['', [Validators.required]],
      date_from: ['', [Validators.required]],
      date_to: ['', [Validators.required]],
      reason: ['', [Validators.required]]

    });


  }
  submitForm(){

     const  [{id,userName,password,accessType,fname,mname,lname,email,number,position,department,attendance}] = Object.values(this.user_info_update)
    console.log('apply id',id,userName,password,accessType,fname,mname,lname,email,number,position,department,attendance)

     this.date_from = this.datepipe.transform((this.validateForm.value.date_from), 'MMMM d, y');
     this.date_to = this.datepipe.transform((this.validateForm.value.date_to), 'MMMM d, y');

    const employee = {
      userName: userName,
      fname: fname,
      mname: mname,
      lname: lname,
      email: email,
      number: number,
      position: position,
      department: department,
      password: password,
      attendance: attendance,
      accessType: accessType,
      id:id,
      apply:{
        type:this.validateForm.value.applyType,
        date_to:this.date_to,
        date_from:this.date_from,
        reason:this.validateForm.value.reason,
        approval:'pending'
      }
    }
    console.log('apply Employeee',employee)

    this.crudHttpService.updateEmployee(this.user_id,employee).subscribe((response)=> {

      this.open_card = false;
      this.open_result_pending = true;

      }, err=>{

        this.validateForm.reset()
      });


  }



  declined_ended(){

   const  [{id,userName,password,accessType,fname,mname,lname,email,number,position,department,attendance}] = Object.values(this.user_info_update)
   console.log('apply id',id,userName,password,accessType,fname,mname,lname,email,number,position,department,attendance)

    // this.date_from = this.datepipe.transform((this.validateForm.value.date_from), 'MMMM d, y');
    // this.date_to = this.datepipe.transform((this.validateForm.value.date_to), 'MMMM d, y');

   const employee = {
     userName: userName,
     fname: fname,
     mname: mname,
     lname: lname,
     email: email,
     number: number,
     position: position,
     department: department,
     password: password,
     attendance: attendance,
     accessType: accessType,
     id:id,
     apply:{
       type:'',
       date_to:'',
       date_from:'',
       reason:'',
       approval:''
     }
   }
   console.log('apply Employeee',employee)

   this.crudHttpService.updateEmployee(this.user_id,employee).subscribe((response)=> {

     this.open_card = true;
     this.open_result_pending = false;
     this.open_result_approved = false;
     this.open_result_declined = false;
     this.open_result_ongoing = false;
     this.open_result_ended = false;
     }, err=>{

       this.validateForm.reset()
     });


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










  ngOnInit(): void {

    this.crudHttpService.employeelist().subscribe((Response) => {
      this.user_info = Object.values(Response);

      console.log('user_info',this.user_info);
      const [userName] = Object.values(this.user_info);
      this.user_name = userName;
      const data = Object.values(this.user_info)


      data.forEach((employee) => {
        if (employee.id === this.user_id){
          if (employee.apply.approval === 'pending'){
            console.log('Apply leave Currently Pending');
            this.open_card = false;
            this.open_result_pending = true;

          }else if (employee.apply.approval === 'approved'){
            this.open_card = false;
            this.open_result_approved = true;
            console.log('Apply leave Currently approved');

            if ( this.date > employee.apply.date_from ){
              this.open_card = false;
              this.open_result_approved = false;
              this.open_result_ongoing = true;
              console.log('this date current date',this.date);
              console.log('this date start',employee.apply.date_from);
              console.log('Apply leave Currently ongoing');
              if (this.date < employee.apply.date_to){
                this.open_card = false;
                this.open_result_ongoing = true;
                this.open_result_approved = false;
                console.log('Apply leave Currently ongoing');
              }else{
                this.open_result_ended = true;
                this.open_result_approved = false;
                this.open_result_ongoing = false;
                console.log('Apply leave Currently Ended');

              }

            }else{
              this.open_result_approved = true;
              console.log('Apply leave Currently not starting');
            }


            // else if (employee.apply.date_to === this.date){
            //   this.open_card = false;
            //   this.open_result_ongoing = true;
            //   console.log('Apply leave Currently ongoing');

            // }
          }else if (employee.apply.approval === 'declined'){
            this.open_card = false;
            this.open_result_declined = true;
            console.log('Apply leave Currently declined');


          }
        }



    })

      console.log('username',userName);
  });

   this.user_id = this.user.getUser()
   this.User_();
   console.log('id',this.user_id);
   }



   User_() {
    this.crudHttpService.employeelist().subscribe((Response) => {
        this.user_info = Object.values(Response);

        console.log('user_info',this.user_info);
        const [userName] = Object.values(this.user_info);
        this.user_name = userName;
        const data = Object.values(this.user_info)


        data.forEach((employee) => {
          if (employee.id === this.user_id){
            this. user_info_update.push(employee)
            console.log('user_info_final',this.user_info_update);
          }



      })

        console.log('username',userName);
    });
  }


  apply_leave(){

    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete these items?',
      nzContent: 'Your Name'+this.user_name,
      nzOnOk: () =>

        new Promise((resolve, reject) => {
          this.submitForm();
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);

        }).catch((error) => console.log('Oops errors!',error))
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

interface userInfo_update{

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

