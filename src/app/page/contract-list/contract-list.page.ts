import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { RetrieveDocumentService }from '../../infra/rest/retrieve-document.service';
import {UserInfoHeaderComponent} from "../../components/user-info-header/user-info-header.component";
import {ThemeToggleComponent} from "../../components/theme-toggle/theme-toggle.component";
import { AppFooterComponent } from '../../components/app-footer/app-footer.component';
import { DeleteCategoryRepositoryService } from '../../infra/rest/delete-category-repository.service';
import { DocumentService } from '../../infra/rest/document.service';
import { RetrieveInfoSessionService } from '../../infra/rest/retrieve-info-session.service';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.page.html',
  styleUrls: ['./contract-list.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, UserInfoHeaderComponent, ThemeToggleComponent, AppFooterComponent]
})
export class ContractListPage implements OnInit {
  contracts: any[] = [];
  filteredContracts: any[] = [];
  categoryId: string = '';
  categoryName: string = '';
  searchTerm: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private retrieveDocuments: RetrieveDocumentService,
    private alertController: AlertController,
    private deleteCategoryService: DeleteCategoryRepositoryService,
    private documentService: DocumentService,
    private retrieveInfoSession: RetrieveInfoSessionService
  ) {}
  ngOnInit(): void {
    console.log('🔧 ContractListPage ngOnInit started');
    
    // Get category info from query params or session
    this.route.queryParams.subscribe(params => {
      this.categoryId = params['categoryId'] || this.retrieveInfoSession.getSessionInfoByKey('selectedCategoryId') || '';
      this.categoryName = params['categoryName'] || this.retrieveInfoSession.getSessionInfoByKey('selectedCategoryName') || 'Documentos';
      
      console.log('📂 Category ID:', this.categoryId);
      console.log('📂 Category Name:', this.categoryName);
      
      if (this.categoryId) {
        this.loadDocuments();
      } else {
        console.error('❌ No category ID found');
      }
    });
  }

  private loadDocuments(): void {
    console.log('📄 Loading documents for category:', this.categoryId);
    this.isLoading = true;
    
    this.documentService.getDocuments(this.categoryId).subscribe({
      next: (documents) => {
        console.log('✅ Documents loaded successfully:', documents.length);
        this.contracts = documents || [];
        this.filteredContracts = [...this.contracts];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading documents:', error);
        this.contracts = [];
        this.filteredContracts = [];
        this.isLoading = false;
        this.showErrorAlert('Error al cargar los documentos');
      }
    });
  }

  filterContracts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredContracts = [...this.contracts];
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredContracts = this.contracts.filter(contract =>
      (contract.title || '').toLowerCase().includes(term) ||
      (contract.summary || '').toLowerCase().includes(term) ||
      (contract.status || '').toLowerCase().includes(term)
    );
    
    console.log('🔍 Filtered contracts:', this.filteredContracts.length, 'of', this.contracts.length);
  }

  openContract(contract: any) {
    console.log('📄 Opening contract:', contract.title);
    this.router.navigate(['/contract-detail'], { 
      queryParams: { 
        categoryId: this.categoryId,
        id: contract.id,
        categoryName: this.categoryName 
      } 
    });
  }

  async confirmDeleteContract(contract: any, event: Event) {
    event.stopPropagation(); // Prevent opening the contract
    
    const alert = await this.alertController.create({
      header: 'Eliminar Documento',
      message: `¿Estás seguro de que deseas eliminar "${contract.title}"? Esta acción no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          cssClass: 'alert-button-confirm',
          handler: () => this.deleteContract(contract)
        }
      ]
    });
    await alert.present();
  }

  private deleteContract(contract: any) {
    console.log('🗑️ Deleting contract:', contract.title);
    
    this.documentService.deleteDocument(this.categoryId, contract.id).subscribe({
      next: () => {
        console.log('✅ Document deleted successfully');
        this.loadDocuments(); // Reload the list
        this.showSuccessAlert('Documento eliminado exitosamente');
      },
      error: (error) => {
        console.error('❌ Error deleting document:', error);
        this.showErrorAlert('Error al eliminar el documento');
      }
    });
  }

  async confirmDeleteCategory() {
    const alert = await this.alertController.create({
      header: 'Eliminar Categoría',
      message: `¿Estás seguro de que deseas eliminar la categoría "${this.categoryName}"? Esta acción eliminará todos los documentos asociados y no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          cssClass: 'alert-button-confirm',
          handler: () => this.deleteCategory()
        }
      ]
    });
    await alert.present();
  }

  private deleteCategory() {
    console.log('🗑️ Deleting category:', this.categoryName);
    
    this.deleteCategoryService.deleteCategory(this.categoryId).subscribe({
      next: () => {
        console.log('✅ Category deleted successfully');
        this.router.navigate(['/contracts']);
      },
      error: (error) => {
        console.error('❌ Error deleting category:', error);
        this.showErrorAlert('No se pudo eliminar la categoría');
      }
    });
  }

  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  goToNewContract() {
    // Save category ID for new contract creation
    this.retrieveInfoSession.setSessionInfoByKey('categoryId', this.categoryId);
    this.router.navigate(['/new-contract']);
  }
}
