import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicModule, IonModal} from "@ionic/angular";
import {RetrieveInfoSessionService} from "../../infra/rest/retrieve-info-session.service";
import {NgForOf, NgIf} from "@angular/common";
import {SaveDocumentRepositoryService} from "../../infra/rest/save-document-repository.service";
import {Router} from "@angular/router";
import {UserInfoHeaderComponent} from "../../components/user-info-header/user-info-header.component";
import {ThemeToggleComponent} from "../../components/theme-toggle/theme-toggle.component";
import {AppFooterComponent} from "../../components/app-footer/app-footer.component";
import {RetrieveCagetoryService} from "../../infra/rest/retrieve-cagetory.service";
import {FormsModule} from "@angular/forms";
import {IonCheckboxCustomEvent} from "@ionic/core";

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
              private router: Router) { }

  ngOnInit() {
    this.categoryService.getUserCategories(this.retrieveInfoSession.getSessionInfoByKey("userID") || '').subscribe({
      next: (response) => {
        this.categories = response || [];
        console.log(this.categories);
      },
      error: (error) => {
        console.error('Error retrieving categories:', error);
      }
    });
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
        this.categorySelected,
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

  onCheckboxChange(id: string, event: IonCheckboxCustomEvent<any>) {
    const checked = event.detail.checked;
    console.log(checked);
    console.log(`Checkbox con ID ${id} fue ${checked ? 'seleccionado' : 'deseleccionado'}`);
    this.modal.dismiss(this.isSelected, checked);
    this.categorySelected = id;
    this.guardarEnCarpeta();

    const category = this.categories.find(i => i.id === id.toString());
    if (category) {
      category.selected = checked;
    }
  }
}
