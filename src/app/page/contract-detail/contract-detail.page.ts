import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RetrieveDocumentService } from '../../infra/rest/retrieve-document.service';

@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './contract-detail.page.html',
  styleUrls: ['./contract-detail.page.scss']
})
export class ContractDetailPage implements OnInit {
  @Input() title: string = '';
  @Input() ventajas: string[] = [];
  @Input() desventajas: string[] = [];
  @Input() modificaciones: string[] = [];
  @Input() clausulas: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private retrieveDocuments: RetrieveDocumentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.retrieveDocuments.getCategoryDocuments(id).subscribe(constract => {
        this.title = constract.title;
        this.ventajas = constract.advantages || [];
        this.desventajas = constract.disadvantages || [];
        this.modificaciones = constract.modifications || [];
        this.clausulas = constract.clauses || [];
      });
    }
  }
}
