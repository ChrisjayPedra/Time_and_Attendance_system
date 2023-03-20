import { Component } from '@angular/core';
import { Router ,ActivatedRoute,ParamMap} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isCollapsed = true;
  constructor(private route: ActivatedRoute) {}

}
