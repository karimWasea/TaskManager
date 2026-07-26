import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsListComponent } from './features/projects-list/projects-list.component';
import { ProjectDetailComponent } from './features/project-detail/project-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  { path: 'projects', component: ProjectsListComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
  { path: '**', redirectTo: 'projects' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
