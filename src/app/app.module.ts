import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './comp/header/header.component';
import { SidebarComponent } from './comp/sidebar/sidebar.component';
import { FooterComponent } from './comp/footer/footer.component';
import { DashboardComponent } from './comp/dashboard/dashboard.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AddProductComponent } from './comp/sharedComponents/add-product/add-product.component';
import { BillComponent } from './comp/sharedComponents/bill/bill.component';
import { ChallanComponent } from './comp/sharedComponents/challan/challan.component';
import { BreadcrumComponent } from './comp/sharedComponents/breadcrum/breadcrum.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewProductComponent } from './comp/sharedComponents/view-product/view-product.component';
import { ViewBillComponent } from './comp/sharedComponents/view-bill/view-bill.component';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './products/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    AddProductComponent,
    BillComponent,
    ChallanComponent,
    BreadcrumComponent,
    ViewProductComponent,
    ViewBillComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
