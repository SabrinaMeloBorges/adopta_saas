import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

const app = initializeApp(environment.firebase);
const auth = getAuth(app);
const firestore = getFirestore(app);

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private router: Router) {
    onAuthStateChanged(auth, user => this.userSubject.next(user));
  }

  async register(name: string, email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(firestore, 'users', credential.user.uid), {
      name, email, role: 'user', createdAt: new Date()
    });
    this.router.navigate(['/']);
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
    this.router.navigate(['/']);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    await setDoc(doc(firestore, 'users', credential.user.uid), {
      name: credential.user.displayName,
      email: credential.user.email,
      role: 'user', createdAt: new Date()
    }, { merge: true });
    this.router.navigate(['/']);
  }

  async logout() {
    await signOut(auth);
    this.router.navigate(['/login']);
  }
}