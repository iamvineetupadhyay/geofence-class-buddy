import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Settings } from "lucide-react";

interface RoleSelectorProps {
  onRoleSelect: (role: 'student' | 'teacher' | 'admin') => void;
}

const RoleSelector = ({ onRoleSelect }: RoleSelectorProps) => {
  const roles = [
    {
      id: 'student' as const,
      title: 'Student',
      description: 'Mark attendance, view notes, participate in discussions',
      icon: GraduationCap,
      color: 'bg-gradient-primary',
      features: ['Geofenced Attendance', 'Access Notes & Resources', 'Submit Doubts', 'View Announcements', 'Track Progress & Badges']
    },
    {
      id: 'teacher' as const,
      title: 'Teacher',
      description: 'Manage classes, share resources, track student progress',
      icon: BookOpen,
      color: 'bg-gradient-secondary',
      features: ['Create Sessions', 'Upload Notes & Materials', 'Send Announcements', 'View Analytics', 'Manage Student Doubts']
    },
    {
      id: 'admin' as const,
      title: 'Admin/Operator',
      description: 'System administration and institutional management',
      icon: Settings,
      color: 'bg-gradient-accent',
      features: ['User Management', 'System Analytics', 'Event Management', 'Faculty Directory', 'Institution Settings']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Role
          </h1>
          <p className="text-xl text-muted-foreground">
            Select your role to access the appropriate dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <Card key={role.id} className="p-8 bg-background/10 backdrop-blur-sm border-0 hover:bg-background/20 transition-smooth group cursor-pointer">
              <div className="text-center space-y-6">
                <div className={`w-20 h-20 ${role.color} rounded-2xl mx-auto flex items-center justify-center group-hover:shadow-glow transition-smooth`}>
                  <role.icon className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">
                    {role.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {role.description}
                  </p>
                </div>

                <div className="space-y-3 text-left">
                  <h4 className="font-semibold text-foreground text-center">Key Features:</h4>
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={() => onRoleSelect(role.id)}
                  className={`w-full ${role.color} hover:opacity-90 shadow-medium text-lg py-6`}
                >
                  Continue as {role.title}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" className="text-lg px-8 border-2">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;