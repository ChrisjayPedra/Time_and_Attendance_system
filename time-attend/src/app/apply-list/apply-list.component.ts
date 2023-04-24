import { EmployeeDetailsComponent } from './../employee-details/employee-details.component';
import { Component, OnInit  } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { CrudHttpService } from '../crud-http-service.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Papa } from 'ngx-papaparse'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserServiceService } from '../user-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-apply-list',
  templateUrl: './apply-list.component.html',
  styleUrls: ['./apply-list.component.css']
})
export class ApplyListComponent  implements  OnInit{
  size: NzButtonSize = 'large';
  searchValue = '';
  visible = false;
  date:any;

  isCollapsed = true;
  editCache: { [key: number]: { edit: boolean; data: applyrecords } } = {};
  // user_list: UsersList[] = [];
  // user_list_final: UsersList_final[] = [];
  // data_list: dataList[] = [];
  // admin_list: adminList[] = [];
  // admin_list2: adminList2[] = [];
  // admin_list_final: adminListFinal[] = [];
  apply_records : applyrecords[]=[];
  approved_list : approvedlist[]=[];
  pending_list : pendinglist[]=[];
  declined_list : declinedlist[]=[];
  dateEx: any;
  timeEx: any;

//export table

exportTableToExcel():void {

  console.log('Download');
  const downloadLink = document.createElement('a');
  const dataType = 'application/vnd.ms-excel';
  const table = document.getElementById('userList_sheet');
  const tableHtml = table?.outerHTML.replace(/ /g, '%20');
  document.body.appendChild(downloadLink);
  downloadLink.href = 'data:'+ dataType + ' ' + tableHtml;
  downloadLink.download = 'Leave_record_sheet.xls';
  downloadLink.click();
  console.log('Download');

}



// generateXLSX() {
//   // Get the table element
//   const table = document.getElementById('userList_sheet');

//   // Get all rows from table
//   const rows = table!.querySelectorAll('tr');

//   // Set the table headers
//   // const title =['Employee List']
//   const headers = ['No.','FIRST NAME','MIDDLE NAME','LAST NAME', 'POSITION', 'DEPARTMENT', 'APPLY TYPE', 'DATE TO', 'DATE FROM','REASON','APPROVAL','DATE OF APPROVAL','DATE ACCEPTED'];

//   // Create a new array to hold the table data
//   const data = [];

//   // Loop through each row and extract the cell data
//   for (let i = 1; i < rows.length; i++) {
//     const row = [];
//     const cells = rows[i].querySelectorAll('td');
//     for (let j = 0; j < cells.length; j++) {
//       row.push(cells[j].textContent);
//     }
//     data.push(row);
//   }

//   // const sanitizedData = data.map(row => {
//   //   const sanitizedRow = {};
//   //   for (const [key, value] of Object.entries(row)) {
//   //     (sanitizedRow as any)[key] = value === null ? '' : value;

//   //   }
//   //   return sanitizedRow;
//   // });


//  const sanitizedData = data.map(row => row.map(val => val === null ? '' : val));



//   const worksheet = XLSX.utils.json_to_sheet(sanitizedData, {header: headers});
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee List');
//   XLSX.writeFile(workbook, 'employee_list.xlsx');


//   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx'});

//    const blob = new Blob([excelBuffer], {type: 'application/vnd.ms-excel'});

//   // const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//   saveAs(blob, 'employee_list.xlsx');


//   // // Convert the data array to a CSV string using Papa Parse
//   // const csvString = this.papa.unparse(

//   //   {

//   //   fields: headers,
//   //   data: sanitizedData,

//   // });

//   // // Create a new blob with the CSV string and set the content type to CSV
//   // const blob = new Blob([csvString], {type: 'application/vnd.ms-excel'});

//   // // Create a link element to download the CSV file
//   // const link = document.createElement('a');
//   // link.href = URL.createObjectURL(blob);
//   // link.download = 'Leave Record.xls';
//   // document.body.appendChild(link);

//   // // Click the link element to download the CSV file
//   // link.click();

//   // // Remove the link element from the DOM
//   // document.body.removeChild(link);
// }






// generateXLSX() {
//   // Get the table element
//   const table = document.getElementById('userList_sheet');

//   // Get all rows from table
//   const rows = table!.querySelectorAll('tr');
  // rows.forEach(cell => {
    // cell.style.color = 'red';
  //   cell.style.backgroundColor = 'rgb(197, 255, 205)';
  // });

//   // Set the table headers
//   // const title =['Employee List']
//   const headers = ['No.','FIRST NAME','MIDDLE NAME','LAST NAME', 'POSITION', 'DEPARTMENT', 'APPLY TYPE', 'DATE TO', 'DATE FROM','REASON','APPROVAL','DATE OF APPROVAL','DATE ACCEPTED'];

//   // Create a new array to hold the table data
//   const data = [];


//   // rows[0].setAttribute('style','color:red;');

//   // Loop through each row and extract the cell data
//   for (let i = 1; i < rows.length; i++) {
//     const row = [];
//     const cells = rows[i].querySelectorAll('td');
//     for (let j = 0; j < cells.length; j++) {
//       row.push(cells[j].textContent);
//     }
//     data.push(row);
//   }



//  const sanitizedData = data.map(row => row.map(val => val === null ? '' : val));


//   const csvString = this.papa.unparse(

//     {

//     fields: headers,
//     data: sanitizedData,

//   });

//   // Create a new blob with the CSV string and set the content type to CSV
//   const blob = new Blob([csvString], {type: 'application/vnd.ms-excel'});

//   // Create a link element to download the CSV file
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = 'Leave Record.xls';
//   document.body.appendChild(link);

//   // Click the link element to download the CSV file
//   link.click();

//   // Remove the link element from the DOM
//   document.body.removeChild(link);
// }




generateCSV() {
  // Get the table element
  const table = document.getElementById('userList_sheet');

  // Get all rows from table
  const rows = table!.querySelectorAll('tr');

  // Set the table headers
  // const title =['Employee List']
  const headers = ['No.','FIRST NAME','MIDDLE NAME','LAST NAME', 'POSITION', 'DEPARTMENT', 'APPLY TYPE', 'DATE TO', 'DATE FROM','REASON','APPROVAL','DATE OF APPROVAL','DATE ACCEPTED'];

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



  // Convert the data array to a CSV string using Papa Parse

  const csvString = this.papa.unparse(



  {

    fields: headers,
    data: sanitizedData,

    }



  );
  this.dateEx =this.datepipe.transform((new Date), 'MMMM d, y');
  this.timeEx =this.datepipe.transform((new Date), 'hh:mm a');

  var export_date = this.papa.unparse({
    "fields": ["Export Date and Time : ",this.dateEx ,this.timeEx],
    "data": [

    ]
  });

  var title = this.papa.unparse({
    "fields": ["Apply Leave Record List"],
    "data": [

    ]
  });

  var admin_name = this.papa.unparse({
    "fields": ["Generated by : ", this.user.getUserName()],
    "data": [

    ]
  });

  // Create a new blob with the CSV string and set the content type to CSV
  const blob = new Blob([export_date,'\n',title,'\n',csvString,'\n\n\n',admin_name], {type: 'text/csv'});

  // Create a link element to download the CSV file
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Leave Record.csv';
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
  doc.text("Employee Leave Record",10,10)
  // Get the table element
  const table = document.getElementById('userList_sheet');

  // Get all rows from table
  const rows = table!.querySelectorAll('tr');

  // Set the table headers
  const headers = ['ID', 'First Name', 'Middle Name', 'Last Name', 'Position','Department', 'Apply Type','Date to','Date from','Reason','Approval','Date of Apply','Date accepted'];

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
    startY: 20,
    tableWidth: tableWidth,
    columnWidth: columnWidths,
    height: tableHeight
  });

  const table2Data = [
    []

  ];
  this.dateEx =this.datepipe.transform((new Date), 'MMMM d, y');
  this.timeEx =this.datepipe.transform((new Date), 'hh:mm a');

  const headers2 = ['Generated by :', this.user.getUserName()];
  const date = ["Export Date and Time : ",this.dateEx ,this.timeEx];


  const tableWidth2 = 100;
  const columnWidths2 = [20, 20, 20];
  const tableHeight2 = table2Data.length * 10;


  (doc as any).autoTable({
    head: '',
    body: [headers2,date],
    startY: tableHeight + 30,
    tableWidth: tableWidth2,
    columnWidth: columnWidths2,
    height: tableHeight2
  });

  // Save the PDF
  doc.save('Employee Leave Record.pdf');
}


  //notification
  deleteNotif(): void {
    this.notification.create(
      'success',
      'Successful',
      'Delete admin complete',
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
  updateUserNotif(): void {
    this.notification.create(
      'success',
      'Successful',
      'Update admin complete',
      {

        nzStyle: {
          width: '600px',
          marginLeft: '-265px',
           backgroundColor:' rgba(241, 255, 246, 0.900)',
        },
        nzClass: 'notification',

      }

    );
    this.recordlist();
  }


  //update User
 startEdit(id: number): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: number): void {
    const index = this.apply_records.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.apply_records[index] },
      edit: false
    };
  }

  saveUser(id: number): void {
    const index = this.approved_list.findIndex(item => item.id === id);
    Object.assign(this.apply_records[index], this.editCache[id].data);



        this.crudHttpService.updateUser(id,this.editCache[id].data).subscribe((response)=>{
          this.recordlist();
          this.updateUserNotif();
              },(error=>{

        }));

    this.editCache[id].edit = false;
  }
  updateEditCache(): void {
    this.apply_records.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }





  ngOnInit(): void {
    this.recordlist();
    this.search();

  }

  //get all user
  recordlist(){
    this.crudHttpService.recordlist().subscribe((Response)=>{
      console.log('Response');
      console.log(Response);
      this.apply_records = Object.values(Response);
      const data =  Object.values(this.apply_records)
      data.forEach((data)=>{
          if (data.apply.approval === 'approved'){
            this.approved_list.push(data);
          }
          if (data.apply.approval === 'pending'){
            this.pending_list.push(data);
          }
          if (data.apply.approval === 'declined'){
            this.declined_list.push(data);
          }
      });

      this.updateEditCache();
      },(error=>{

      }));

  }




