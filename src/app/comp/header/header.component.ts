import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('toggleButton') toggleButton!: ElementRef;
  @Input() page: string | undefined;
  pageType: string | undefined;
  currentRoute: string = '';
  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.router.url;
        console.log(`Current Route: ${this.currentRoute}`);
      });
  }

  ngOnInit(): void {
    this.pageType = this.page;
  }

  logout() {
    this.toggleButton.nativeElement.click();
    sessionStorage.removeItem('auth-token');
    this.router.navigate(['login']);
  }
}
