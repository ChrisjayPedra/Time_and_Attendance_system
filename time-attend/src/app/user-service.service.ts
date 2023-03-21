import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  message!: any;
  data_data: any[] = [];

  constructor() {

  }
  setUserid(data: any){
    this.message = data
  }
  getUser(){
    return this.message
  }
}

