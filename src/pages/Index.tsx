import { useState, useEffect } from "react";
import AttendMateHero from "@/components/AttendMateHero";
import RoleSelector from "@/components/RoleSelector";
import LoginForm from "@/components/LoginForm";
import StudentDashboardConnected from "@/components/StudentDashboardConnected";
import TeacherDashboard from "@/components/TeacherDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'hero' | 'role-selector' | 'login' | 'student' | 'teacher' | 'admin'>('hero');

  // Clear any invalid localStorage data on component mount
  useEffect(() => {
    const userStr = localStorage.getItem('attendmate_user');
    if (userStr === 'undefined' || userStr === 'null') {
      localStorage.removeItem('attendmate_user');
      localStorage.removeItem('attendmate_token');
    }
  }, []);

  const handleGetStarted = () => {
    if (user) {
      // If user is logged in, go directly to their dashboard
      setCurrentView(user.role);
    } else {
      // If not logged in, show role selector or login
      setCurrentView('role-selector');
    }
  };

  const handleRoleSelect = (role: 'student' | 'teacher' | 'admin') => {
    if (user && user.role === role) {
      // If user is logged in with matching role, go to dashboard
      setCurrentView(role);
    } else {
      // If not logged in or role mismatch, show login
      setCurrentView('login');
    }
  };

  const handleBackToHome = () => {
    setCurrentView('hero');
  };

  const handleLoginSuccess = () => {
    // Get the fresh user data from localStorage since state might not be updated yet
    const userStr = localStorage.getItem('attendmate_user');
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      try {
        const userData = JSON.parse(userStr);
        setCurrentView(userData.role);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('attendmate_user');
      }
    }
  };

  if (currentView === 'hero') {
    return (
      <div onClick={handleGetStarted}>
        <AttendMateHero />
      </div>
    );
  }

  if (currentView === 'role-selector') {
    return <RoleSelector onRoleSelect={handleRoleSelect} onBackToHome={handleBackToHome} />;
  }

  if (currentView === 'login') {
    return <LoginForm onSuccess={handleLoginSuccess} onBack={handleBackToHome} />;
  }

  if (currentView === 'student') {
    return <StudentDashboardConnected />;
  }

  if (currentView === 'teacher') {
    return <TeacherDashboard />;
  }

  if (currentView === 'admin') {
    return <AdminDashboard />;
  }

  return <AttendMateHero />;
};

export default Index;
