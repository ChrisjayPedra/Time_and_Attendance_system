
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CrudHttpService } from '../crud-http-service.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {


  validateForm!: FormGroup;
  passwordVisible = false;
  password?: string;

  uploading = false;
  selectedFile!: File;
  imagedata!: any;


  maxFileSize = 100000; // 1kB
  dateEx: any;


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


  onFileSelected(event:any){
    console.log('event',event)
    this.selectedFile = <File> event.target.files[0];
    console.log('asasasas',this.selectedFile)
    this.onUpload()
}
onUpload() {
  if (this.selectedFile && this.selectedFile.size <= this.maxFileSize) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 1024;
        const maxHeight = 1024;
        let width = image.width;
        let height = image.height;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx!.drawImage(image, 0, 0, width, height);
        const compressedImage = canvas.toDataURL('image/jpeg', 0.8);
        this.uploadImage(compressedImage);
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }else{
    this.message.create('error','File to large');
  }

}

uploadImage(dataUrl: string) {
  const imageData = { data: dataUrl };
  this.imagedata = dataUrl
    console.log(this.imagedata,'imageData');
}




 submitForm(){

  if (this.imagedata == null || this.imagedata.length == 0 || this.imagedata =='') {
    this.imagedata = '';
  }
  this.dateEx =this.datepipe.transform((new Date), 'MMMM d, y');


    let employee = {
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
      accessType:'employee',
      image:this.imagedata,
      date_join:this.dateEx,
      apply:{
        type:'',
        date_to:'',
        date_from:'',
        reason:'',
        approval:'',
      }
    }
    this.crudHttpService.addEmployee(employee).subscribe((response)=> {
          console.log('submit',this.validateForm.value)
          this.validateForm.reset();
          this.router.navigate([''])
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




  constructor(private datepipe:DatePipe,private message:NzMessageService ,private notification: NzNotificationService, private crudHttpService: CrudHttpService, private fb: FormBuilder, private _http:HttpClient, private router:Router) {

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
      confirm: ['', [this.confirmValidator]],
    });

  }



}




