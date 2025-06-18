import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RetrieveDocumentService } from '../../infra/rest/retrieve-document.service';

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
  imports: [IonicModule, CommonModule],
  templateUrl: './contract-detail.page.html',
  styleUrls: ['./contract-detail.page.scss']
})
export class ContractDetailPage implements OnInit {
  public resumen: Section[] = [];
  public tituloGeneral: string = '';

  constructor(
    private route: ActivatedRoute,
    private retrieveDocuments: RetrieveDocumentService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    if (id && categoryId) {
      this.retrieveDocuments.getDocumentById(categoryId, id).subscribe(contract => {
        // Parsear el resumen y obtener el título general
        this.resumen = this.parseSummary(contract.summary || '');
      });
    }
  }

  parseSummary(text: string): Section[] {
    const sections: Section[] = [];
    const lines = text.split('\n');
    let currentSection: Section | null = null;

    // Buscar título general (primera línea tipo "**Análisis del Contrato**")
    for (const line of lines) {
      const mainTitleMatch = line.trim().match(/^\*\*(?!\d+\.)\s*(.*?)\s*\*\*$/);
      if (mainTitleMatch) {
        this.tituloGeneral = mainTitleMatch[1].trim();
        break;
      }
    }

    for (const line of lines) {
      const trimmed = line.trim();

      // Título de sección con icono
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

      // Punto con título
      const matchWithTitle = trimmed.match(/^\*\s*\*\*(.*?)\*\*:(.*)/);
      if (matchWithTitle && currentSection) {
        currentSection.dots.push({
          title: matchWithTitle[1].trim(),
          description: matchWithTitle[2].trim()
        });
        continue;
      }

      // Punto simple
      const matchSimple = trimmed.match(/^\*\s+(.*)/);
      if (matchSimple && currentSection) {
        currentSection.dots.push({
          description: matchSimple[1].trim()
        });
        continue;
      }

      // Línea suelta dentro de sección
      if (currentSection && trimmed !== '') {
        currentSection.dots.push({
          description: trimmed
        });
      }
    }

    if (currentSection) sections.push(currentSection);

    return sections;
  }

  goHome() {
    this.router.navigate(['/contracts']);
  }
}