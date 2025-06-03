import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-new-contract',
  templateUrl: './new-contract.page.html',
  styleUrls: ['./new-contract.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class NewContractPage {
  onUpload() {
    console.log('Choose file');
  }

  onCamera() {
    console.log('Take photo');
  }
}
