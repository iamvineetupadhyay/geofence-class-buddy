import { useState, useEffect } from "react";
import AttendMateHero from "@/components/AttendMateHero";
import RoleSelector from "@/components/RoleSelector";
import LoginForm from "@/components/LoginForm";
import StudentDashboardConnected from "@/components/StudentDashboardConnected";
import TeacherDashboard from "@/components/TeacherDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import Navigation from "@/components/Navigation";
import Profile from "@/pages/Profile";
import AttendancePage from "@/pages/AttendancePage";
import NotesPage from "@/pages/NotesPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import DoubtsPage from "@/pages/DoubtsPage";
import EventsPage from "@/pages/EventsPage";
import { useAuth } from "@/hooks/useAuth";
import { AppUser } from "@/types"; // make sure types.ts defines role

const Index = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<string>("hero");

  useEffect(() => {
    const userStr = localStorage.getItem("attendmate_user");
    if (userStr === "undefined" || userStr === "null") {
      localStorage.removeItem("attendmate_user");
      localStorage.removeItem("attendmate_token");
    }
  }, []);

  // Auto-redirect to dashboard whenever a valid user is set
  useEffect(() => {
    if (user) {
      // Type assertion: tell TS user is AppUser
      setCurrentView((user as AppUser).role || "home");
    }
  }, [user]);

  const handleGetStarted = () => {
    if (user) {
      setCurrentView((user as AppUser).role || "home");
    } else {
      setCurrentView("role-selector");
    }
  };

  const handleRoleSelect = (role: "student" | "teacher" | "admin") => {
    if (user && (user as AppUser).role === role) {
      setCurrentView("home");
    } else {
      setCurrentView("login");
    }
  };

  const handleBackToHome = () => setCurrentView("hero");

  const handleLoginSuccess = () => setCurrentView("home");

  const handleNavigate = (view: string) => setCurrentView(view);

  if (currentView === "hero") {
    return (
      <div onClick={handleGetStarted}>
        <AttendMateHero />
      </div>
    );
  }

  if (currentView === "role-selector") {
    return <RoleSelector onRoleSelect={handleRoleSelect} onBackToHome={handleBackToHome} />;
  }

  if (currentView === "login") {
    return <LoginForm onSuccess={handleLoginSuccess} onBack={handleBackToHome} />;
  }

  // If user is logged in, show navigation and appropriate page
  if (user) {
    const typedUser = user as AppUser;

    return (
      <div className="flex min-h-screen bg-gradient-hero/10">
        <Navigation currentView={currentView} onNavigate={handleNavigate} />
        <div className="flex-1 ml-64">
          {currentView === "home" && (
            <>
              {typedUser.role === "student" && <StudentDashboardConnected onNavigate={handleNavigate} />}
              {typedUser.role === "teacher" && <TeacherDashboard />}
              {typedUser.role === "admin" && <AdminDashboard />}
            </>
          )}
          {currentView === "profile" && <Profile />}
          {currentView === "attendance" && <AttendancePage />}
          {currentView === "notes" && <NotesPage />}
          {currentView === "leaderboard" && <LeaderboardPage />}
          {currentView === "classes" && <AttendancePage />}
          {currentView === "communication" && <div className="p-8">Communication feature coming soon...</div>}
          {currentView === "analytics" && <div className="p-8">Analytics feature coming soon...</div>}
          {currentView === "users" && <div className="p-8">User management coming soon...</div>}
          {currentView === "settings" && <div className="p-8">Settings coming soon...</div>}
          {currentView === "doubts" && <DoubtsPage />}
          {currentView === "events" && <EventsPage />}
          {currentView === "faculty" && <div className="p-8">Faculty directory coming soon...</div>}
        </div>
      </div>
    );
  }

  return <AttendMateHero />;
};

export default Index;
