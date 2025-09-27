import { useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase";
import { useToast } from "@/components/ui/use-toast";
import { AppUser } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

// ✅ Helper to safely map Firebase/User objects into AppUser
function toAppUser(
  user: any,
  role: "student" | "teacher" | "admin" = "student"
): AppUser {
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "Anonymous",
    photoURL: user.photoURL || undefined,
    role,
  };
}

export interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  register: (
    data: any
  ) => Promise<{ success: boolean; data?: AppUser; error?: any }>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: AppUser; error?: any }>;
  loginWithGoogle: () => Promise<{
    success: boolean;
    data?: AppUser;
    error?: any;
  }>;
  logout: () => Promise<void>;
  updateProfile: (
    updates: { displayName?: string; photoURL?: string }
  ) => Promise<{ success: boolean; data?: AppUser; error?: any }>;
}

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Listen to Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        const appUser = toAppUser(firebaseUser, "student"); // 👈 default role
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);



// Register
const register = async (data: any) => {
  setLoading(true);
  try {
    const response = await authService.register(data);
    if (response.success && response.data) {
      // Fetch the user document from Firestore to get the correct role
      const docRef = doc(db, "users", response.data.uid);
      const docSnap = await getDoc(docRef);
      const role = docSnap.exists() ? docSnap.data().role : "student";

      const appUser = toAppUser(response.data, role);
      setUser(appUser);

      toast({
        title: "Account created 🎉",
        description: "Welcome to the app!",
      });
      return { success: true, data: appUser };
    } else {
      toast({
        title: "Registration failed",
        description: response.error,
        variant: "destructive",
      });
      return { success: false, error: response.error };
    }
  } finally {
    setLoading(false);
  }
};


// Login
const login = async (email: string, password: string) => {
  setLoading(true);
  try {
    const response = await authService.login(email, password);
    if (response.success && response.data) {
      // Fetch the actual role from Firestore
      const appUser = await toAppUser(response.data);
      setUser(appUser);
      toast({ title: "Login successful ✅", description: "Welcome back!" });
      return { success: true, data: appUser };
    } else {
      toast({
        title: "Login failed",
        description: response.error,
        variant: "destructive",
      });
      return { success: false, error: response.error };
    }
  } finally {
    setLoading(false);
  }
};


  // Google Login
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const response = await authService.googleSignIn();
      if (response.success && response.data) {
        const appUser = toAppUser(response.data, "student");
        setUser(appUser);
        toast({
          title: "Welcome 🎉",
          description: `Logged in as ${
            response.data.displayName || response.data.email
          }`,
        });
        return { success: true, data: appUser };
      } else {
        toast({
          title: "Google Login failed",
          description: response.error || "Unable to login",
          variant: "destructive",
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Google login failed";
      toast({
        title: "Google Login failed",
        description: message,
        variant: "destructive",
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      toast({ title: "Logged out 👋" });
    } finally {
      setLoading(false);
    }
  };

  // Update Profile
  const updateProfile = async (updates: {
    displayName?: string;
    photoURL?: string;
  }) => {
    try {
      const response = await authService.updateProfile(updates);
      if (response.success && response.data) {
        const appUser = toAppUser(response.data, user?.role || "student");
        setUser(appUser);
        toast({ title: "Profile updated ✨" });
        return { success: true, data: appUser };
      } else {
        toast({
          title: "Profile update failed",
          description: response.error,
          variant: "destructive",
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Profile update failed";
      toast({
        title: "Profile update failed",
        description: message,
        variant: "destructive",
      });
      return { success: false, error: message };
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    loginWithGoogle,
    logout,
    updateProfile,
  };
}