//delete user

  deleteUser(user: any){
    this.crudHttpService.deleteUser(user).subscribe((response)=>{
      this.deleteNotif();
      this.recordlist();
    },(error=>{
    }));
  }





//search user
  reset(): void {
    this.searchValue = '';
    this.recordlist();
  }

  search(): void {

    this.visible = false;
    this.apply_records = this.apply_records.filter((item: applyrecords) => item.fname.indexOf(this.searchValue) !== -1);
    console.log(this.apply_records);
    this.searchValue = '';

  }

  constructor(private datepipe: DatePipe,private user: UserServiceService,private papa:Papa,private notification:NzNotificationService,private _http:HttpClient, private crudHttpService: CrudHttpService, private router:Router) {}




}





// interface adminList{
//   id:number;
//   userName: string;
//   email:string;
//   password:string;
//   accessType:string
//   employeeName: string;
// }
// interface adminList2{
//   id:number;
//   userName: string;
//   email:string;
//   password:string;
//   accessType:string
//   employeeName: string;
// }
// interface adminListFinal{
//   id:number;
//   userName: string;
//   email:string;
//   password:string;
//   accessType:string
//   employeeName: string;
// }


// interface UsersList {
//   id:number;
//   userName: string;
//   password: string;
//   accessType: string;
//   fname: string;
//   mname: string;
//   lname: string;
//   email: string;
//   number: string;
//   position: string;
//   department: string;
//   attendance: string;
//   apply:{
//     type:string;
//     date_to:string;
//     date_from:string;
//     reason:string;
//     approval:string;
//   }
// }
// interface UsersList_final {

