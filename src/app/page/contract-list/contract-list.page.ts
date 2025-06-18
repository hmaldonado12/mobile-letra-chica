import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { RetrieveDocumentService }from '../../infra/rest/retrieve-document.service';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.page.html',
  styleUrls: ['./contract-list.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class ContractListPage implements OnInit {
  contracts: any[] = [];
  categoryId: string = '';
  searchTerm: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private retrieveDocuments: RetrieveDocumentService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('categoryId') || '';
      this.contracts = [];
      this.isLoading = true;
      this.retrieveDocuments.getCategoryDocuments(this.categoryId).subscribe({
        next: (response) => {
          this.contracts = response.documents || [];
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    });
  }

  get filteredContracts() {
    if (!this.searchTerm) return this.contracts;
    const term = this.searchTerm.toLowerCase();
    return this.contracts.filter(contract =>
      (contract.title || '').toLowerCase().includes(term)
    );
  }

  openContract(contractId: string) {
    this.router.navigate([contractId], { relativeTo: this.route });
  }
}
