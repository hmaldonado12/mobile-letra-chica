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
    console.log('🔧 ContractsPage ngOnInit iniciado');
    const userID = this.retrieveInfoSession.getSessionInfoByKey("userID");
    console.log('🔍 UserID obtenido de sesión:', userID);
    this.userIdFromSession = userID;
    
    if (!userID) {
      console.error('❌ UserID está vacío o no se encontró en la sesión');
      return;
    }
    
    console.log('📞 Llamando a loadingCategories con userID:', userID);
    this.loadingCategories(userID);
  }

  private loadingCategories(userInput: string) {
    console.log('🔄 loadingCategories iniciado para usuario:', userInput);
    this.isLoading = true;
    
    console.log('📡 Haciendo request GET para categorías...');
    this.retrieveCategories.getUserCategories(userInput).subscribe({
      next: (response) => {
        console.log('✅ Respuesta recibida:', response);
        console.log('📊 Número de categorías recibidas:', response?.length || 0);
        this.categories = response || [];
        console.log(response);
        this.isLoading = false;
        console.log('🏁 loadingCategories completado, categorías:', this.categories);
      },
      error: (error) => {
        console.error('❌ Error retrieving categories:', error);
        console.error('🔍 Error status:', error?.status);
        console.error('🔍 Error message:', error?.message);  
        console.error('🔍 Error details:', JSON.stringify(error, null, 2));
        console.error('🔍 Error URL:', error?.url);
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
    
    if (this.categories.length === 1) {
      this.saveInfoSession.saveSessionInfoByKey("categoryId", this.categories[0].id);
      this.router.navigate(['/new-contract']);
      return;
    }
    this.showCategorySelector();
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
      , error: (error) =>  {
        console.error('Error retrieving categories:', error);
      }
    })
  }

  async showCreateCategoryAlert() {
    const alert = await this.alertController.create({
      header: 'Nueva Categoría',
      message: 'Ingresa el nombre de la nueva categoría:',
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'categoryName',
          type: 'text',
          placeholder: 'Nombre de la categoría',
          attributes: {
            maxlength: 50
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Crear',
          cssClass: 'alert-button-confirm',
          handler: (data) => {
            const categoryName = data.categoryName?.trim();
            if (categoryName) {
              this.createNewCategory(categoryName);
              return true;
            } else {
              this.showErrorAlert('Por favor ingresa un nombre para la categoría');
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }


  private createNewCategory(categoryName: string) {
    console.log('🔨 Creando categoría:', categoryName);
    this.createCategory.createCategory(this.userIdFromSession, categoryName).subscribe({
      next: (response) => {
        console.log('✅ Categoría creada exitosamente:', response);
        // Recargar categorías después de crear usando loadingCategories que actualiza la UI
        this.loadingCategories(this.userIdFromSession);
      },
      error: (error) => {
        console.error('❌ Error creando categoría:', error);
        this.showErrorAlert('Error al crear la categoría. Inténtalo de nuevo.');
      }
    })
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showCategorySelector() {
    const inputs = this.categories.map(category => ({
      name: 'category',
      type: 'radio' as const,
      label: category.name,
      value: category.id
    }));

    const alert = await this.alertController.create({
      header: 'Seleccionar Categoría',
      message: 'Elige la categoría para tu nuevo contrato:',
      cssClass: 'custom-alert',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Continuar',
          cssClass: 'alert-button-confirm',
          handler: (selectedCategoryId) => {
            if (selectedCategoryId) {
              this.saveInfoSession.saveSessionInfoByKey("categoryId", selectedCategoryId);
              this.router.navigate(['/new-contract']);
            }
          }
        }
      ]
    });

    await alert.present();
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
