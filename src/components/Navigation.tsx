import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Trophy, 
  Users, 
  Settings, 
  LogOut,
  Home,
  FileText,
  Star,
  MapPin
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const { user, logout } = useAuth();

  const getNavigationItems = () => {
    const commonItems = [
      { key: 'home', icon: Home, label: 'Home' },
      { key: 'profile', icon: User, label: 'Profile' },
    ];

    if (user?.role === 'student') {
      return [
        ...commonItems,
        { key: 'attendance', icon: Calendar, label: 'Attendance' },
        { key: 'notes', icon: BookOpen, label: 'Notes' },
        { key: 'doubts', icon: MessageSquare, label: 'Doubts' },
        { key: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
        { key: 'events', icon: Star, label: 'Events' },
      ];
    }

    if (user?.role === 'teacher') {
      return [
        ...commonItems,
        { key: 'classes', icon: Calendar, label: 'My Classes' },
        { key: 'notes', icon: BookOpen, label: 'Notes' },
        { key: 'communication', icon: MessageSquare, label: 'Communication' },
        { key: 'analytics', icon: Trophy, label: 'Analytics' },
        { key: 'faculty', icon: Users, label: 'Faculty' },
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...commonItems,
        { key: 'users', icon: Users, label: 'Manage Users' },
        { key: 'analytics', icon: Trophy, label: 'Analytics' },
        { key: 'events', icon: Star, label: 'Events' },
        { key: 'settings', icon: Settings, label: 'Settings' },
      ];
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <Card className="w-64 h-screen fixed left-0 top-0 z-10">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">AttendMate</h2>
            <p className="text-sm text-muted-foreground">
              {user?.name} ({user?.role})
            </p>
          </div>

          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.key}
                  variant={currentView === item.key ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onNavigate(item.key)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          <div className="mt-auto pt-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Navigation;