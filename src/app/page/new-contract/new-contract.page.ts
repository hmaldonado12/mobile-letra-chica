import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import {DocumentAnalysisRepositoryService} from "../../infra/rest/document-analysis-repository.service";
import {SaveInfoSessionService} from "../../infra/rest/save-info-session.service";
import {Router} from "@angular/router";
import {RetrieveInfoSessionService} from "../../infra/rest/retrieve-info-session.service";
import {UserInfoHeaderComponent} from "../../components/user-info-header/user-info-header.component";
import {ThemeToggleComponent} from "../../components/theme-toggle/theme-toggle.component";
import { AppFooterComponent } from '../../components/app-footer/app-footer.component';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../infra/rest/document.service';

@Component({
  selector: 'app-new-contract',
  templateUrl: './new-contract.page.html',
  styleUrls: ['./new-contract.page.scss'],
  standalone: true,
  imports: [IonicModule, UserInfoHeaderComponent, ThemeToggleComponent, AppFooterComponent, CommonModule]
})
export class NewContractPage {
  isUploading = false;
  selectedFile: File | null = null;

  constructor(private documentAnalysisRepo: DocumentAnalysisRepositoryService,
              private saveInfoSession: SaveInfoSessionService,
              private retrieveInfoSession: RetrieveInfoSessionService,
              private router: Router,
              private documentService: DocumentService,
              private alertController: AlertController) { }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      console.log('📄 File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
      
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
        console.log('✅ PDF file selected successfully');
      } else {
        console.error('❌ Invalid file type:', file.type);
        this.showErrorAlert('Por favor selecciona un archivo PDF válido');
      }
    }
  }

  onUpload() {
    if (!this.selectedFile) {
      this.showErrorAlert('Por favor selecciona un archivo primero');
      return;
    }

    const categoryId = this.retrieveInfoSession.getSessionInfoByKey("categoryId");
    if (!categoryId) {
      console.error('❌ No category ID found in session');
      this.showErrorAlert('Error: No se encontró la categoría seleccionada');
      return;
    }

    console.log('🚀 Starting document analysis for category:', categoryId);
    this.isUploading = true;
    
    this.documentService.analyzeDocument(categoryId, this.selectedFile).subscribe({
      next: (response) => {
        console.log('✅ Document analysis completed:', response);
        
        // Handle different response formats
        let textResponse = '';
        if (response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) {
          textResponse = response.candidates[0].content.parts[0].text;
        } else if (typeof response === 'string') {
          textResponse = response;
        } else {
          textResponse = JSON.stringify(response);
        }
        
        console.log('📄 Extracted text length:', textResponse.length);
        this.saveInfoSession.saveSessionInfoByKey("documentText", textResponse);
        this.isUploading = false;
        this.router.navigateByUrl("/view-contract");
      },
      error: (error) => {
        this.isUploading = false;
        console.error('❌ Error analyzing document:', error);
        this.showErrorAlert('Error al analizar el documento. Por favor intenta de nuevo.');
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

  private async showInfoAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Información',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
