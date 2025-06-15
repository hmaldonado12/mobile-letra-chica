import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RetrieveInfoSessionService} from "../../infra/rest/retrieve-info-session.service";
import {NgForOf, NgIf} from "@angular/common";

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

  constructor(private retrieveInfoSession: RetrieveInfoSessionService) { }

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
    const bloques = texto.split(/\n\n+/); // separa por párrafos dobles

    let seccionActual: Seccion | null = null;

    for (const bloque of bloques) {
      const tituloMatch = bloque.match(/\*\*(\d\..*?)\*\*/); // detecta títulos tipo **1. ✅ Puntos Positivos...**
      if (tituloMatch) {
        // Si comienza una nueva sección
        if (seccionActual) secciones.push(seccionActual);

        const tituloCompleto = tituloMatch[1]; // Ej: 1. ✅ Puntos Positivos...
        const [icono, ...resto] = tituloCompleto.replace(/^\d+\.\s*/, '').split(' ');
        const titulo = resto.join(' ').trim();

        seccionActual = {
          icono,
          titulo,
          puntos: []
        };
      } else if (bloque.trim().startsWith('*')) {
        // Si es un punto de lista con título
        const match = bloque.match(/\*\s*\*\*(.*?)\*\*:(.*)/);
        if (match && seccionActual) {
          seccionActual.puntos.push({
            titulo: match[1].trim(),
            descripcion: match[2].trim()
          });
        }
      } else if (bloque.trim().startsWith('*')) {
        // Punto sin título
        const match = bloque.match(/\*\s*(.*)/);
        if (match && seccionActual) {
          seccionActual.puntos.push({
            descripcion: match[1].trim()
          });
        }
      } else if (seccionActual) {
        // Descripción suelta o resumen final
        seccionActual.puntos.push({
          descripcion: bloque.trim()
        });
      }
    }

    // Agregar la última sección
    if (seccionActual) secciones.push(seccionActual);

    return secciones;
  }
}
