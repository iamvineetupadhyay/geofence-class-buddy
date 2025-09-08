import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  BookOpen, 
  Trophy, 
  MessageSquare, 
  Clock,
  CheckCircle2,
  Star,
  TrendingUp
} from "lucide-react";

const StudentDashboard = () => {
  const todayClasses = [
    {
      subject: "Mathematics",
      time: "09:00 AM - 10:00 AM",
      teacher: "Dr. Sarah Johnson",
      room: "Room 101",
      status: "present" as const
    },
    {
      subject: "Physics",
      time: "10:30 AM - 11:30 AM", 
      teacher: "Prof. Michael Chen",
      room: "Lab 2A",
      status: "upcoming" as const
    },
    {
      subject: "Chemistry",
      time: "02:00 PM - 03:00 PM",
      teacher: "Dr. Emily Davis",
      room: "Lab 1B", 
      status: "upcoming" as const
    }
  ];

  const recentNotes = [
    { subject: "Mathematics", title: "Calculus - Integration Techniques", date: "2 hours ago" },
    { subject: "Physics", title: "Quantum Mechanics - Wave Functions", date: "1 day ago" },
    { subject: "Chemistry", title: "Organic Chemistry - Reactions", date: "2 days ago" }
  ];

  const achievements = [
    { title: "Perfect Week", description: "7 days perfect attendance", icon: Star, color: "text-warning" },
    { title: "Early Bird", description: "Always on time", icon: Clock, color: "text-primary" },
    { title: "Participation King", description: "Most doubts submitted", icon: MessageSquare, color: "text-accent" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary p-6 text-primary-foreground">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, Alex!</h1>
              <p className="opacity-90">Student ID: STU12345</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Today's Attendance</div>
              <div className="text-2xl font-bold">75%</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-20 bg-gradient-secondary hover:opacity-90 flex-col">
            <MapPin className="w-6 h-6 mb-2" />
            Mark Attendance
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <BookOpen className="w-6 h-6 mb-2" />
            View Notes
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <MessageSquare className="w-6 h-6 mb-2" />
            Submit Doubt
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <Trophy className="w-6 h-6 mb-2" />
            Leaderboard
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Today's Classes */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 shadow-soft">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Today's Classes
              </h2>
              <div className="space-y-4">
                {todayClasses.map((class_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-foreground">{class_.subject}</h3>
                        {class_.status === 'present' && (
                          <Badge className="bg-success text-success-foreground">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Present
                          </Badge>
                        )}
                        {class_.status === 'upcoming' && (
                          <Badge variant="outline">Upcoming</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {class_.time} • {class_.teacher} • {class_.room}
                      </p>
                    </div>
                    {class_.status === 'upcoming' && (
                      <Button size="sm" className="bg-gradient-primary">
                        Join Class
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Notes */}
            <Card className="p-6 shadow-soft">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" />
                Recent Notes
              </h2>
              <div className="space-y-3">
                {recentNotes.map((note, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg cursor-pointer transition-smooth">
                    <div>
                      <h3 className="font-medium text-foreground">{note.title}</h3>
                      <p className="text-sm text-muted-foreground">{note.subject} • {note.date}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Attendance Stats */}
            <Card className="p-6 shadow-soft">
              <h3 className="font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Attendance Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-semibold text-success">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-semibold text-primary">92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overall</span>
                  <span className="font-semibold">89%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary w-[89%]"></div>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6 shadow-soft">
              <h3 className="font-bold mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-primary" />
                Recent Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-muted/30`}>
                      <achievement.icon className={`w-4 h-4 ${achievement.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Current Streak */}
            <Card className="p-6 bg-gradient-secondary text-secondary-foreground shadow-soft">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">7</div>
                <div className="text-sm opacity-90">Day Streak</div>
                <div className="flex justify-center mt-3">
                  {[...Array(7)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current ml-1" />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;