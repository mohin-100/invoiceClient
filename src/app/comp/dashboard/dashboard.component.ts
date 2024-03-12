import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { endPoints } from 'src/app/shared/endPoints';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    // Add more sample data as needed
  ];

  randomQuote: {
    quote: any;
    author: any;
  } = {
    quote: '',
    author: '',
  };

  recentMeds: any;
  recentBills: any;
  notes: string[] = [];
  newNote: string = '';
  constructor(
    private apiService: ApiService,
    private route: Router,
    public commonServ: CommonService
  ) {}

  ngOnInit(): void {
    console.log('Dashboard Comp Loaded');
    this.getRecentAddedMedicines();
    this.getRecentBills();
    this.getRandomQoutes();
    this.loadNotes();
    // this.getAllMedicines();
  }

  addNote() {
    if (this.newNote.trim() !== '') {
      this.notes.push(this.newNote.trim());
      this.saveNotes();
      this.newNote = '';
    }
  }

  deleteNote(index: number) {
    this.notes.splice(index, 1);
    this.saveNotes();
  }

  private saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  private loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    this.notes = savedNotes ? JSON.parse(savedNotes) : [];
  }

  getRandomQoutes() {
    this.apiService.get(endPoints.getRandomQoutes).subscribe((res) => {
      if (res.status == 200) {
        this.randomQuote = {
          quote: res.data.quote,
          author: res.data.author,
        };
      }
    });
  }

  viewProduct(prod: any) {
    console.log(prod);
    this.commonServ.currProductInfo = prod;
    this.route.navigate(['viewProduct'], { queryParams: { page: 'view' } });
  }

  viewBill(bill: any) {
    console.log(bill);
    this.commonServ.currBillInfo = bill;
    this.route.navigate(['viewBill'], { queryParams: { page: 'view' } });
  }

  goToRoute(route: any) {
    this.route.navigate([route]);
  }

  async confirmDelete(id: any,name: any, page: any) {
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
      // User confirmed the delete action
      let URL =
        page == 'bill'
          ? `${endPoints.deleteBill}/${id}`
          : `${endPoints.deleteMedicine}/${id}`;

      this.apiService
        .get(`${URL}`)
        .subscribe((res) => {
          if (res.status == 200) {
            Swal.fire('Success', `${name} Deleted`, 'success');
            page == 'bill'
              ? this.getRecentBills()
              : this.getRecentAddedMedicines();
            ;
          }
        });
    }
  }

  getRecentAddedMedicines() {
    this.apiService.get(endPoints.getRecent).subscribe((res) => {
      if (res.status == 200) {
        this.recentMeds = res.medicines;
      } else {
        Swal.fire({
          title: 'Recent Medicines!',
          text: 'Unable to fetch!',
          icon: 'error',
        });
      }
    });
  }

  getRecentBills() {
    this.apiService.get(endPoints.getRecentBills).subscribe((res) => {
      if (res.status == 200) {
        this.recentBills = res.bills;
      } else {
        Swal.fire({
          title: 'Recent Bills!',
          text: 'Unable to fetch!',
          icon: 'error',
        });
      }
    });
  }

  getAllMedicines() {
    this.apiService.get(endPoints.medicines).subscribe((res) => {
      if (res.status == 200) {
        this.recentMeds = res.medicines;
      } else {
        Swal.fire({
          title: 'Recent Medicines!',
          text: 'Unable to fetch!',
          icon: 'error',
        });
      }
    });
  }
}
