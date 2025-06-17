import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RetrieveDocumentService } from '../../infra/rest/retrieve-document.service';

interface Dot {
  title?: string;
  description: string;
}

interface Secction {
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
  public resumen: Secction[] = [];
  public tituloGeneral: string = '';
  
  // @Input() title: string = '';
  // @Input() ventajas: string[] = [];
  // @Input() desventajas: string[] = [];
  // @Input() modificaciones: string[] = [];
  // @Input() clausulas: string[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private retrieveDocuments: RetrieveDocumentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.retrieveDocuments.getCategoryDocuments(id).subscribe(contract => {
        console.log('Contrato recibido:', contract);
        this.resumen = this.parseSummary(contract.summary || '');
        // this.title = constract.title;
        // this.ventajas = constract.advantages || [];
        // this.desventajas = constract.disadvantages || [];
        // this.modificaciones = constract.modifications || [];
        // this.clausulas = constract.clauses || [];
      });
    }
  }

  parseSummary(text: string): Secction[] {
    const secctions: Secction[] = [];
    const lines = text.split('\n');
    let currentSecction: Secction | null = null;

    // Search general title
    for (const line of lines) {
      const principalTitleMatch = line.trim().match(/^\*\*(?!\d+\.)\s*(.*?)\s*\*\*$/);
      if (principalTitleMatch) {
        this.tituloGeneral = principalTitleMatch[1].trim();
        break;
      } 
    }

    for (const line of lines) {
      const trimmed = line.trim();

      // section title with icon
      const matchTitle = trimmed.match(/^\*\*\d+\.\s*(.*?)\*\*/);
      if (matchTitle) {
        if (currentSecction) secctions.push(currentSecction);

        const completeTitle = matchTitle[1];
        const [icon, ...rest] = completeTitle.trim().split(' ');
        const title = rest.join(' ');

        currentSecction = {
          icon,
          title,
          dots: []
        };
        continue;
      }

      const matchWithTitle = trimmed.match(/^\*\s*\*\*(.*?)\*\*:(.*)/);
      if (matchWithTitle && currentSecction) {
        currentSecction.dots.push({
          title: matchWithTitle[1].trim(),
          description: matchWithTitle[2].trim()
        });
        continue;
      }

      const matchSimple = trimmed.match(/^\*\s+(.*)/);
      if (matchSimple && currentSecction) {
        currentSecction.dots.push({
          description: matchSimple[1].trim()
        });
        continue;
      }

      if (currentSecction && trimmed !== '') {
        currentSecction.dots.push({
          description: trimmed
        });
      }
    }

    if (currentSecction) secctions.push(currentSecction);

    return secctions;
  }
}
