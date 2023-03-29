import { Component } from '@angular/core';
import { Router ,ActivatedRoute,ParamMap} from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isCollapsed = true;
  confirmModal?: NzModalRef;

  constructor(private modal:NzModalService,private Route: ActivatedRoute,private router:Router) {}



  logout(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you want to logout?',
      nzOnOk: () =>
        new Promise((resolve, reject) => {

        setTimeout(Math.random() > 0.5 ? resolve : reject, 800);
        this.router.navigate([''])

        }).catch(() => console.log('Oops errors!'))
    });
  }


}
