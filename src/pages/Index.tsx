import { useState } from "react";
import AttendMateHero from "@/components/AttendMateHero";
import RoleSelector from "@/components/RoleSelector";
import StudentDashboard from "@/components/StudentDashboard";
import TeacherDashboard from "@/components/TeacherDashboard";
import AdminDashboard from "@/components/AdminDashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<'hero' | 'role-selector' | 'student' | 'teacher' | 'admin'>('hero');

  const handleGetStarted = () => {
    setCurrentView('role-selector');
  };

  const handleRoleSelect = (role: 'student' | 'teacher' | 'admin') => {
    setCurrentView(role);
  };

  const handleBackToHome = () => {
    setCurrentView('hero');
  };

  if (currentView === 'hero') {
    return (
      <div onClick={handleGetStarted}>
        <AttendMateHero />
      </div>
    );
  }

  if (currentView === 'role-selector') {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  if (currentView === 'student') {
    return <StudentDashboard />;
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
