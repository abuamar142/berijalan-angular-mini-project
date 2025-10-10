import { Component, inject, signal, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');

  user = {
    email: '',
    password: '',
  };

  async login() {
    try {
      this.isLoading.set(true);
      this.errorMessage.set('');

      await this.authService.login(this.user.email, this.user.password);

      this.router.navigate(['']);
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Set user-friendly error message based on Firebase error codes
      let errorMsg = 'Login failed. Please try again.';
      if (error?.code === 'auth/user-not-found' || error?.code === 'auth/wrong-password') {
        errorMsg = 'Invalid email or password. Please check your credentials.';
      } else if (error?.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (error?.code === 'auth/too-many-requests') {
        errorMsg = 'Too many failed attempts. Please try again later.';
      } else if (error?.code === 'auth/network-request-failed') {
        errorMsg = 'Network error. Please check your internet connection.';
      }
      
      this.errorMessage.set(errorMsg);
    } finally {
      this.isLoading.set(false);
    }
  }
}
