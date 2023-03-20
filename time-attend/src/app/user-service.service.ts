import { Injectable } from '@angular/core';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  message!: any;



  constructor() {

  }
  setUserid(data: any){
    this.message = data
  }
  getUser(){
    return this.message
  }
}
