import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './contract-detail.page.html',
  styleUrls: ['./contract-detail.page.scss']
})
export class ContractDetailPage {
  @Input() title: string = '';
  @Input() ventajas: string[] = [];
  @Input() desventajas: string[] = [];
  @Input() modificaciones: string[] = [];
  @Input() clausulas: string[] = [];
}
