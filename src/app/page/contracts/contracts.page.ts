import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonicModule, IonModal} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {RetrieveCagetoryService} from "../../infra/rest/retrieve-cagetory.service";
import {RetrieveInfoSessionService} from "../../infra/rest/retrieve-info-session.service";
import { OverlayEventDetail } from '@ionic/core/components';
import {CreateCategoryRepositoryService} from "../../infra/rest/create-category-repository.service";
import {SaveInfoSessionService} from "../../infra/rest/save-info-session.service";
import {UserInfoHeaderComponent} from "../../components/user-info-header/user-info-header.component";
import {ThemeToggleComponent} from "../../components/theme-toggle/theme-toggle.component";
import {AppFooterComponent} from "../../components/app-footer/app-footer.component";

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.page.html',
  styleUrls: ['./contracts.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserInfoHeaderComponent, ThemeToggleComponent, AppFooterComponent]
})
export class ContractsPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  name!: string;
  public categories: any[] = [];
  isLoading = false;
  userIdFromSession: string = '';
  isAlertOpen = false;
  alertButtons = ['Ok'];

  constructor(private router: Router,
              private retrieveCategories: RetrieveCagetoryService,
              private retrieveInfoSession: RetrieveInfoSessionService,
              private saveInfoSession: SaveInfoSessionService,
              private createCategory: CreateCategoryRepositoryService,
              private alertController: AlertController) {}

  ngOnInit(): void {
    const userID = this.retrieveInfoSession.getSessionInfoByKey("userID");
    this.userIdFromSession = userID;
    this.loadingCategories(userID);
  }

  private loadingCategories(userInput: string) {
    this.isLoading = true;
    this.retrieveCategories.getUserCategories(userInput).subscribe({
      next: (response) => {
        this.categories = response || [];
        console.log(response);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error retrieving categories:', error);
        this.isLoading = false;
      }
    });
  }

  goHome() {
    this.router.navigate(['/contracts']);
  }

  goNewContract() {
    if (this.categories.length === 0) {
      this.presentAlert().then(alert => {
        console.log('Alert presented:', alert);
      });
      console.log("No categories found");
      return;
    }
    console.log(this.categories)
    this.saveInfoSession.saveSessionInfoByKey("categoryId", this.categories[0].id);
    this.router.navigate(['/new-contract']);
  }


  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
    this.retrieveCategoriesByUserId(this.userIdFromSession);
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      this.userIdFromSession = this.retrieveInfoSession.getSessionInfoByKey("userID");
      console.log(this.userIdFromSession);
      console.log(this.name)
      this.createCategory.createCategory(this.userIdFromSession, this.name).subscribe(response => {
        console.log(response);
        this.retrieveCategoriesByUserId(this.userIdFromSession);
      });
      this.name = '';
      location.reload();
    }
  }

  openCategory(category: any) {
    if (category.documents.length > 0 ) {
      const index = category.documents.length - 1;
      this.router.navigate(['/contract-list', category.documents[index].id]);
      return;
    }
    this.presentAlertContracts().then(alert => {
      console.log('Alert presented:', alert);
    })
  }


  private retrieveCategoriesByUserId(userIdInput: string) {
    this.retrieveCategories.getUserCategories(userIdInput).subscribe({
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

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'ALERTA',
      message: 'Se debe crear una categoría antes de crear un contrato.',
      buttons: this.alertButtons,
    });
    await alert.present();
  }

  async presentAlertContracts() {
    const alert = await this.alertController.create({
      header: 'ALERTA',
      message: 'Esta carpeta no tiene contratos asociados.',
      buttons: this.alertButtons,
    });
    await alert.present();
  }
}
