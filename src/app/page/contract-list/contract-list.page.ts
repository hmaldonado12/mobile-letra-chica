import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <-- Add this import

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.page.html',
  styleUrls: ['./contract-list.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class ContractListPage {
  items = [
    { title: 'Contract A', date: '2024-06-01', status: 'Active', url: 'https://example.com/a' },
    { title: 'Contract B', date: '2024-05-15', status: 'Pending', url: 'https://example.com/b' },
    { title: 'Contract C', date: '2024-04-20', status: 'Expired', url: 'https://example.com/c' }
  ];

  searchTerm: string = '';

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

  openUrl(url: string) {
    window.open(url, '_blank');
  }
}
