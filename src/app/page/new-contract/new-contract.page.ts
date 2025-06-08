import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {DocumentAnalysisRepositoryService} from "../../infra/rest/document-analysis-repository.service";

@Component({
  selector: 'app-new-contract',
  templateUrl: './new-contract.page.html',
  styleUrls: ['./new-contract.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class NewContractPage {

  constructor(private documentAnalysisRepo: DocumentAnalysisRepositoryService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.documentAnalysisRepo.analyzeDocument(file).subscribe({
          next: (response) => {
            console.log('Respuesta del backend:', response.candidates[0].content.parts[0].text);
          },
          error: (err) => {
            console.error('Error al analizar el documento:', err);
          }
        });
      } else {
        console.error('Por favor selecciona un archivo PDF.');
      }
    }
  }

  onUpload() {
    console.log('Choose file');
  }

  onCamera() {
    console.log('Take photo');
  }
}
