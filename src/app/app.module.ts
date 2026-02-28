import { AuthService } from './services/auth/auth.service';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr, 'fr');

export function initApp(authService: AuthService) {
	return () => authService.autoLogin();
}
