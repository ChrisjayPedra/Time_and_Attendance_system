import { Component, OnInit  ,ViewChild, ElementRef  } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { CrudHttpService } from '../crud-http-service.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserServiceService } from '../user-service.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelExport } from '@syncfusion/ej2-angular-schedule';
import { parseFile } from 'cron-parser';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { Papa } from 'ngx-papaparse';
import { DatePipe } from '@angular/common';
import { GoogleAuth } from 'google-auth-library';
// import { Gmail } from 'googleapis';
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  // private auth: GoogleAuth;
  // private gmail: Gmail;

  employee_count:any;
  new_employee_count:any;
  dateEx:any;
  timeEx:any;
  size: NzButtonSize = 'large';
  searchValue = '';
  visible = false;
  pignation = true;
  expandSet = new Set<number>();
  isCollapsed = true;
  editCache: { [key: number]: { edit: boolean; data: EmployeeList } } = {};
  employee_list: EmployeeList[] = [];
  employee_list_new: EmployeeList_new[] = [];
  employee_details: Employeedetails[] = [];
  employee_export: Employeeexport[] = [];
//export table

exportTableToExcel():void {
  console.log('Download');
  const downloadLink = document.createElement('a');
  // const dataType = 'text/csv';
   const dataType = 'application/vnd.ms-excel';
  const table = document.getElementById('employeeList_sheet');
  const tableHtml = table?.outerHTML.replace(/ /g, '%20');
  document.body.appendChild(downloadLink);
  downloadLink.href = 'data:'+ dataType + ' ' + tableHtml;
  downloadLink.download = 'employeeList_sheet.xls';
  downloadLink.click();
  console.log('Download');

}


onExpandChange(id: number, checked: boolean): void {
  if (checked) {
    this.expandSet.add(id);
  } else {
    this.expandSet.delete(id);
  }
}


 generateCSV() {
  // Get the table element
  const table = document.getElementById('employeeList_sheet');

  // Get all rows from table
  const rows = table!.querySelectorAll('tr');

  // Set the table headers

  const headers = ['','DATE EMPLOYMENT','FIRST NAME', 'MIDDLE NAME', 'LAST NAME', 'USERNAME', 'PASSWORD', 'EMAIL', 'NUMBER', 'POSITION', 'DEPARTMENT', 'STATUS', 'ROLE','CURRENT LEAVE APPLY'];

  // Create a new array to hold the table data
  const data = [];

  // Loop through each row and extract the cell data
  for (let i = 1; i < rows.length; i++) {
    const row = [];
    const cells = rows[i].querySelectorAll('td');
    for (let j = 0; j < cells.length; j++) {
      row.push(cells[j].textContent);
    }
    data.push(row);
  }


  const sanitizedData = data.map(row => row.map(val => val === null ? '' : val));

  this.dateEx =this.datepipe.transform((new Date), 'MMMM d, y');
  this.timeEx =this.datepipe.transform((new Date), 'hh:mm a');

  var export_date = this.papa.unparse({
    "fields": ["Export Date and Time : ",this.dateEx ,this.timeEx],
    "data": [

    ]
  });

  var title = this.papa.unparse({
    "fields": ["Employee Record List","        ","        ","        ","        ","        ","        ","        ","        ","        ","New Employee : ",this.new_employee_count,"Total Current Employee : ",this.employee_count],
    "data": [

    ]
  });

  var admin_name = this.papa.unparse({
    "fields": ["Generated by : ", this.user.getUserName()],
    "data": [

    ]
  });

  // Convert the data array to a CSV string using Papa Parse
  const csvString = this.papa.unparse(

    {

    fields: headers,
    data: sanitizedData,

  });

  // Create a new blob with the CSV string and set the content type to CSV
  const blob = new Blob([export_date,'\n',title,'\n',csvString,'\n\n\n',admin_name], {type: 'text/csv'});

  // Create a link element to download the CSV file
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Employee Record.csv';
  document.body.appendChild(link);

  // Click the link element to download the CSV file
  link.click();

  // Remove the link element from the DOM
  document.body.removeChild(link);
}



