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

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.page.html',
  styleUrls: ['./contract-list.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, UserInfoHeaderComponent, ThemeToggleComponent, AppFooterComponent]
})
export class ContractListPage implements OnInit {
  contracts: any[] = [];
  categoryId: string = '';
  searchTerm: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private retrieveDocuments: RetrieveDocumentService,
    private alertController: AlertController,
    private deleteCategoryService: DeleteCategoryRepositoryService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('categoryId') || '';
      this.contracts = [];
      this.isLoading = true;
      this.retrieveDocuments.getCategoryDocuments(this.categoryId).subscribe({
        next: (response) => {
          this.contracts = response.documents || [];
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    });
  }

  get filteredContracts() {
    if (!this.searchTerm) return this.contracts;
    const term = this.searchTerm.toLowerCase();
    return this.contracts.filter(contract =>
      (contract.title || '').toLowerCase().includes(term)
    );
  }

  openContract(contractId: string) {
    this.router.navigate([contractId], { relativeTo: this.route });
  }

  async confirmDeleteCategory() {
    const alert = await this.alertController.create({
      header: 'Eliminar categoría',
      message: '¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.deleteCategory()
        }
      ]
    });
    await alert.present();
  }

  deleteCategory() {
    this.deleteCategoryService.deleteCategory(this.categoryId).subscribe({
      next: () => {
        this.router.navigate(['/contracts']);
      },
      error: () => {
        this.alertController.create({
          header: 'Error',
          message: 'No se pudo eliminar la categoría.',
          buttons: ['OK']
        }).then(alert => alert.present());
      }
    });
  }
}
