import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { endPoints } from 'src/app/shared/endPoints';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css'],
})
export class BillComponent implements OnInit {
  medicineBillForm: FormGroup = this.fb.group({
    patientName: ['', Validators.required],
    patientEmail: ['', Validators.required],
    patientAddress: [''],
    doctorName: [''],
    medicineDetails: this.fb.array([]),
    quantity: [0, Validators.required],
    price: [0, Validators.required],
    discount: [0, Validators.required],
    totalAmount: [0],
    gstRate: [18, Validators.required], // GST rate in percentage
  });

  get medicineBillFormFC() {
    return this.medicineBillForm.controls;
  }

  get medicineDetails() {
    return this.medicineBillForm.get('medicineDetails') as FormArray;
  }

  totalAmount: number = 0;

  alert: {
    showAlert: boolean;
    alertMsg: String;
    alertType: String;
  } = {
    showAlert: false,
    alertMsg: 'Bill Saved',
    alertType: '',
  };
  page: string = '';
  pageTitle: string = '';
  extraTitle: string = '';
  medicinesArr: any = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private commonServ: CommonService,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      const page = params['page'];
      this.page = page;
      if (page === 'view' && !this.commonServ.currBillInfo) {
        this.router.navigate(['dashboard']);
      }
      page === 'view'
        ? (this.pageTitle = 'Edit Product') &&
          (this.extraTitle = 'Product Details')
        : (this.pageTitle = 'Add Product') && (this.extraTitle = 'New Product');
    });
  }

  async ngOnInit() {
    // this.medicineBillForm.valueChanges.subscribe(() =>
    //   this.calculateTotalAmount()
    // );

    await this.getAllMedicines();
    if (this.commonServ.currBillInfo) {
      this.medicineBillForm.patchValue({
        patientName: this.commonServ.currBillInfo.custName || '',
        patientAddress: this.commonServ.currBillInfo.custAddress || '',
        doctorName: this.commonServ.currBillInfo.docName || '',
        // medicineDetails: [], todo
        // quantity: this.commonServ.currBillInfo.value || '',
        // price: this.commonServ.currBillInfo.value || '',
        discount: this.commonServ.currBillInfo.discount || '',
        totalAmount: this.commonServ.currBillInfo.totalAmount || '',
        gstRate: this.commonServ.currBillInfo.gst || '',
      });
      console.log(
        this.commonServ.currBillInfo.medicineDetails,
        this.medicinesArr
      );

      this.commonServ.currBillInfo.medicineDetails.forEach((element: any) => {
        const selectedMedicine = this.medicinesArr.find(
          (med: any) => med._id === element.medicineId
        );
        console.log(selectedMedicine);

        this.medicineDetails.push(
          this.fb.group({
            medicineId: selectedMedicine._id,
            quantity: element.quantity,
            price: element.price,
          })
        );
        console.log(element._id);
      });

      this.alert.showAlert = true;
    }
  }

  // getMedNameById(id: any){

  // }

  async getAllMedicines() {
    try {
      const res: any = await firstValueFrom(
        this.apiService.get(endPoints.medicines)
      );

      if (res.status === 200) {
        this.medicinesArr = res.medicines;
      } else {
        Swal.fire('Error!', 'Error fetching medicines', 'error');
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      Swal.fire('Error!', 'Error fetching medicines', 'error');
    }
  }

  addMedicine() {
    this.medicineDetails.push(this.createMedicineItem());
  }

  // Function to remove a medicine item from the medicineDetails FormArray
  removeMedicine(index: number) {
    this.medicineDetails.removeAt(index);
  }

  // Helper function to create a new FormGroup for a medicine item
  createMedicineItem() {
    return this.fb.group({
      medicineId: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
    });
  }

  // calculateTotalAmount(): void {
  //   const { quantity, price, discount, gstRate } = this.medicineBillForm.value;
  //   const totalPrice = quantity * price;
  //   const discountedPrice = totalPrice - (totalPrice * discount) / 100;
  //   const gstAmount = (discountedPrice * gstRate) / 100;
  //   this.totalAmount = discountedPrice + gstAmount;

  //   this.medicineBillForm.patchValue({
  //     totalAmount: this.totalAmount,
  //   })
  // }

  calculateTotalAmount(): void {
    // Get the array of medicine details from the form
    const medicines = this.medicineDetails.controls;

    // Calculate the total amount
    let totalAmount = 0;

    for (const medicine of medicines) {
      const quantity = +medicine.get('quantity')?.value || 0;
      const price = +medicine.get('price')?.value || 0;

      totalAmount += quantity * price;
    }

    // Apply discount and GST
    const discount = +this.medicineBillFormFC['discount'].value || 0;
    const gstRate = +this.medicineBillFormFC['gstRate'].value || 0;

    totalAmount = totalAmount - (totalAmount * discount) / 100; // Subtract discount
    totalAmount = totalAmount + (totalAmount * gstRate) / 100; // Add GST

    // Update the totalAmount control in the form
    this.medicineBillForm.patchValue({ totalAmount: totalAmount.toFixed(2) });
  }

  calculateSubtotal(): number {
    // Get the array of medicine details from the form
    const medicines = this.medicineDetails.controls;

    // Calculate the subtotal
    let subtotal = 0;

    for (const medicine of medicines) {
      const quantity = +medicine.get('quantity')?.value || 0;
      const price = +medicine.get('price')?.value || 0;

      subtotal += quantity * price;
    }

    return subtotal;
  }

  calculateDiscount(): number {
    const subtotal = this.calculateSubtotal();
    const discount = +this.medicineBillFormFC['discount'].value || 0;

    // Calculate the discount amount
    return (subtotal * discount) / 100;
  }

  calculateGSTAmount(): number {
    const subtotal = this.calculateSubtotal();
    const discountAmount = this.calculateDiscount();
    const discountSubtotal = subtotal - discountAmount;

    const gstRate = +this.medicineBillFormFC['gstRate'].value || 0;

    // Calculate the GST amount
    return (discountSubtotal * gstRate) / 100;
  }

  onSubmit() {
    this.calculateTotalAmount();
    if (this.medicineBillForm.valid) {
      let body = {
        custName: this.medicineBillFormFC['patientName'].value || '',
        custEmail: this.medicineBillFormFC['patientEmail'].value || '',
        docName: this.medicineBillFormFC['doctorName'].value || '',
        custAddress: this.medicineBillFormFC['patientAddress'].value || '',
        medicineCount:
          this.medicineBillFormFC['medicineDetails'].value.length || '',
        medicineDetails: this.medicineBillFormFC['medicineDetails'].value || '',
        subTotal: this.calculateSubtotal(),
        totalAmount: this.medicineBillFormFC['totalAmount'].value || '',
        gst: this.medicineBillFormFC['gstRate'].value || '',
        discount: this.medicineBillFormFC['discount'].value || '',
      };
      console.log(this.page, body, this.medicineBillForm);

      let URL =
        this.page == 'view'
          ? `${endPoints.updateBill}/${this.commonServ.currBillInfo._id}`
          : endPoints.saveBill;

      this.apiService.post(URL, body).subscribe((res: any) => {
        if (res.status == 200) {
          this.alert = {
            showAlert: true,
            alertMsg: `Bill ${this.page == 'view' ? `Updated` : `Saved`}`,
            alertType: 'success',
          };
          this.medicineBillForm.reset();
          // this.router.navigate(['dashboard'])
        } else {
          this.alert = {
            showAlert: true,
            alertMsg: 'Error Bill Saving!',
            alertType: 'error',
          };
        }
      });
    }
  }
}
