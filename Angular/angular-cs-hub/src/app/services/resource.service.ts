import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Resource, ResourceType, DifficultyLevel } from '@models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private apiUrl = `${environment.apiUrl}/resources`;

  constructor(private http: HttpClient) { }

  getResources(
    categoryId?: number, 
    resourceType?: ResourceType,
    difficultyLevel?: DifficultyLevel,
    isFeatured?: boolean,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<{ resources: Resource[], totalCount: number }> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    if (categoryId) params = params.set('categoryId', categoryId.toString());
    if (resourceType) params = params.set('resourceType', resourceType);
    if (difficultyLevel) params = params.set('difficultyLevel', difficultyLevel);
    if (isFeatured !== undefined) params = params.set('isFeatured', isFeatured.toString());
    
    return this.http.get<{ resources: Resource[], totalCount: number }>(this.apiUrl, { params });
  }

  getResourceById(id: number): Observable<Resource> {
    return this.http.get<Resource>(`${this.apiUrl}/${id}`);
  }

  getResourceBySlug(slug: string): Observable<Resource> {
    return this.http.get<Resource>(`${this.apiUrl}/slug/${slug}`);
  }

  getFeaturedResources(limit: number = 6): Observable<Resource[]> {
    const params = new HttpParams()
      .set('isFeatured', 'true')
      .set('pageSize', limit.toString());
    
    return this.http.get<Resource[]>(`${this.apiUrl}/featured`, { params });
  }

  getLatestResources(limit: number = 10): Observable<Resource[]> {
    const params = new HttpParams()
      .set('pageSize', limit.toString())
      .set('sortBy', 'publicationDate')
      .set('sortDirection', 'desc');
    
    return this.http.get<Resource[]>(`${this.apiUrl}/latest`, { params });
  }

  getCourses(categoryId?: number, difficultyLevel?: DifficultyLevel): Observable<Resource[]> {
    let params = new HttpParams()
      .set('resourceType', ResourceType.Course);
    
    if (categoryId) params = params.set('categoryId', categoryId.toString());
    if (difficultyLevel) params = params.set('difficultyLevel', difficultyLevel);
    
    return this.http.get<Resource[]>(`${this.apiUrl}/courses`, { params });
  }

  getTutorials(categoryId?: number, difficultyLevel?: DifficultyLevel): Observable<Resource[]> {
    let params = new HttpParams()
      .set('resourceType', ResourceType.Tutorial);
    
    if (categoryId) params = params.set('categoryId', categoryId.toString());
    if (difficultyLevel) params = params.set('difficultyLevel', difficultyLevel);
    
    return this.http.get<Resource[]>(`${this.apiUrl}/tutorials`, { params });
  }

  searchResources(query: string): Observable<Resource[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Resource[]>(`${this.apiUrl}/search`, { params });
  }

  createResource(resource: Partial<Resource>): Observable<Resource> {
    return this.http.post<Resource>(this.apiUrl, resource);
  }

  updateResource(id: number, resource: Partial<Resource>): Observable<Resource> {
    return this.http.put<Resource>(`${this.apiUrl}/${id}`, resource);
  }

  deleteResource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  incrementViewCount(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/view`, {});
  }
}