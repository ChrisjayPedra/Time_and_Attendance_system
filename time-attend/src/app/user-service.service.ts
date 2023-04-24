import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  message!: any;
  data_data: any[] = [];
image_data!:any;
username!: string

employee_details: Employeedetails[] = [];

  constructor() {

  }
  setUserid(data: any){
    this.message = data
  }
  getUser(){
    return this.message
  }
  setImage(image: any) {
    this.image_data = image;
  }
  setUserName(data: any) {
    console.log(data,"datdatdatda");
    this.username = data;
    }
  getImage(){
    return this.image_data
  }
  getdetails(){
    return this.employee_details;
  }
  setdetails(data:any){
    console.log(data,"datdatdatda");
    this.employee_details.push(data);
  }


  getUserName() {
    return this.username;
   }
}

interface Employeedetails{
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
  },


}
