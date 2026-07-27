import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './app/auth.interceptor';
import { AuthGuard } from './app/services/auth/auth.guard';
import { AuthService } from './app/services/auth/auth.service';
import { UserService } from './app/services/LupinoApi/user.service';
import { APP_INITIALIZER, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { AdminGuard } from './app/services/auth/admin.guard';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { AppRoutingModule } from './app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app/app.component';
import { initApp } from './app/app.module';
import { MJGuard } from './app/services/auth/mj.guard';

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(
			BrowserModule,
			MatButtonModule,
			MatInputModule,
			MatSliderModule,
			AppRoutingModule,
			HttpClientModule,
			ReactiveFormsModule,
			FormsModule,
			QuillModule.forRoot(),
			ToastrModule.forRoot({
				positionClass: 'toast-top-center',
				timeOut: 3000,
				preventDuplicates: true,
			}),
		),

		{
			provide: APP_INITIALIZER,
			useFactory: initApp,
			deps: [AuthService],
			multi: true,
		},

		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
		AuthGuard,
		AuthService,
		MJGuard,
		UserService,
		{ provide: LOCALE_ID, useValue: 'fr' },
		AdminGuard,
		provideAnimations(),
	],
}).catch((err) => console.error(err));
