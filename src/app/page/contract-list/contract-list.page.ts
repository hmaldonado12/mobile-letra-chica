import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.page.html',
  styleUrls: ['./contract-list.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class ContractListPage {
  items = [
    { id: 1, title: 'Contract A', date: '2024-06-01', status: 'Active' },
    { id: 2, title: 'Contract B', date: '2024-05-15', status: 'Pending' },
    { id: 3, title: 'Contract C', date: '2024-04-20', status: 'Expired' }
  ];

  searchTerm: string = '';

  constructor(private router: Router) {}

  get filteredItems() {
    if (!this.searchTerm) {
      return this.items;
    }
    const term = this.searchTerm.toLowerCase();
    return this.items.filter(item =>
      item.title.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term) ||
      item.date.includes(term)
    );
  }

  openContract(id: number) {
    this.router.navigate(['/contract-list', id]);
  }
}
