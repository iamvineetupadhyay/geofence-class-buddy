import { useState, useEffect } from 'react';
import { authService, AuthResponse, LoginCredentials, RegisterData } from '@/services/authService';
import { User } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        setUser(response.data.user);
        toast({
          title: "Welcome back!",
          description: `Logged in as ${response.data.user?.name || 'User'}`,
        });
        return { success: true };
      } else {
        toast({
          title: "Login failed",
          description: response.error || "Invalid credentials",
          variant: "destructive",
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      if (response.success && response.data) {
        setUser(response.data.user);
        toast({
          title: "Registration successful!",
          description: `Welcome to AttendMate, ${response.data.user?.name || 'User'}!`,
        });
        return { success: true };
      } else {
        toast({
          title: "Registration failed",
          description: response.error || "Unable to create account",
          variant: "destructive",
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const updateProfile = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      const response = await authService.updateProfile(userData);
      if (response.success && response.data) {
        setUser(response.data);
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated",
        });
        return { success: true };
      } else {
        toast({
          title: "Update failed",
          description: response.error || "Unable to update profile",
          variant: "destructive",
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed';
      toast({
        title: "Update failed",
        description: message,
        variant: "destructive",
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };
};