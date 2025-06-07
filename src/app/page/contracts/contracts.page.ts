import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {RetrieveCagetoryService} from "../../infra/rest/retrieve-cagetory.service";
import {RetrieveInfoSessionService} from "../../infra/rest/retrieve-info-session.service";

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.page.html',
  styleUrls: ['./contracts.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ContractsPage implements OnInit {

  public categories: any[] = [];


  constructor(private router: Router,
              private retrieveCategories: RetrieveCagetoryService,
              private retrieveInfoSession: RetrieveInfoSessionService) {}

  ngOnInit(): void {
    const userID = this.retrieveInfoSession.getSessionInfoByKey("userID");
    console.log("from session", userID);
    this.retrieveCategories.getUserCategories(userID).subscribe({
      next: (response) => {
        console.log('Categories retrieved successfully:', response);
        this.categories = response || [];
        console.log("other", this.categories);
      }
      , error: (error) => {
        console.error('Error retrieving categories:', error);
      }
    })
  }
  goHome() {
    this.router.navigate(['/contracts']);
  }

}
