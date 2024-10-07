import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {ButtonAllModule} from "@syncfusion/ej2-angular-buttons";
import {HeaderComponent} from "./shared/common/components/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonAllModule, RouterLink, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'BI-SPLITWISE-TASK';

  constructor() {
  }

}
