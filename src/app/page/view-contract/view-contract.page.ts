import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RetrieveInfoSessionService} from "../../infra/rest/retrieve-info-session.service";
import {NgForOf, NgIf} from "@angular/common";
import {SaveDocumentRepositoryService} from "../../infra/rest/save-document-repository.service";
import {Router} from "@angular/router";

interface Punto {
  titulo?: string;
  descripcion: string;
}

interface Seccion {
  icono: string;
  titulo: string;
  puntos: Punto[];
}

@Component({
  selector: 'app-view-contract',
  templateUrl: './view-contract.page.html',
  styleUrls: ['./view-contract.page.scss'],
  standalone: true,
  imports: [IonicModule, NgForOf, NgIf]
})
export class ViewContractPage implements OnInit {

  public resumen: Seccion[] = [];
  public tituloGeneral: string = '';
  isAlertOpen = false;
  alertButtons = ['Action'];


  constructor(private retrieveInfoSession: RetrieveInfoSessionService,
              private saveDocument: SaveDocumentRepositoryService,
              private router: Router) { }

  ngOnInit() {
    const documentText = this.getDocumentText();
    this.resumen = this.parsearResumen(documentText);

    if (documentText) {
      console.log('Document text retrieved:', documentText);
    } else {
      console.log('No document text found in session.');
    }
    console.log('ViewContractPage initialized');
  }

  getDocumentText(): string {
    return this.retrieveInfoSession.getSessionInfoByKey("documentText") || '';
  }

  parsearResumen(texto: string): Seccion[] {
    const secciones: Seccion[] = [];
    const lineas = texto.split('\n');

    let seccionActual: Seccion | null = null;

    // 🔍 Buscar el título general (línea tipo "**Análisis del Contrato de Alquiler**")
    for (const linea of lineas) {
      const tituloPrincipalMatch = linea.trim().match(/^\*\*(?!\d+\.)\s*(.*?)\s*\*\*$/);
      if (tituloPrincipalMatch) {
        this.tituloGeneral = tituloPrincipalMatch[1].trim();
        break; // solo tomamos el primero
      }
    }

    for (const linea of lineas) {
      const trimmed = linea.trim();

      const matchTitulo = trimmed.match(/^\*\*\d+\.\s*(.*?)\*\*/);
      if (matchTitulo) {
        if (seccionActual) secciones.push(seccionActual);

        const tituloCompleto = matchTitulo[1];
        const [icono, ...resto] = tituloCompleto.trim().split(' ');
        const titulo = resto.join(' ');

        seccionActual = {
          icono,
          titulo,
          puntos: []
        };
        continue;
      }

      const matchConTitulo = trimmed.match(/^\*\s*\*\*(.*?)\*\*:(.*)/);
      if (matchConTitulo && seccionActual) {
        seccionActual.puntos.push({
          titulo: matchConTitulo[1].trim(),
          descripcion: matchConTitulo[2].trim()
        });
        continue;
      }

      const matchSimple = trimmed.match(/^\*\s+(.*)/);
      if (matchSimple && seccionActual) {
        seccionActual.puntos.push({
          descripcion: matchSimple[1].trim()
        });
        continue;
      }

      if (seccionActual && trimmed !== '') {
        seccionActual.puntos.push({
          descripcion: trimmed
        });
      }
    }

    if (seccionActual) secciones.push(seccionActual);
    return secciones;
  }

  guardarEnCarpeta(): void {
    const documentText = this.getDocumentText();
    if (documentText) {
      this.saveDocument.saveDocument(
        this.retrieveInfoSession.getSessionInfoByKey("categoryId") || '',
        this.tituloGeneral,
        documentText,
        this.retrieveInfoSession.getSessionInfoByKey("userID") || '',
        'successful'
      ).subscribe({
        next: (response) => {
          console.log('Document saved successfully:', response);
          this.isAlertOpen = true
          this.alertButtons = ['Ok'];
          },
        error: (err) => {
          console.error('Error saving document:', err);
        }
      });
    } else {
      console.error('No document text available to save.');
    }
  }


  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
    this.router.navigate(['/contracts']);
  }
}
