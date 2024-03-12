import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrum',
  templateUrl: './breadcrum.component.html',
  styleUrls: ['./breadcrum.component.css'],
})
export class BreadcrumComponent implements OnInit {
  @Input() pageTitle: string | undefined;
  @Input() extraText: string | undefined;
  @Input() prevRoute: string | undefined;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToRoute(){
    this.router.navigate([this.prevRoute])
  }
}
