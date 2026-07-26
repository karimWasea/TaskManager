import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { TaskItem, CreateTaskRequest, UpdateTaskRequest, UpdateTaskStatusRequest, TaskStatus } from '../models/task.model';
import { ApiResult, PagedResult } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) {}

  getAll(status?: TaskStatus, pageNumber: number = 1, pageSize: number = 6): Observable<ApiResult<PagedResult<TaskItem>>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<ApiResult<PagedResult<TaskItem>>>(this.apiUrl, { params }).pipe(timeout(8000));
  }

  getById(id: string): Observable<ApiResult<TaskItem>> {
    return this.http.get<ApiResult<TaskItem>>(`${this.apiUrl}/${id}`).pipe(timeout(8000));
  }

  create(dto: CreateTaskRequest): Observable<ApiResult<TaskItem>> {
    return this.http.post<ApiResult<TaskItem>>(this.apiUrl, dto).pipe(timeout(8000));
  }

  update(id: string, dto: UpdateTaskRequest): Observable<ApiResult<void>> {
    return this.http.put<ApiResult<void>>(`${this.apiUrl}/${id}`, dto).pipe(timeout(8000));
  }

  updateStatus(id: string, status: TaskStatus): Observable<ApiResult<void>> {
    const payload: UpdateTaskStatusRequest = { status };
    return this.http.patch<ApiResult<void>>(`${this.apiUrl}/${id}/status`, payload).pipe(timeout(8000));
  }

  delete(id: string): Observable<ApiResult<void>> {
    return this.http.delete<ApiResult<void>>(`${this.apiUrl}/${id}`).pipe(timeout(8000));
  }
}
