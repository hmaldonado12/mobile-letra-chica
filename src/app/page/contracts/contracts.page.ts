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
import {DocumentService} from "../../infra/rest/document.service";
import {UserService} from "../../infra/rest/user.service";

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
              private alertController: AlertController,
              private documentService: DocumentService,
              private userService: UserService) {}

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
    console.log('🔄 Loading categories for user:', userInput);
    this.isLoading = true;
    
    console.log('📡 Making GET request for categories...');
    this.retrieveCategories.getUserCategories(userInput).subscribe({
      next: (response) => {
        console.log('✅ Categories response received:', response);
        console.log('📊 Number of categories received:', response?.length || 0);
        this.categories = response || [];
        
        // Load documents for each category using the new DocumentService
        this.loadDocumentsForCategories();
        
        this.isLoading = false;
        console.log('🏁 Loading categories completed, categories:', this.categories);
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

  private loadDocumentsForCategories() {
    console.log('📄 Loading documents for categories...');
    this.categories.forEach(category => {
      this.documentService.getDocuments(category.id).subscribe({
        next: (documentsResponse) => {
          console.log(`✅ Documents loaded for category ${category.name}:`, documentsResponse);
          category.documents = documentsResponse.documents || [];
          category.documentCount = category.documents.length;
        },
        error: (error) => {
          console.error(`❌ Error loading documents for category ${category.name}:`, error);
          category.documents = [];
          category.documentCount = 0;
        }
      });
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

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.userIdFromSession = this.retrieveInfoSession.getSessionInfoByKey("userID");
    console.log(this.userIdFromSession);
    console.log('Modal dismissed with confirm:', this.name);
    this.createCategory.createCategory(this.userIdFromSession, this.name).subscribe(response => {
      console.log(response);
      this.loadingCategories(this.userIdFromSession);
    });
    this.name = '';
    this.modal.dismiss();
  }

  onWillDismiss(event: any) {
    console.log('Modal will dismiss:', event);
  }

  openCategory(category: any) {
    console.log('📂 Opening category:', category.name, 'with documents:', category.documents?.length || 0);
    
    if (category.documents && category.documents.length > 0) {
      // Save category info in session for navigation
      this.saveInfoSession.saveSessionInfoByKey("selectedCategoryId", category.id);
      this.saveInfoSession.saveSessionInfoByKey("selectedCategoryName", category.name);
      
      // Navigate to contract list for this category
      this.router.navigate(['/contract-list'], { 
        queryParams: { 
          categoryId: category.id,
          categoryName: category.name 
        } 
      });
      return;
    }
    
    this.presentAlertContracts().then(alert => {
      console.log('Alert presented for empty category:', alert);
    });
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
