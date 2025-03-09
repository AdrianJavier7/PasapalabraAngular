import { Component, OnInit } from '@angular/core';
import {IonApp, IonButton, IonContent, IonHeader, IonInput, IonTitle, IonToolbar} from "@ionic/angular/standalone";

@Component({
  selector: 'app-secundaria',
  templateUrl: './secundaria.component.html',
  styleUrls: ['./secundaria.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonButton
  ]
})
export class SecundariaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
