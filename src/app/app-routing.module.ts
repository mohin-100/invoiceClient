import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './comp/dashboard/dashboard.component';
import { AddProductComponent } from './comp/sharedComponents/add-product/add-product.component';
import { BillComponent } from './comp/sharedComponents/bill/bill.component';
import { ViewProductComponent } from './comp/sharedComponents/view-product/view-product.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'bill', component: BillComponent },
  { path: 'viewBill', component: BillComponent },
  { path: 'addProduct', component: AddProductComponent },
  { path: 'viewProduct', component: AddProductComponent },
  { path: 'viewAllProducts', component: ViewProductComponent },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./products/products.module').then((m) => m.ProductsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
