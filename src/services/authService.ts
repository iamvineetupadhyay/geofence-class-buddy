import { auth, db } from '@/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { AppUser } from '@/types';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  institution_id: string;
  role: 'student' | 'teacher' | 'admin';
  class_id?: number;
}

class AuthService {
  getCurrentUser() {
    return auth.currentUser;
  }

  // 🔹 Register new user and save role
  async register(userData: RegisterData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      if (userData.name) {
        await firebaseUpdateProfile(userCredential.user, { displayName: userData.name });
      }

      const appUser: AppUser = {
        uid: userCredential.user.uid,
        email: userData.email,
        displayName: userData.name,
        photoURL: userCredential.user.photoURL || '',
        role: userData.role,
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...appUser,
        phone: userData.phone,
        institution_id: userData.institution_id,
        class_id: userData.class_id || null,
        createdAt: new Date(),
      });

      return { success: true, data: appUser };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // 🔹 Login with email & password
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, 'users', userCredential.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() as AppUser };
      }

      return { success: false, error: 'User profile not found in Firestore' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // 🔹 Google Sign-In
  async googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      let appUser: AppUser;

      if (!docSnap.exists()) {
        appUser = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          role: 'student', // default
        };

        await setDoc(docRef, {
          ...appUser,
          phone: '',
          institution_id: '',
          class_id: null,
          createdAt: new Date(),
        });
      } else {
        appUser = docSnap.data() as AppUser;
      }

      return { success: true, data: appUser };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // 🔹 Logout
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // 🔹 Update profile
  async updateProfile(updates: { displayName?: string; photoURL?: string }) {
    if (!auth.currentUser) return { success: false, error: 'No user logged in' };
    try {
      await firebaseUpdateProfile(auth.currentUser, updates);

      const docRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(docRef, updates, { merge: true });

      const updatedDoc = await getDoc(docRef);
      return { success: true, data: updatedDoc.data() as AppUser };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export const authService = new AuthService();
