import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from '../../button/button';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly authService: AuthService = inject(AuthService);

  constructor(private readonly router: Router) {}

  isLoading = signal(false);
  errorMessage = signal('');

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  async register() {
    if (this.registerForm.valid) {
      try {
        this.isLoading.set(true);
        this.errorMessage.set('');

        await this.authService.register(
          this.registerForm.value.email!,
          this.registerForm.value.password!
        );
        this.router.navigate(['']);
      } catch (error: any) {
        console.error('Registration failed:', error);

        // Set user-friendly error message based on Firebase error codes
        let errorMsg = 'Registration failed. Please try again.';
        if (error?.code === 'auth/email-already-in-use') {
          errorMsg =
            'This email is already registered. Please use a different email or try logging in.';
        } else if (error?.code === 'auth/invalid-email') {
          errorMsg = 'Please enter a valid email address.';
        } else if (error?.code === 'auth/weak-password') {
          errorMsg = 'Password is too weak. Please choose a stronger password.';
        } else if (error?.code === 'auth/network-request-failed') {
          errorMsg = 'Network error. Please check your internet connection.';
        }

        this.errorMessage.set(errorMsg);
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.errorMessage.set('Please fill in the form correctly.');
    }
  }
}
