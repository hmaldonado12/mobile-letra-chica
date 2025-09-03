import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicModule, IonModal, AlertController} from "@ionic/angular";
import {RetrieveInfoSessionService} from "../../infra/rest/retrieve-info-session.service";
import {NgForOf, NgIf} from "@angular/common";
import {SaveDocumentRepositoryService} from "../../infra/rest/save-document-repository.service";
import {Router} from "@angular/router";
import {UserInfoHeaderComponent} from "../../components/user-info-header/user-info-header.component";
import {ThemeToggleComponent} from "../../components/theme-toggle/theme-toggle.component";
import {AppFooterComponent} from "../../components/app-footer/app-footer.component";
import {RetrieveCagetoryService} from "../../infra/rest/retrieve-cagetory.service";
import {FormsModule} from "@angular/forms";
import {IonCheckboxCustomEvent, CheckboxChangeEventDetail} from "@ionic/core";
import {DocumentService} from "../../infra/rest/document.service";
import {UserService} from "../../infra/rest/user.service";

interface Punto {
  titulo?: string;
  descripcion: string;
}

interface Seccion {
  icono: string;
  titulo: string;
  puntos: Punto[];
}

interface Category {
  id: string;
  name: string;
  userId: string;
  email: string;
  selected: boolean;
}

@Component({
  selector: 'app-view-contract',
  templateUrl: './view-contract.page.html',
  styleUrls: ['./view-contract.page.scss'],
  standalone: true,
  imports: [IonicModule, NgForOf, NgIf, UserInfoHeaderComponent, ThemeToggleComponent, AppFooterComponent, FormsModule]
})
export class ViewContractPage implements OnInit {

  @ViewChild(IonModal) modal!: IonModal;
  isSelected = false;

  public resumen: Seccion[] = [];
  public tituloGeneral: string = '';
  isAlertOpen = false;
  alertButtons = ['Action'];
  public categories: Category[] = [];
  categorySelected: string = '';


  constructor(private retrieveInfoSession: RetrieveInfoSessionService,
              private saveDocument: SaveDocumentRepositoryService,
              private categoryService: RetrieveCagetoryService,
              private router: Router,
              private documentService: DocumentService,
              private userService: UserService,
              private alertController: AlertController) { }

  ngOnInit() {
    console.log('🔧 ViewContractPage ngOnInit started');
    
    // Load categories for the current user
    const userId = this.retrieveInfoSession.getSessionInfoByKey("userID");
    if (userId) {
      this.loadUserCategories(userId);
    }
    
    // Get and parse document text
    const documentText = this.getDocumentText();
    this.resumen = this.parseContractSummary(documentText);

    if (documentText) {
      console.log('📄 Document text retrieved successfully');
    } else {
      console.log('⚠️ No document text found in session');
    }
    console.log('✅ ViewContractPage initialized');
  }

  private loadUserCategories(userId: string) {
    console.log('📂 Loading categories for user:', userId);
    
    this.categoryService.getUserCategories(userId).subscribe({
      next: (response) => {
        this.categories = (response || []).map((category: any) => ({
          ...category,
          selected: false
        }));
        console.log('✅ Categories loaded:', this.categories.length);
      },
      error: (error) => {
        console.error('❌ Error retrieving categories:', error);
        this.showErrorAlert('Error al cargar las categorías');
      }
    });
  }

  getDocumentText(): string {
    return this.retrieveInfoSession.getSessionInfoByKey("documentText") || '';
  }

  parseContractSummary(text: string): Seccion[] {
    const sections: Seccion[] = [];
    const lines = text.split('\n');

    let currentSection: Seccion | null = null;

    // 🔍 Find general title (line like "**Contract Analysis**")
    for (const line of lines) {
      const mainTitleMatch = line.trim().match(/^\*\*(?!\d+\.)\s*(.*?)\s*\*\*$/);
      if (mainTitleMatch) {
        this.tituloGeneral = mainTitleMatch[1].trim();
        break; // Only take the first one
      }
    }

    for (const line of lines) {
      const trimmed = line.trim();

      // Match section titles like "**1. 📊 Advantages**"
      const titleMatch = trimmed.match(/^\*\*\d+\.\s*(.*?)\*\*/);
      if (titleMatch) {
        if (currentSection) sections.push(currentSection);

        const fullTitle = titleMatch[1];
        const [icon, ...rest] = fullTitle.trim().split(' ');
        const title = rest.join(' ');

        currentSection = {
          icono: icon,
          titulo: title,
          puntos: []
        };
        continue;
      }

      // Match points with subtitle like "* **Subtitle**: Description"
      const subtitleMatch = trimmed.match(/^\*\s*\*\*(.*?)\*\*:(.*)/);
      if (subtitleMatch && currentSection) {
        currentSection.puntos.push({
          titulo: subtitleMatch[1].trim(),
          descripcion: subtitleMatch[2].trim()
        });
        continue;
      }

      // Match simple points like "* Description"
      const simpleMatch = trimmed.match(/^\*\s+(.*)/);
      if (simpleMatch && currentSection) {
        currentSection.puntos.push({
          descripcion: simpleMatch[1].trim()
        });
        continue;
      }
    }

    if (currentSection) sections.push(currentSection);

    console.log('📊 Parsed contract summary sections:', sections.length);
    return sections;
  }

  saveToFolder(): void {
    const documentText = this.getDocumentText();
    const selectedCategories = this.categories.filter(cat => cat.selected);
    
    if (!documentText) {
      console.error('❌ No document text available to save');
      this.showErrorAlert('No hay texto del documento para guardar');
      return;
    }

    if (selectedCategories.length === 0) {
      this.showErrorAlert('Por favor selecciona al menos una categoría');
      return;
    }

    console.log('💾 Saving document to categories:', selectedCategories.map(c => c.name));

    // Save to first selected category (can be extended to save to multiple)
    const selectedCategory = selectedCategories[0];
    const userId = this.retrieveInfoSession.getSessionInfoByKey("userID") || '';

    this.documentService.saveDocument(
      selectedCategory.id,
      this.tituloGeneral || 'Documento sin título',
      documentText,
      userId,
      'analyzed'
    ).subscribe({
      next: (response) => {
        console.log('✅ Document saved successfully:', response);
        this.showSuccessAlert('Documento guardado exitosamente');
      },
      error: (error) => {
        console.error('❌ Error saving document:', error);
        this.showErrorAlert('Error al guardar el documento');
      }
    });
  }

  onCategorySelectionChange(event: IonCheckboxCustomEvent<CheckboxChangeEventDetail>, category: Category) {
    console.log('📂 Category selection changed:', category.name, event.detail.checked);
    category.selected = event.detail.checked;
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(null, 'confirm');
    this.saveToFolder();
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
    if (!isOpen) {
      this.router.navigate(['/contracts']);
    }
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
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigate(['/contracts']);
        }
      }]
    });
    await alert.present();
  }
}