generatePDF() {


  // Create a new jsPDF document with landscape orientation and millimeters as units
  const doc = new jsPDF('l', 'mm', [330, 210]);

  // Add a title to the document
  doc.setFontSize(16);
  doc.text("Employee List", 10, 10);

  // Get the table element
  const table = document.getElementById('employeeList_sheet');




  const table2Data = [
    []

  ];
  this.dateEx =this.datepipe.transform((new Date), 'MMMM d, y');
  this.timeEx =this.datepipe.transform((new Date), 'hh:mm a');

  const empCount = ["Total Employee : ",this.employee_count];
  const NewempCount = ["New Employee : ",this.new_employee_count];
  const headers2 = ['Generated by :', this.user.getUserName()];
  const date = ["Export Date and Time : ",this.dateEx +' '+this.timeEx];


  const tableWidth2 = 100;
  const columnWidths2 = [20, 20, 20];
  const tableHeight2 = table2Data.length * 10;


  (doc as any).autoTable({
    head: '',
    body: [NewempCount,empCount,headers2,date],
    startY: 20 ,
    tableWidth: tableWidth2,
    columnWidth: columnWidths2,
    height: tableHeight2
  });








  // Get all rows from table
  const rows = table!.querySelectorAll('tr');

  // Set the table headers
  const headers = ['','Date Employment','First Name', 'Middle Name', 'Last Name', 'Username', 'Password', 'Email', 'Number', 'Position', 'Department','Status','Role'];

  // Create a new array to hold the table data
  const data = [];

  // Loop through each row and extract the cell data
  for (let i = 1; i < rows.length; i++) {
    const row = [];
    const cells = rows[i].querySelectorAll('td');
    for (let j = 0; j < cells.length; j++) {
      row.push(cells[j].textContent);
    }
    data.push(row);
  }

  // Set the table width and column widths
  const tableWidth = 300;
  const columnWidths = [10, 30, 30, 30, 25, 25, 40, 25, 25, 30, 20, 25];

  // Calculate the table height based on the number of rows
  const tableHeight = data.length * 10;

  // Add the table to the PDF using the autoTable plugin
  (doc as any).autoTable({
    head: [headers],
    body: data,
    startY: 55,
    tableWidth: tableWidth,
    columnWidth: columnWidths,
    height: tableHeight
  });





  // Save the PDF
  doc.save('Employee Record.pdf');
}



  //notification
  deleteNotif(): void {
    this.notification.create(
      'success',
      'Successful',
      'Delete employee complete',
      {

        nzStyle: {
          width: '600px',
          marginLeft: '-265px',
          backgroundColor:'rgba(241, 255, 246, 0.900)',
        },
        nzClass: 'notification',

      }

    );
  }
  updateNotif(): void {
    this.notification.create(
      'success',
      'Successful',
      'Update employee complete',
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




  getemployee(id: number){
    // this.editCache[id].edit = true;
    console.log('edit', this.editCache[id])
    this.user.employee_details.pop();
    this.user.setdetails(this.editCache[id].data)
      // this.employee_details.push(this.editCache[id].data)
      // console.log('employee', this.employee_details);

      console.log('data userserveice',this.user.getdetails());
      this.router.navigate(['/home/emdetails/'])
  }


  //update User
 startEdit(id: number): void {
    this.editCache[id].edit = true;
   console.log('edit', this.editCache[id])
  }

  cancelEdit(id: number): void {
    const index = this.employee_list.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.employee_list[index] },
      edit: false
    };
  }

  saveUser(id: number): void {
    const index = this.employee_list.findIndex(item => item.id === id);
    Object.assign(this.employee_list[index], this.editCache[id].data);



        this.crudHttpService.updateEmployee(id,this.editCache[id].data).subscribe((response)=>{
          this.updateNotif();
          this.employeeList();
              },(error=>{

        }));

    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.employee_list.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }





  ngOnInit(): void {
    this.employeeList();
    this.search();

  }

  //get all employee
  employeeList(){
    this.crudHttpService.employeelist().subscribe((Response)=>{
      console.log('Response');
      console.log(Response);
      this.employee_list = Object.values(Response);
      this.employee_count =  Object.keys(Response).length;
        const data = this.employee_list

        data.forEach((new_employee) => {

          if (new_employee.attendance === 'new Employee'){
              this.employee_list_new.push(new_employee)
          }

        })
        this.new_employee_count =  Object.keys(this.employee_list_new).length;

      this.updateEditCache();
      },(error=>{

      }));

  }




//delete user

  deleteEmployee(employee: any){
    this.crudHttpService.deleteEmployee(employee).subscribe((response)=>{
      this.deleteNotif();
      this.employeeList();
    },(error=>{
    }));
  }





//search user
  reset(): void {
    this.searchValue = '';
    this.employeeList();
  }



  search(): void {

      this.visible = false;
      this.employee_list = this.employee_list.filter((item: EmployeeList) => item.fname.indexOf(this.searchValue) !== -1);
      console.log('employee',this.employee_list);
      console.log('employee_list lenght',Object.values(this.employee_list).length)
      this.searchValue = '';

  }

  constructor(private datepipe: DatePipe,private papa: Papa,private user:UserServiceService,private notification:NzNotificationService,private _http:HttpClient, private crudHttpService: CrudHttpService, private router:Router) {}




}

interface EmployeeList {
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
        date_approval:string;

      },


}

interface EmployeeList_new {
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
    date_approval:string;

  },


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
   date_approval:string;
  },


}

interface Employeeexport{
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
  image: string;
  date_join:string;
  apply:{
    type:string;
    date_to:string;
    date_from:string;
    reason:string;
    approval:string;
    date_approval:string;
  },
}
