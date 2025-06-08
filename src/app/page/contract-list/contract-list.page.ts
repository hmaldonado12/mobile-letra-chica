import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

interface ContractItem {
  title: string;
  date: string;
  status: string;
  url: string;
}

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.page.html',
  styleUrls: ['./contract-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ContractListPage implements OnInit {
  items: ContractItem[] = [];

  ngOnInit() {
    // TODO: Replace with actual data fetching logic
    this.items = [
      { title: 'Contract 1', date: '2024-06-01', status: 'Active', url: '/assets/mock-files/contract1.pdf' },
      { title: 'Contract 2', date: '2024-05-15', status: 'Expired', url: '/assets/mock-files/contract2.docx' },
      { title: 'Contract 3', date: '2024-04-20', status: 'Pending', url: '/assets/mock-files/contract3.txt' }
    ];
  }

  openUrl(url: string) {
    window.open(url, '_blank');
  }
}
