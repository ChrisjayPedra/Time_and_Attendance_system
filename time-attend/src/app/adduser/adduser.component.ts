import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CrudHttpService } from '../crud-http-service.service';
import { UserListComponent } from '../user-list/user-list.component';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent {



  validateForm!: FormGroup;
  passwordVisible = false;
  password?: string;



 addUserNotif(): void {
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
    let user = {
      userName: this.validateForm.value.userName,
      email:this.validateForm.value.email,
      password:this.validateForm.value.password,
      accessType:'admin',
      employeeName:this.validateForm.value.employeeName
    }
    this.crudHttpService.addUser(user).subscribe((response)=> {
          console.log('submit',this.validateForm.value)
          this.validateForm.reset();
          this.addUserNotif();
          this.userList.userList();
          this.router.navigate(['/home/userlist'])

      }, err=>{
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

      this.crudHttpService.userlist().subscribe((Response)=>{

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




  constructor(private message:NzMessageService ,private userList:UserListComponent,private notification: NzNotificationService, private crudHttpService: CrudHttpService, private fb: FormBuilder, private _http:HttpClient, private router:Router) {

    this.validateForm = this.fb.group({
      userName: ['', [Validators.required], [this.userNameAsyncValidator]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required,Validators.minLength]],
      employeeName: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]],

    });

  }



}
