import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth: Auth = inject(Auth);
  private readonly router = inject(Router);

  async register(email: string, password: string): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

    const user = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      registeredDate: new Date().toISOString(),
    };

    // Check session availability before using sessionStorage
    if (this.isSessionAvailable()) {
      sessionStorage.setItem('user', JSON.stringify(user));
    }

    alert('Registration successful!');
  }

  isSessionAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && window.sessionStorage != null;
    } catch (error) {
      return false;
    }
  }

  async login(email: string, password: string): Promise<void> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

    const user = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      registeredDate: userCredential.user.metadata.creationTime,
    };

    // Check session availability before using sessionStorage
    if (this.isSessionAvailable()) {
      sessionStorage.setItem('user', JSON.stringify(user));
    }

    alert('Login successful!');
  }

  async logout(): Promise<void> {
    try {
      await this.auth.signOut();

      if (this.isSessionAvailable()) {
        sessionStorage.removeItem('user');
      }

      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  }
}