//   id:number;
//   userName: string;
//   password: string;
//   accessType: string;
//   fname: string;
//   mname: string;
//   lname: string;
//   email: string;
//   number: string;
//   position: string;
//   department: string;
//   attendance: string;
//   apply:{
//     type:string;
//     date_to:string;
//     date_from:string;
//     reason:string;
//     approval:string;
//   }
// }

interface applyrecords{
  id:number;
  fname: string;
  mname: string;
  lname: string;
  position: string;
  department: string;
  apply:{
    type:string;
    date_to:string;
    date_from:string;
    reason:string;
    approval:string;
    date_approval:string;
    date_accepted:string;
  }
}

interface pendinglist{
  id:number;
  fname: string;
  mname: string;
  lname: string;
  position: string;
  department: string;
  apply:{
    type:string;
    date_to:string;
    date_from:string;
    reason:string;
    approval:string;
    date_approval:string;
    date_accepted:string;
  }
}

interface approvedlist{
  id:number;
  fname: string;
  mname: string;
  lname: string;
  position: string;
  department: string;
  apply:{
    type:string;
    date_to:string;
    date_from:string;
    reason:string;
    approval:string;
    date_approval:string;
    date_accepted:string;
  }
}
interface declinedlist{
  id:number;
  fname: string;
  mname: string;
  lname: string;
  position: string;
  department: string;
  apply:{
    type:string;
    date_to:string;
    date_from:string;
    reason:string;
    approval:string;
    date_approval:string;
    date_accepted:string;
  }
}





// interface dataList {

//   id:number;
//   userName: string;
//   password: string;
//   accessType: string;
//   fname: string;
//   mname: string;
//   lname: string;
//   email: string;
//   number: string;
//   position: string;
//   department: string;
//   attendance: string;
//   apply:{
//     type:string;
//     date_to:string;
//     date_from:string;
//     reason:string;
//     approval:string;
//   }
// }
