import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  BarChart3,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from "lucide-react";

const TeacherDashboard = () => {
  const upcomingClasses = [
    {
      subject: "Mathematics",
      class: "Class 10-A",
      time: "10:30 AM - 11:30 AM",
      studentsCount: 35,
      status: "upcoming" as const
    },
    {
      subject: "Advanced Mathematics", 
      class: "Class 12-B",
      time: "02:00 PM - 03:00 PM",
      studentsCount: 28,
      status: "upcoming" as const
    }
  ];

  const recentSessions = [
    {
      subject: "Mathematics",
      class: "Class 10-A", 
      date: "Today, 09:00 AM",
      attendance: 32,
      total: 35,
      percentage: 91
    },
    {
      subject: "Mathematics",
      class: "Class 10-B",
      date: "Yesterday, 11:00 AM", 
      attendance: 29,
      total: 33,
      percentage: 88
    }
  ];

  const pendingDoubts = [
    {
      question: "How to solve quadratic equations using the discriminant method?",
      student: "Anonymous",
      subject: "Mathematics",
      time: "30 minutes ago"
    },
    {
      question: "Can you explain the concept of derivatives in simple terms?",
      student: "John Doe",
      subject: "Mathematics", 
      time: "2 hours ago"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-secondary p-6 text-secondary-foreground">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome, Dr. Sarah Johnson</h1>
              <p className="opacity-90">Mathematics Department • EMP001</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Today's Classes</div>
              <div className="text-2xl font-bold">2</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-20 bg-gradient-primary hover:opacity-90 flex-col">
            <Calendar className="w-6 h-6 mb-2" />
            Start Session
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <Upload className="w-6 h-6 mb-2" />
            Upload Notes
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <MessageSquare className="w-6 h-6 mb-2" />
            Send Announcement
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <BarChart3 className="w-6 h-6 mb-2" />
            View Analytics
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Classes */}
            <Card className="p-6 shadow-soft">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Upcoming Classes
              </h2>
              <div className="space-y-4">
                {upcomingClasses.map((class_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-foreground">{class_.subject}</h3>
                        <Badge variant="outline">{class_.class}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {class_.time} • {class_.studentsCount} students
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Prepare
                      </Button>
                      <Button size="sm" className="bg-gradient-secondary">
                        Start Class
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Sessions */}
            <Card className="p-6 shadow-soft">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                Recent Sessions
              </h2>
              <div className="space-y-4">
                {recentSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-foreground">{session.subject}</h3>
                        <Badge variant="outline">{session.class}</Badge>
                        <Badge className={`${session.percentage >= 90 ? 'bg-success' : session.percentage >= 75 ? 'bg-warning' : 'bg-destructive'} text-white`}>
                          {session.percentage}% Attendance
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {session.date} • {session.attendance}/{session.total} present
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Student Doubts */}
            <Card className="p-6 shadow-soft">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                Pending Doubts ({pendingDoubts.length})
              </h2>
              <div className="space-y-4">
                {pendingDoubts.map((doubt, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <p className="text-foreground font-medium mb-2">{doubt.question}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>By: {doubt.student}</span>
                          <span>{doubt.subject}</span>
                          <span>{doubt.time}</span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-gradient-primary">
                        Reply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Class Performance */}
            <Card className="p-6 shadow-soft">
              <h3 className="font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Class Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Class 10-A</span>
                  <div className="text-right">
                    <span className="font-semibold text-success">92%</span>
                    <div className="h-2 bg-muted rounded-full w-16 mt-1">
                      <div className="h-full bg-success rounded-full w-[92%]"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Class 10-B</span>
                  <div className="text-right">
                    <span className="font-semibold text-warning">78%</span>
                    <div className="h-2 bg-muted rounded-full w-16 mt-1">
                      <div className="h-full bg-warning rounded-full w-[78%]"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Class 12-B</span>
                  <div className="text-right">
                    <span className="font-semibold text-primary">89%</span>
                    <div className="h-2 bg-muted rounded-full w-16 mt-1">
                      <div className="h-full bg-primary rounded-full w-[89%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 shadow-soft">
              <h3 className="font-bold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                Today's Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-sm text-muted-foreground">Classes Completed</span>
                  </div>
                  <span className="font-bold text-success">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Classes Remaining</span>
                  </div>
                  <span className="font-bold text-primary">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-warning" />
                    </div>
                    <span className="text-sm text-muted-foreground">Pending Doubts</span>
                  </div>
                  <span className="font-bold text-warning">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Users className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-sm text-muted-foreground">Total Students</span>
                  </div>
                  <span className="font-bold text-accent">96</span>
                </div>
              </div>
            </Card>

            {/* Recent Uploads */}
            <Card className="p-6 shadow-soft">
              <h3 className="font-bold mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" />
                Recent Uploads
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Calculus Notes</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <BookOpen className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Practice Problems</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;