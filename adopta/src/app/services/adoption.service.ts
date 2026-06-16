import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, getDocs,
  updateDoc, doc, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

const app = initializeApp(environment.firebase);
const firestore = getFirestore(app);

export interface Adoption {
  id?: string;
  petId: string;
  petName: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  shelterId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class AdoptionService {

  async create(adoption: Omit<Adoption, 'id'>) {
    return addDoc(collection(firestore, 'adoptions'), adoption);
  }

  async getByRequester(requesterId: string) {
    const q = query(collection(firestore, 'adoptions'), where('requesterId', '==', requesterId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Adoption));
  }

  async getByShelter(shelterId: string) {
    const q = query(collection(firestore, 'adoptions'), where('shelterId', '==', shelterId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Adoption));
  }

  async updateStatus(id: string, status: 'approved' | 'rejected') {
    return updateDoc(doc(firestore, 'adoptions', id), { status });
  }
}