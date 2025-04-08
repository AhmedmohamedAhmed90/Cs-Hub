import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Layout Components
import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { FooterComponent } from './components/layout/footer/footer.component';

// Page Components
import { HomeComponent } from './components/pages/home/home.component';
import { CoursesComponent } from './components/pages/courses/courses.component';
import { CourseDetailComponent } from './components/pages/course-detail/course-detail.component';
import { TutorialsComponent } from './components/pages/tutorials/tutorials.component';
import { TutorialDetailComponent } from './components/pages/tutorial-detail/tutorial-detail.component';
import { ResourcesComponent } from './components/pages/resources/resources.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';

// Shared Components
import { SearchComponent } from './components/shared/search/search.component';
import { CategoryTabsComponent } from './components/shared/category-tabs/category-tabs.component';
import { CourseCardComponent } from './components/shared/course-card/course-card.component';
import { TutorialCardComponent } from './components/shared/tutorial-card/tutorial-card.component';
import { ResourceCardComponent } from './components/shared/resource-card/resource-card.component';

// Services and Interceptors
import { AuthInterceptor } from './services/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    HomeComponent,
    CoursesComponent,
    CourseDetailComponent,
    TutorialsComponent,
    TutorialDetailComponent,
    ResourcesComponent,
    NotFoundComponent,
    LoginComponent,
    RegisterComponent,
    SearchComponent,
    CategoryTabsComponent,
    CourseCardComponent,
    TutorialCardComponent,
    ResourceCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }