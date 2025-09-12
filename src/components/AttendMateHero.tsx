import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Users, BookOpen, Trophy, MessageSquare, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-attendmate.jpg";

const AttendMateHero = () => {
  const features = [
    {
      icon: MapPin,
      title: "Geofencing Attendance",
      description: "Track attendance seamlessly with location-based validation."
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Dedicated dashboards for students, teachers, and admins."
    },
    {
      icon: BookOpen,
      title: "Digital Notes",
      description: "Organized, subject-wise resources for smarter learning."
    },
    {
      icon: Trophy,
      title: "Gamification",
      description: "Motivate with streaks, badges, and leaderboards."
    },
    {
      icon: MessageSquare,
      title: "Communication",
      description: "Announcements and doubt discussions made easy."
    },
    {
      icon: Calendar,
      title: "Event Management",
      description: "Stay updated with timelines and institutional events."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 bg-background/30 backdrop-blur-md sticky top-0 z-50 border-b border-border/40">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-primary rounded-lg flex items-center justify-center shadow-sm">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">AttendMate</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" className="text-foreground hover:bg-background/20 transition-colors">
            About
          </Button>
          <Button className="bg-gradient-primary text-lg px-6 shadow-lg hover:opacity-90 transition-all">
            Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Block */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-foreground">
                Smart Attendance
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Simplified for Everyone
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Redefining classroom management with intelligent attendance, 
                seamless communication, and engaging gamified learning.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-md text-lg px-10 py-6 rounded-xl">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 rounded-xl border-2 hover:bg-background/30">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-12 pt-4">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-secondary">500+</div>
                <div className="text-sm text-muted-foreground">Institutions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-accent">99.9%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20"></div>
            <img
              src={heroImage}
              alt="AttendMate Hero"
              className="relative rounded-3xl shadow-xl w-full h-auto ring-1 ring-border/20"
            />
          </div>
        </div>

        {/* Features */}
        <div className="mt-28">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Everything You Need, In One Place
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Streamlined tools for institutions to empower learning with 
              efficiency, accessibility, and innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 bg-background/40 backdrop-blur-sm border border-border/40 hover:shadow-lg hover:bg-background/60 transition-all rounded-2xl"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center shadow-sm">
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
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
