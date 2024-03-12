import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { endPoints } from 'src/app/shared/endPoints';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
})
export class ViewProductComponent implements OnInit, OnDestroy {
  pageTitle: string = 'All Products';
  extraTitle: string = 'View Products';
  medicinesArr: any = [];
  constructor(
    private apiService: ApiService,
    private commonServ: CommonService,
    private route: Router
  ) {}

  ngOnDestroy(): void {
    this.commonServ.currProductInfo = null;
  }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.apiService.get(endPoints.medicines).subscribe((res: any) => {
      if (res.status === 200) {
        this.medicinesArr = res.medicines;
      } else {
        Swal.fire('Oops..', 'Medicines Fetch Error!', 'error');
      }
    });
  }

  viewProduct(prod: any) {
    console.log(prod);
    this.commonServ.currProductInfo = prod;
    this.route.navigate(['viewProduct'], { queryParams: { page: 'view' } });
  }

  addProduct(){
    this.route.navigate(['addProduct']);
  }

  async confirmDelete(id: any, name: any, page: any) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      this.apiService
        .get(`${endPoints.deleteMedicine}/${id}`)
        .subscribe((res) => {
          if (res.status == 200) {
            Swal.fire('Success', `${name} Deleted`, 'success');
            this.getAllProducts();
          }
        });
    }
  }


}
