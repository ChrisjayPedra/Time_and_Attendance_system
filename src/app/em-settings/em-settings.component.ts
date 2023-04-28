import { CrudHttpService } from './../crud-http-service.service';
import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TimeInOutComponent } from '../time-in-out/time-in-out.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-em-settings',
  templateUrl: './em-settings.component.html',
  styleUrls: ['./em-settings.component.css']
})
export class EmSettingsComponent {
  currentTimee: Date | undefined;
  isVisible = false;
  user_id: any;
user_info: userInfo[]=[];
user_info_final: userInfo_final[]=[];
editCache: { [key: number]: { edit: boolean; data: userInfo_final } } = {};
isVisiblee = false;


uploading = false;
  selectedFile!: File;
  imagedata!: any;


  maxFileSize = 1000000; // 1kB



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


submit(){
  const  [{id,userName,password,accessType,fname,mname,lname,email,number,position,department,image,attendance,date_join,apply:{type,date_to,date_from,reason,approval}}] = Object.values(this.user_info_final)
  console.log('userinfor',this.user_info_final)

  if (this.imagedata == null || this.imagedata.length == 0 || this.imagedata =='') {
    this.imagedata = image;
  }
  console.log('theimage data',this.imagedata)

    let employee = {
      userName: userName,
      fname:fname,
      mname:mname,
      lname:lname,
      number:number,
      position:position,
      department:department,
      email:email,
      password:password,
      attendance:attendance,
      accessType:accessType,
      image:this.imagedata,
      date_join:date_join,
      apply:{
        type:type,
        date_to:date_to,
        date_from:date_from,
        reason:reason,
        approval:approval,
      }
    }
    console.log('employee',employee)
    this.crudHttpService.updateEmployee(id,employee).subscribe((response)=> {
      this.time_in_out.ngOnInit();
      this.updateNotif();
      this.router.navigate(['/time_in_out/in_out'])
      }, err=>{

        this.message.create('error','Something went wrong');

      });


  }


changeProfile(){
  this.isVisiblee = true;
}



handleCancell(): void {
  console.log('Clicked Cancel');
  this.isVisiblee = false;
}


  constructor(private router:Router,private time_in_out:TimeInOutComponent,private message:NzMessageService,private notification:NzNotificationService,public datepipe: DatePipe,private modal:NzModalService,private user: UserServiceService,private crudHttpService:CrudHttpService){

    let currentDateTime =this.datepipe.transform((new Date), 'MMMM d, y');
    console.log(currentDateTime);
    setInterval(() => {
      this.currentTimee = new Date();
    }, 1000);



  }

  editProfile() {
    // Show a modal or navigate to the edit profile page
    this.isVisible = true;
    console.log('Edit button clicked');
  }
  handleCancel(): void {
    console.log('Clicked Cancel');
    this.isVisible = false;
  }

  ngOnInit(): void {
    this.user_id = this.user.getUser()
    console.log('id',this.user_id);
    this.crudHttpService.employeelist().subscribe((Response) => {
        this.user_info = Object.values(Response)
        const data = Object.values(this.user_info)
        data.forEach((item) => {
          if (item.id === this.user_id){
              this.user_info_final.push(item)
              this.updateEditCache()
              console.log('USer Information', this.user_info_final)
          }
        })
    })
  }



  startEdit(id: number): void {
    this.editCache[id].edit = true;
   console.log('edit', this.editCache[id])
  }


  cancelEdit(id: number): void {
    const index = this.user_info_final.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.user_info_final[index] },
      edit: false
    };
  }

  saveUser(id: number): void {
    const index = this.user_info_final.findIndex(item => item.id === id);
    Object.assign(this.user_info_final[index], this.editCache[id].data);



        this.crudHttpService.updateEmployee(id,this.editCache[id].data).subscribe((response)=>{
           this.updateNotif();
          // this.employeeList();
              },(error=>{

        }));


    this.editCache[id].edit = false;
  }

  updateNotif(): void {
    this.notification.create(
      'success',
      'Successful',
      'Update Employee complete',
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





  updateEditCache(): void {
    this.user_info_final.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
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

interface userInfo_final{

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
