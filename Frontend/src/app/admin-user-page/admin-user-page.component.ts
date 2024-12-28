import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';
import {AllCommunityModule, ColDef, ISelectCellEditorParams, ModuleRegistry} from 'ag-grid-community';
import {User} from '../../generated';
import {UsersService} from '../api/users.service';
import {AdminNavBarComponent} from '../admin-nav-bar/admin-nav-bar.component';
ModuleRegistry.registerModules([AllCommunityModule]);



@Component({
  selector: 'app-admin-user-page',
  standalone: true,
  imports: [
    AgGridAngular,
    AdminNavBarComponent
  ],
  templateUrl: './admin-user-page.component.html',
  styleUrl: './admin-user-page.component.css',
})
export class AdminUserPageComponent implements OnInit{
  users: User[] = [];

  @ViewChild('orderModal', { static: true }) orderModal!: TemplateRef<any>;

  columnDefs: ColDef[] = [
    {
      headerName: 'Actions',
      filter: false,
      cellRenderer: (params: any) => {
        return `
        <button class="btn btn-danger btn-sm me-1">Delete</button>
      `;
      },
      onCellClicked: (params: any) => {
        const action = params.event.target.innerText;
        if (action === 'Delete') {
          this.deleteUser(params.data.id);
        }
      },
    },
    { field: 'id', headerName: 'ID' },
    { field: 'name',
      headerName: 'Name',
      editable: true,
      cellEditor: 'agTextCellEditor',
    },
    { field: 'email',
      headerName: 'Email',
      editable: true,
      cellEditor: 'agTextCellEditor',
    },
    { field: 'role',
      headerName: 'Role',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['admin', 'customer']
      } as ISelectCellEditorParams
    },
  ];


  defaultColDef: ColDef = {filter: "agTextColumnFilter", floatingFilter: true,};
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public paginationPageSize = 10;

  constructor(private userService: UsersService) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Load all users
  loadUsers(): void {
    this.userService.getAllUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  // Update user
  onUserChanged(event: any): void {
    const updatedUser = event.data;

    // Check if new email is valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(updatedUser.email)) {
      console.error('Invalid email address:', updatedUser.email);
      this.loadUsers();
      return;
    }

    this.userService.updateUser(updatedUser.id, updatedUser.name, updatedUser.email, undefined, updatedUser.role).subscribe({
      next: (updated) => {
        console.log('User updated successfully:', updated);
        this.loadUsers();
      },
      error: (err) => {
        console.error('Failed to update user:', err);
      },
    });
  }

  // Delete user
  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        console.log(`User ${userId} deleted successfully`);
        this.loadUsers();
      },
      error: (err) => {
        console.error('Failed to delete user:', err);
      },
    });
  }

}
