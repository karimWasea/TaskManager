import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css'],
  standalone: false
})
export class ProjectsListComponent implements OnInit {
  projects: Project[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';

  // Pagination State
  pageNumber: number = 1;
  pageSize: number = 6;
  totalCount: number = 0;
  totalPages: number = 1;
  hasPreviousPage: boolean = false;
  hasNextPage: boolean = false;

  // Modal State
  isCreateModalOpen: boolean = false;
  newProjectName: string = '';
  newProjectDesc: string = '';
  isSubmitting: boolean = false;

  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.projectService.getAll(this.pageNumber, this.pageSize, this.searchTerm).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.projects = res.data.items || [];
          this.totalCount = res.data.totalCount;
          this.totalPages = res.data.totalPages || 1;
          this.hasPreviousPage = res.data.hasPreviousPage;
          this.hasNextPage = res.data.hasNextPage;
        } else {
          this.projects = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load projects', err);
        this.errorMessage = 'Could not fetch projects. Make sure backend is running on http://localhost:5000.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange(): void {
    this.pageNumber = 1;
    this.loadProjects();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
    this.loadProjects();
  }

  openCreateModal(): void {
    this.newProjectName = '';
    this.newProjectDesc = '';
    this.isSubmitting = false;
    this.isCreateModalOpen = true;
    this.cdr.detectChanges();
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
    this.isSubmitting = false;
    this.newProjectName = '';
    this.newProjectDesc = '';
    this.cdr.detectChanges();
  }

  createProject(): void {
    if (!this.newProjectName.trim()) return;
    
    const payload = {
      name: this.newProjectName.trim(),
      description: this.newProjectDesc.trim()
    };

    this.closeCreateModal();

    this.projectService.create(payload).subscribe({
      next: () => {
        this.loadProjects();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to create project.');
        this.loadProjects();
      }
    });
  }

  deleteProject(event: Event, project: Project): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete project "${project.name}" and all its tasks?`)) {
      this.projectService.delete(project.id).subscribe({
        next: () => this.loadProjects(),
        error: (err) => alert('Failed to delete project.')
      });
    }
  }
}
