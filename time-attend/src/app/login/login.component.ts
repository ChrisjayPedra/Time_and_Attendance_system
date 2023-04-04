import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CrudHttpService } from '../crud-http-service.service';
import { UserServiceService } from '../user-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class
LoginComponent {
  passwordVisible = false;
  password?: string;
  validateForm!: FormGroup;

  submitForm() {
    for (const i in this.validateForm.controls){
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this._http.get<any>("http://localhost:3000/employee")
    .subscribe(res=>{
      const admin = res.find((a:any)=>{
        return a.userName === this.validateForm.value.userName && a.password === this.validateForm.value.password && a.accessType === 'admin'

      });
      const user = res.find((a:any)=>{
        this.User.setUserid(a.id);
        this.User.setImage(a.image);
        return a.userName === this.validateForm.value.userName && a.password === this.validateForm.value.password && a.accessType === 'employee'

      });

      if(user){
        alert('you are successfully login');
        this.router.navigate(['/time_in_out/in_out'])
        this.validateForm.reset();

      }else if (admin){
        alert('you are successfully login');
        this.router.navigate(['/home/dashboard'])
        this.validateForm.reset();
      }
      else{
        this._http.get<any>("http://localhost:3000/user")
        .subscribe(res=>{
          const admin = res.find((a:any)=>{
            return a.userName === this.validateForm.value.userName && a.password === this.validateForm.value.password && a.accessType === 'admin'

          });
          if (admin){
            alert('you are successfully login');
            this.router.navigate(['/home/dashboard'])
            this.validateForm.reset();
          }
          else{

              alert('Please Check your Username and Password');
             this.validateForm.reset();
          }

        }, err=>{
          alert('Something was wrong');
        })
      }

    }, err=>{
      alert('Something was wrong');
    })



  }



  constructor(private User:UserServiceService,private crudHttpService:CrudHttpService,private message:NzMessageService,private fb: FormBuilder, private _http:HttpClient,private router:Router) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [false]
    });
  }
}
