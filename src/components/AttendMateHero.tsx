import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Users, BookOpen, Trophy, MessageSquare, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-attendmate.jpg";

const AttendMateHero = () => {
  const features = [
    {
      icon: MapPin,
      title: "Geofencing Attendance",
      description: "Automatic attendance tracking with location validation"
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Students, teachers, and admin dashboards"
    },
    {
      icon: BookOpen,
      title: "Digital Notes",
      description: "Subject-wise organized resource sharing"
    },
    {
      icon: Trophy,
      title: "Gamification",
      description: "Streaks, badges, and leaderboards"
    },
    {
      icon: MessageSquare,
      title: "Communication",
      description: "Announcements and anonymous doubt submission"
    },
    {
      icon: Calendar,
      title: "Event Management",
      description: "Timeline feeds and institutional updates"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 bg-background/10 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">AttendMate</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-foreground hover:bg-background/20">
            About
          </Button>
          <Button className="bg-background text-foreground hover:bg-background/90 shadow-soft">
            Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Smart Attendance
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Revolutionize classroom management with geofencing attendance, 
                real-time communication, and gamified learning experiences.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-medium text-lg px-8">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">500+</div>
                <div className="text-sm text-muted-foreground">Institutions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">99.9%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20"></div>
            <img 
              src={heroImage} 
              alt="AttendMate Hero" 
              className="relative rounded-3xl shadow-strong w-full h-auto"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive classroom management solution with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-background/20 backdrop-blur-sm border-0 hover:bg-background/30 transition-smooth group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:shadow-glow transition-smooth">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendMateHero;