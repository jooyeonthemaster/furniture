'use client';

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import type { User, UserRole } from '@/types';
import { CartProvider } from '@/hooks/useCart';

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signInWithGoogle: (role?: UserRole) => Promise<User>;
  signUpWithEmail: (email: string, password: string, name: string, role?: UserRole) => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    firebaseUser: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Firestore에서 사용자 데이터 가져오기
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setState({
              user: userData,
              firebaseUser,
              loading: false,
              error: null
            });
          } else {
            // 사용자 데이터가 없으면 기본 데이터 생성
            const defaultUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '사용자',
              role: 'customer',
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), defaultUser);
            
            setState({
              user: defaultUser,
              firebaseUser,
              loading: false,
              error: null
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setState({
            user: null,
            firebaseUser: null,
            loading: false,
            error: '사용자 정보를 불러오는데 실패했습니다.'
          });
        }
      } else {
        setState({
          user: null,
          firebaseUser: null,
          loading: false,
          error: null
        });
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async (role: UserRole = 'customer') => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // 사용자 데이터 확인/생성
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      let userData: User;
      
      if (userDoc.exists()) {
        userData = userDoc.data() as User;
      } else {
        userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '사용자',
          role,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await setDoc(userDocRef, userData);
      }
      
      setState({
        user: userData,
        firebaseUser,
        loading: false,
        error: null
      });
      
      return userData;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || '구글 로그인에 실패했습니다.'
      }));
      throw error;
    }
  };

  const signUpWithEmail = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole = 'customer'
  ) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      
      // 프로필 업데이트
      await updateProfile(firebaseUser, { displayName: name });
      
      // Firestore에 사용자 데이터 저장
      const userData: User = {
        id: firebaseUser.uid,
        email,
        name,
        role,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      setState({
        user: userData,
        firebaseUser,
        loading: false,
        error: null
      });
      
      return userData;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || '회원가입에 실패했습니다.'
      }));
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged에서 사용자 데이터를 자동으로 처리
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || '로그인에 실패했습니다.'
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || '로그아웃에 실패했습니다.'
      }));
    }
  };

  const updateUserRole = async (role: UserRole) => {
    if (!state.user || !state.firebaseUser) return;

    try {
      const updatedUser = {
        ...state.user,
        role,
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', state.user.id), updatedUser);
      
      setState(prev => ({
        ...prev,
        user: updatedUser
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || '역할 업데이트에 실패했습니다.'
      }));
    }
  };

  const value: AuthContextType = {
    ...state,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    updateUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
} 