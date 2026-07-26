import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { ProjectDetail } from '../../core/models/project.model';
import { TaskItem, TaskStatus, CreateTaskRequest } from '../../core/models/task.model';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
  standalone: false
})
export class ProjectDetailComponent implements OnInit {
  projectId: string = '';
  project: ProjectDetail | null = null;
  tasks: TaskItem[] = [];
  selectedStatusFilter: string = 'All'; // 'All' | 'ToDo' | 'InProgress' | 'Done'
  isLoading: boolean = true;
  errorMessage: string = '';

  // Task Pagination
  taskPageNumber: number = 1;
  taskPageSize: number = 6;
  totalTaskCount: number = 0;
  totalTaskPages: number = 1;
  hasPreviousTaskPage: boolean = false;
  hasNextTaskPage: boolean = false;

  // Project Edit State
  isEditingProject: boolean = false;
  editName: string = '';
  editDesc: string = '';

  // Task Add/Edit State
  isTaskModalOpen: boolean = false;
  editingTaskId: string | null = null;
  taskTitle: string = '';
  taskDescription: string = '';
  taskStatus: TaskStatus = 'ToDo';
  taskDueDate: string = '';
  isSavingTask: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    if (this.projectId) {
      this.loadProjectDetails();
    } else {
      this.router.navigate(['/projects']);
    }
  }

  loadProjectDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.projectService.getById(this.projectId).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.project = res.data;
          this.editName = res.data.name;
          this.editDesc = res.data.description;
          this.loadProjectTasks();
        } else {
          this.errorMessage = res.message || 'Failed to load project.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error loading project details', err);
        this.errorMessage = 'Project not found or failed to load.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadProjectTasks(): void {
    this.projectService.getProjectTasks(this.projectId, this.selectedStatusFilter, this.taskPageNumber, this.taskPageSize).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.tasks = res.data.items || [];
          this.totalTaskCount = res.data.totalCount;
          this.totalTaskPages = res.data.totalPages || 1;
          this.hasPreviousTaskPage = res.data.hasPreviousPage;
          this.hasNextTaskPage = res.data.hasNextPage;
        } else {
          this.tasks = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading tasks', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleEditProject(): void {
    this.isEditingProject = !this.isEditingProject;
    if (this.project && this.isEditingProject) {
      this.editName = this.project.name;
      this.editDesc = this.project.description;
    }
    this.cdr.detectChanges();
  }

  saveProject(): void {
    if (!this.editName.trim() || !this.project) return;
    this.projectService.update(this.project.id, {
      name: this.editName.trim(),
      description: this.editDesc.trim()
    }).subscribe({
      next: () => {
        this.isEditingProject = false;
        this.loadProjectDetails();
      },
      error: (err) => alert('Failed to update project.')
    });
  }

  deleteProject(): void {
    if (this.project && confirm(`Delete project "${this.project.name}" and all associated tasks?`)) {
      this.projectService.delete(this.project.id).subscribe({
        next: () => this.router.navigate(['/projects']),
        error: (err) => alert('Failed to delete project.')
      });
    }
  }

  // Filter Tasks & Pagination
  setStatusFilter(status: string): void {
    this.selectedStatusFilter = status;
    this.taskPageNumber = 1;
    this.loadProjectTasks();
  }

  goToTaskPage(page: number): void {
    if (page < 1 || page > this.totalTaskPages) return;
    this.taskPageNumber = page;
    this.loadProjectTasks();
  }

  // Task Actions
  openAddTaskModal(): void {
    this.editingTaskId = null;
    this.taskTitle = '';
    this.taskDescription = '';
    this.taskStatus = 'ToDo';
    this.taskDueDate = '';
    this.isTaskModalOpen = true;
    this.cdr.detectChanges();
  }

  openEditTaskModal(task: TaskItem): void {
    this.editingTaskId = task.id;
    this.taskTitle = task.title;
    this.taskDescription = task.description;
    this.taskStatus = task.status;
    this.taskDueDate = task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : '';
    this.isTaskModalOpen = true;
    this.cdr.detectChanges();
  }

  closeTaskModal(): void {
    this.isTaskModalOpen = false;
    this.isSavingTask = false;
    this.editingTaskId = null;
    this.taskTitle = '';
    this.taskDescription = '';
    this.taskDueDate = '';
    this.cdr.detectChanges();
  }

  saveTask(): void {
    if (!this.taskTitle.trim()) return;

    const title = this.taskTitle.trim();
    const description = this.taskDescription.trim();
    const status = this.taskStatus;
    const dueDateVal = this.taskDueDate ? new Date(this.taskDueDate).toISOString() : null;
    const isEdit = !!this.editingTaskId;
    const taskId = this.editingTaskId;

    // Close modal & reset form
    this.closeTaskModal();

    if (isEdit && taskId) {
      this.taskService.update(taskId, {
        title,
        description,
        status,
        dueDate: dueDateVal
      }).subscribe({
        next: (res) => {
          this.loadProjectTasks();
        },
        error: (err) => {
          alert('Failed to update task: ' + (err?.error?.detail || err?.message || 'Server error'));
          this.loadProjectTasks();
        }
      });
    } else {
      const newTaskDto: CreateTaskRequest = {
        title,
        description,
        status,
        dueDate: dueDateVal,
        projectId: this.projectId
      };

      this.taskService.create(newTaskDto).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.loadProjectTasks();
          } else {
            alert('Failed to create task: ' + res.message);
            this.loadProjectTasks();
          }
        },
        error: (err) => {
          alert('Failed to create task: ' + (err?.error?.detail || err?.message || 'Server error'));
          this.loadProjectTasks();
        }
      });
    }
  }

  changeTaskStatus(task: TaskItem, event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value as TaskStatus;
    this.taskService.updateStatus(task.id, newStatus).subscribe({
      next: () => {
        task.status = newStatus;
        this.loadProjectTasks();
      },
      error: (err) => alert('Failed to update task status.')
    });
  }

  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.delete(taskId).subscribe({
        next: () => this.loadProjectTasks(),
        error: (err) => alert('Failed to delete task.')
      });
    }
  }
}
