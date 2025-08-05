import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RetrieveDocumentService } from '../../infra/rest/retrieve-document.service';
import {UserInfoHeaderComponent} from "../../components/user-info-header/user-info-header.component";
import {ThemeToggleComponent} from "../../components/theme-toggle/theme-toggle.component";
import { AppFooterComponent } from '../../components/app-footer/app-footer.component';
import { DocumentService } from '../../infra/rest/document.service';

interface Dot {
  title?: string;
  description: string;
}

interface Section {
  icon: string;
  title: string;
  dots: Dot[];
}

@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [IonicModule, CommonModule, UserInfoHeaderComponent, ThemeToggleComponent, AppFooterComponent],
  templateUrl: './contract-detail.page.html',
  styleUrls: ['./contract-detail.page.scss']
})
export class ContractDetailPage implements OnInit {
  public resumen: Section[] = [];
  public tituloGeneral: string = '';
  public contractData: any = null;
  public categoryId: string = '';
  public documentId: string = '';
  public isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private retrieveDocuments: RetrieveDocumentService,
    private router: Router,
    private documentService: DocumentService,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    console.log('🔧 ContractDetailPage ngOnInit started');
    
    // Get parameters from query params
    this.route.queryParams.subscribe(params => {
      this.categoryId = params['categoryId'] || '';
      this.documentId = params['id'] || '';
      
      console.log('📂 Category ID:', this.categoryId);
      console.log('📄 Document ID:', this.documentId);
      
      if (this.documentId) {
        this.loadContractDetail();
      } else {
        console.error('❌ No document ID provided');
      }
    });
  }

  private loadContractDetail(): void {
    console.log('📄 Loading contract detail...');
    this.isLoading = true;
    
    this.documentService.getDocumentById(this.categoryId, this.documentId).subscribe({
      next: (contract) => {
        console.log('✅ Contract loaded successfully:', contract);
        this.contractData = contract;
        this.tituloGeneral = contract.title || 'Documento sin título';
        
        // Parse the contract summary
        this.resumen = this.parseSummary(contract.summary || '');
        this.isLoading = false;
        
        console.log('📊 Parsed sections:', this.resumen.length);
      },
      error: (error) => {
        console.error('❌ Error loading contract:', error);
        this.isLoading = false;
        this.showErrorAlert('Error al cargar el documento');
      }
    });
  }

  parseSummary(text: string): Section[] {
    const sections: Section[] = [];
    const lines = text.split('\n');
    let currentSection: Section | null = null;

    // Find general title (first line like "**Contract Analysis**")
    for (const line of lines) {
      const mainTitleMatch = line.trim().match(/^\*\*(?!\d+\.)\s*(.*?)\s*\*\*$/);
      if (mainTitleMatch) {
        this.tituloGeneral = mainTitleMatch[1].trim();
        break;
      }
    }

    for (const line of lines) {
      const trimmed = line.trim();

      // Section title with icon
      const matchTitle = trimmed.match(/^\*\*\d+\.\s*(.*?)\*\*/);
      if (matchTitle) {
        if (currentSection) sections.push(currentSection);

        const completeTitle = matchTitle[1];
        const [icon, ...rest] = completeTitle.trim().split(' ');
        const title = rest.join(' ');

        currentSection = {
          icon,
          title,
          dots: []
        };
        continue;
      }

      // Point with title
      const matchWithTitle = trimmed.match(/^\*\s*\*\*(.*?)\*\*:(.*)/);
      if (matchWithTitle && currentSection) {
        currentSection.dots.push({
          title: matchWithTitle[1].trim(),
          description: matchWithTitle[2].trim()
        });
        continue;
      }

      // Simple point
      const matchSimple = trimmed.match(/^\*\s+(.*)/);
      if (matchSimple && currentSection) {
        currentSection.dots.push({
          description: matchSimple[1].trim()
        });
        continue;
      }

      // Loose line within section
      if (currentSection && trimmed !== '') {
        currentSection.dots.push({
          description: trimmed
        });
      }
    }

    if (currentSection) sections.push(currentSection);

    console.log('📊 Parsed contract summary sections:', sections.length);
    return sections;
  }

  async confirmDeleteDocument() {
    const alert = await this.alertController.create({
      header: 'Eliminar Documento',
      message: `¿Estás seguro de que deseas eliminar "${this.tituloGeneral}"? Esta acción no se puede deshacer.`,
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
          handler: () => this.deleteDocument()
        }
      ]
    });
    await alert.present();
  }

  private deleteDocument() {
    console.log('🗑️ Deleting document:', this.tituloGeneral);
    
    this.documentService.deleteDocument(this.categoryId, this.documentId).subscribe({
      next: () => {
        console.log('✅ Document deleted successfully');
        this.showSuccessAlert('Documento eliminado exitosamente', () => {
          this.router.navigate(['/contract-list'], { 
            queryParams: { categoryId: this.categoryId } 
          });
        });
      },
      error: (error) => {
        console.error('❌ Error deleting document:', error);
        this.showErrorAlert('Error al eliminar el documento');
      }
    });
  }

  goHome() {
    this.router.navigate(['/contracts']);
  }

  goBack() {
    this.router.navigate(['/contract-list'], { 
      queryParams: { categoryId: this.categoryId } 
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

  private async showSuccessAlert(message: string, callback?: () => void) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: message,
      buttons: [{
        text: 'OK',
        handler: () => {
          if (callback) callback();
        }
      }]
    });
    await alert.present();
  }
}
