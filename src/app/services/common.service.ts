import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private productInfo: any;
  private billInfo: any;
  constructor() {}

  formatDateString(dateString: any) {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getUTCFullYear();

    console.log(`${day}/${month}/${year}`, dateString);

    return `${day}/${month}/${year}`;
  }

  set currProductInfo(data: any) {
    this.productInfo = data;
  }

  get currProductInfo() {
    return this.productInfo;
  }

  set currBillInfo(data: any) {
    this.billInfo = data;
  }

  get currBillInfo() {
    return this.billInfo;
  }
}
