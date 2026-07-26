import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { Project, ProjectDetail, CreateProjectRequest, UpdateProjectRequest, ApiResult, PagedResult } from '../models/project.model';
import { TaskItem } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly apiUrl = 'http://localhost:5000/api/projects';

  constructor(private http: HttpClient) {}

  getAll(pageNumber: number = 1, pageSize: number = 6, search: string = ''): Observable<ApiResult<PagedResult<Project>>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ApiResult<PagedResult<Project>>>(this.apiUrl, { params }).pipe(timeout(8000));
  }

  getById(id: string): Observable<ApiResult<ProjectDetail>> {
    return this.http.get<ApiResult<ProjectDetail>>(`${this.apiUrl}/${id}`).pipe(timeout(8000));
  }

  create(dto: CreateProjectRequest): Observable<ApiResult<Project>> {
    return this.http.post<ApiResult<Project>>(this.apiUrl, dto).pipe(timeout(8000));
  }

  update(id: string, dto: UpdateProjectRequest): Observable<ApiResult<void>> {
    return this.http.put<ApiResult<void>>(`${this.apiUrl}/${id}`, dto).pipe(timeout(8000));
  }

  delete(id: string): Observable<ApiResult<void>> {
    return this.http.delete<ApiResult<void>>(`${this.apiUrl}/${id}`).pipe(timeout(8000));
  }

  getProjectTasks(id: string, status?: string, pageNumber: number = 1, pageSize: number = 6): Observable<ApiResult<PagedResult<TaskItem>>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (status && status !== 'All') {
      params = params.set('status', status);
    }

    return this.http.get<ApiResult<PagedResult<TaskItem>>>(`${this.apiUrl}/${id}/tasks`, { params }).pipe(timeout(8000));
  }
}
