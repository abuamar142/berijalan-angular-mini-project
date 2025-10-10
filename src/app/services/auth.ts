import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private auth?: Auth;

  constructor() {
    // Only initialize Firebase Auth in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.auth = inject(Auth);
    }
  }

  async register(email: string, password: string): Promise<void> {
    if (!this.auth) {
      throw new Error('Firebase Auth not available in server environment');
    }

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

  isAuthenticated(): boolean {
    return this.isSessionAvailable() && sessionStorage.getItem('user') != null;
  }

  async login(email: string, password: string): Promise<void> {
    if (!this.auth) {
      throw new Error('Firebase Auth not available in server environment');
    }

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
      if (this.auth) {
        await this.auth.signOut();
      }

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
