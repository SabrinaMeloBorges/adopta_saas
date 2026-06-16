import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, getDocs,
  getDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

const app = initializeApp(environment.firebase);
const firestore = getFirestore(app);
const storage = getStorage(app);

export interface Pet {
  id?: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  description: string;
  photos: string[];
  status: string;
  shelterId: string;
  shelterName: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class PetService {

  async getAll(filters?: { species?: string; status?: string }) {
    let q: any = collection(firestore, 'pets');
    if (filters?.species) {
      q = query(collection(firestore, 'pets'), where('species', '==', filters.species));
    }
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Pet));
  }

  async getById(id: string) {
    const snap = await getDoc(doc(firestore, 'pets', id));
    return snap.exists() ? { id: snap.id, ...(snap.data() as any) } as Pet : null;
  }

  async create(pet: Omit<Pet, 'id'>) {
    return addDoc(collection(firestore, 'pets'), pet);
  }

  async update(id: string, data: Partial<Pet>) {
    return updateDoc(doc(firestore, 'pets', id), data as any);
  }

  async delete(id: string) {
    return deleteDoc(doc(firestore, 'pets', id));
  }

  async uploadPhoto(file: File, petId: string): Promise<string> {
    const storageRef = ref(storage, `pets/${petId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }
}