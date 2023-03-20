import { CrudHttpService } from './../crud-http-service.service';
import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service';
@Component({
  selector: 'app-time-in-out',
  templateUrl: './time-in-out.component.html',
  styleUrls: ['./time-in-out.component.css']
})
export class TimeInOutComponent implements OnInit {
  user_info: userInfo[]=[];
  user_id!: any;
  user_name!: any;
  isCollapsed = true;
constructor(private user: UserServiceService,private crudHttpService:CrudHttpService){

}
  ngOnInit(): void {
   this.user_id = this.user.getUser()
   this.User_();
   console.log('id',this.user_id);
  }
  User_() {
    this.crudHttpService.getEmployeeID(this.user_id).subscribe((Response) => {

        this.user_info = Object.values(Response);
        console.log('user_info',this.user_info);
        const [userName] = Object.values(this.user_info);
        this.user_name = userName;
        console.log('username',userName);
    });
  }

  time_in(){

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


}
