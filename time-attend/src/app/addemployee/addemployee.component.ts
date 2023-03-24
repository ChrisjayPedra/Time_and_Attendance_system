import { EmployeeListComponent } from './../employee-list/employee-list.component';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, Observable, Observer } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CrudHttpService } from '../crud-http-service.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-addemployee',
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.css']
})
export class AddemployeeComponent {

  uploading = false;
  selectedFile!: File;

  validateForm!: FormGroup;
  passwordVisible = false;
  password?: string;



 addemployeeNotif(): void {
    this.notification.create(
      'success',
      'Successful',
      'Adding new user complete',
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



 submitForm(){

    const employee = {
      userName: this.validateForm.value.userName,
      fname:this.validateForm.value.fname,
      mname:this.validateForm.value.mname,
      lname:this.validateForm.value.lname,
      number:this.validateForm.value.number,
      position:this.validateForm.value.position,
      department:this.validateForm.value.department,
      email:this.validateForm.value.email,
      password:this.validateForm.value.password,
      attendance:'new Employee',
      accessType:this.validateForm.value.accessType,
      apply:{
        type:'',
        date_to:'',
        date_from:'',
        reason:'',
        approval:'',
      },

    }
    this.crudHttpService.addEmployee(employee).subscribe((response)=> {
          console.log('submit',this.validateForm.value)
          console.log('submit',employee)
          this.validateForm.reset();
          this.addemployeeNotif();
          this.uploading = false;
          this.employeeList.employeeList();
          this.router.navigate(['/home/employeelist'])
      }, err=>{
        this.uploading = false;
        this.message.create('error','Something went wrong');
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
  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls['confirm'].updateValueAndValidity());
  }

  userNameAsyncValidator = (control: FormControl) =>


  new Observable((observer: Observer<ValidationErrors | null>) => {

      this.crudHttpService.employeelist().subscribe((Response)=>{

        setTimeout(() => {
          Response.find((a:any)=>{

              if (control.value === a.userName) {
                console.log('control.value',control.value);
                console.log('a.userName',a.userName);

                 observer.next({ error: true, duplicated: true });
                observer.complete();
              } else {
                observer.next(null);
              }


          })
        observer.complete();
        }, 1000);


      }, err=>{
        this.message.create('error','Something went wrong');
        this.validateForm.reset()
      });


  });



  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };




  constructor(private message:NzMessageService ,private employeeList:EmployeeListComponent,private notification: NzNotificationService, private crudHttpService: CrudHttpService, private fb: FormBuilder, private _http:HttpClient, private router:Router) {

    this.validateForm = this.fb.group({
      userName: ['', [Validators.required], [this.userNameAsyncValidator]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required,Validators.minLength]],
      fname: ['', [Validators.required]],
      mname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      number: ['', [Validators.required]],
      position: ['', [Validators.required]],
      department: ['', [Validators.required]],
      accessType: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]],
    });

  }



}



