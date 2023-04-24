import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudHttpService {
  apiUrluser: string = 'http://localhost:3000/user';
  apiUrlemployee: string = 'http://localhost:3000/employee';
  apiUrlattendace: string = 'http://localhost:3000/individual_attendance';
  apiUrlevents: string = 'http://localhost:3000/events';
  apiUrlapplyrecords: string = 'http://localhost:3000/apply_leave_records';



  headers = new HttpHeaders().set('Content-type', 'application/json');



  constructor(private http:HttpClient) { }

// applyleave_records

 recordlist():  Observable<any>  {
    return this.http.get(this.apiUrlapplyrecords);
  }

  addrecord(data:any): Observable<any> {

    let url = this.apiUrlapplyrecords;

    return this.http.post(url, data).pipe( catchError(this.handleError) );
  }

  updaterecord(id:any, data:any){

    let url = `${this.apiUrlapplyrecords}/${id}`;

    return this.http.put(url, data).pipe( catchError(this.handleError))

  }
  deleterecord(id:any): Observable<any>{

    let url = `${this.apiUrlapplyrecords}/${id}`;

    return this.http.delete(url).pipe( catchError(this.handleError))

  }


//user list

  userlist():  Observable<any>  {
    return this.http.get(this.apiUrluser);
  }

  addUser(data:any): Observable<any> {

    let url = this.apiUrluser;

    return this.http.post(url, data).pipe( catchError(this.handleError) );
  }

  updateUser(id:any, data:any){

    let url = `${this.apiUrluser}/${id}`;

    return this.http.put(url, data).pipe( catchError(this.handleError))

  }
  deleteUser(id:any): Observable<any>{

    let url = `${this.apiUrluser}/${id}`;

    return this.http.delete(url).pipe( catchError(this.handleError))

  }




//Employee


employeelist():  Observable<any>{
  return this.http.get(this.apiUrlemployee);
}

addEmployee(data:any): Observable<any> {

  let url = this.apiUrlemployee;

  return this.http.post(url, data).pipe( catchError(this.handleError) );
}

updateEmployee(id:any, data:any){

  let url = `${this.apiUrlemployee}/${id}`;

  return this.http.put(url, data).pipe( catchError(this.handleError))

}

patchEmployee(id:any, data:any){

  let url = `${this.apiUrlemployee}/${id}`;

  return this.http.patch(url, data).pipe( catchError(this.handleError))

}
deleteEmployee(id:any): Observable<any>{

  let url = `${this.apiUrlemployee}/${id}`;

  return this.http.delete(url).pipe( catchError(this.handleError))

}

getEmployeeID(id:any): Observable<any>{

    let url = `${this.apiUrlemployee}/${id}`;

    return this.http.get(url);
  }



//attendace list

attendancelist():  Observable<any>{
  return this.http.get(this.apiUrlattendace);
}

addattendace(data:any): Observable<any> {

  let url = this.apiUrlattendace;

  return this.http.post(url, data).pipe( catchError(this.handleError) );
}

updateattendance(id:any, data:any){

  let url = `${this.apiUrlattendace}/${id}`;

  return this.http.put(url, data).pipe( catchError(this.handleError))

}
deleteattendance(id:any): Observable<any>{

  let url = `${this.apiUrlattendace}/${id}`;

  return this.http.delete(url).pipe( catchError(this.handleError))

}

getAttendanceDateID(id:any){

    let url = `${this.apiUrlattendace}/${id}`;

    return this.http.get(url);
  }

//events

eventlist():  Observable<any>{
  return this.http.get(this.apiUrlevents);
}

addevent(data:any): Observable<any> {

  let url = this.apiUrlevents;

  return this.http.post(url, data).pipe( catchError(this.handleError) );
}

updateevent(id:any, data:any){

  let url = `${this.apiUrlevents}/${id}`;

  return this.http.put(url, data).pipe( catchError(this.handleError))

}
deleteevent(id:any): Observable<any>{

  let url = `${this.apiUrlevents}/${id}`;

  return this.http.delete(url).pipe( catchError(this.handleError))

}

geteventID(id:any){

    let url = `${this.apiUrlevents}/${id}`;

    return this.http.get(url);
  }




  handleError(error:HttpErrorResponse){
    if (error.error instanceof ErrorEvent){
      console.error("Error occurred", error.error.message);
    }
    else{
      console.error("Error occurred", error.error.message);
    }

    return throwError( 'Something bad happened please try again');


  };

}
