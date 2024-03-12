import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { endPoints } from 'src/app/shared/endPoints';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup = this.fb.group({
    isExisitngBrand: [null],
    brand: ['', Validators.required],
    name: ['', Validators.required],
    expiry: ['', Validators.required],
    mrp: ['', Validators.required],
    batch: ['', Validators.required],
    remarks: ['', Validators.required],
  });

  get prodFormFC() {
    return this.productForm.controls;
  }

  page: string = '';
  pageTitle: string = '';
  extraTitle: string = '';
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private commonServ: CommonService
  ) {
    this.route.queryParams.subscribe((params) => {
      const page = params['page'];
      this.page = page;
      if (page === 'view' && !this.commonServ.currProductInfo) {
        this.router.navigate(['dashboard']);
      }
      page === 'view'
        ? (this.pageTitle = 'Edit Product') &&
          (this.extraTitle = 'Product Details')
        : (this.pageTitle = 'Add Product') &&
          (this.extraTitle = 'New Product');
    });
  }

  ngOnInit(): void {
    this.allSubscriptions();
    if (this.commonServ.currProductInfo) {
      const expiryString = this.commonServ.currProductInfo.expiry || '';
      const expiryDate = new Date(expiryString);

      // Format the date manually to 'YYYY-MM-DD'
      const formattedExpiry =
        expiryDate.getFullYear() +
        '-' +
        ('0' + (expiryDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + expiryDate.getDate()).slice(-2);

      this.productForm.patchValue({
        brand: this.commonServ.currProductInfo.brand || '',
        name: this.commonServ.currProductInfo.name || '',
        expiry: formattedExpiry || null,
        mrp: this.commonServ.currProductInfo.mrp || '',
        batch: this.commonServ.currProductInfo.batch || '',
        remarks: this.commonServ.currProductInfo.remarks || '',
      });
    }
  }

  matches: any[] = [];
  brandNamesArr: any[] = [];
  allSubscriptions() {
    if (this.prodFormFC['isExistingBrand']?.value) {
      this.productForm
        .get('brand')!
        .valueChanges.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((input: string) =>
            this.apiService.get(`${endPoints.findByBrand}?brandName=${input}`)
          )
        )
        .subscribe((res) => {
          this.matches = res?.brandNames;
        });
    }
  }

  isExistingBrandCheck(event: any) {
    this.prodFormFC['brand'].reset();
    this.apiService.get(`${endPoints.getAllBrandNames}`).subscribe((res) => {
      if (res.status == 200) {
        this.brandNamesArr = res.brandNames;
      } else {
        Swal.fire('Oops...', 'Error fetching companies', 'error');
      }
    });
  }

  onSubmit() {
    console.log(this.productForm, this.prodFormFC);
    if (this.productForm.valid) {

      let URL =
        this.page === 'view'
          ? `${endPoints.updateMedicine}/${this.commonServ.currProductInfo._id}`
          : endPoints.addMedicine;

      const expiryString = this.prodFormFC['expiry'].value || '';
      const expiryDate = new Date(expiryString);

      // Format the date manually to 'YYYY-MM-DD'
      const formattedExpiry =
        expiryDate.getFullYear() +
        '-' +
        ('0' + (expiryDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + expiryDate.getDate()).slice(-2);

      this.apiService
        .post(URL, {
          brand: this.prodFormFC['brand'].value,
          name: this.prodFormFC['name'].value,
          mrp: this.prodFormFC['mrp'].value,
          expiry: formattedExpiry,
          remarks: this.prodFormFC['remarks'].value,
          batch: this.prodFormFC['batch'].value,
        })
        .subscribe((res) => {
          if (res.status == 200) {
            Swal.fire(
              'Success',
              `Product(${this.prodFormFC['name'].value}) ${this.page==='view' ? 'Updated' : 'Added'} Successfully`,
              'success'
            );
            this.productForm.reset();
            this.router.navigate(['dashboard']);
          } else {
            Swal.fire('Error', `Not Added`, 'error');
          }
        });
    }
  }
}
