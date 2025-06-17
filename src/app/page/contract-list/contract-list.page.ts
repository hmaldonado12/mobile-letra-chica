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
  // items = [
  //   { id: 1, title: 'Contract A', date: '2024-06-01', status: 'Active' },
  //   { id: 2, title: 'Contract B', date: '2024-05-15', status: 'Pending' },
  //   { id: 3, title: 'Contract C', date: '2024-04-20', status: 'Expired' }
  // ];
  contracts: any[] = [];
  categoryId: string = '';

  searchTerm: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private retrieveDocuments: RetrieveDocumentService
  ) {}

  ngOnInit(): void {
      this.categoryId = this.route.snapshot.paramMap.get('categoryId') || '';
      this.retrieveDocuments.getCategoryDocuments(this.categoryId).subscribe(response => {
        this.contracts = response.documents || [];
      });
  }

  // get filteredItems() {
  //   if (!this.searchTerm) {
  //     return this.items;
  //   }
  //   const term = this.searchTerm.toLowerCase();
  //   return this.items.filter(item =>
  //     item.title.toLowerCase().includes(term) ||
  //     item.status.toLowerCase().includes(term) ||
  //     item.date.includes(term)
  //   );
  // }

  openContract(contractId: string) {
    this.router.navigate([contractId], { relativeTo: this.route });
  }
}
