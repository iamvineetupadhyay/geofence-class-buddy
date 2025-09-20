import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  Settings, 
  BarChart3,
  TrendingUp,
  Calendar,
  School,
  UserCheck,
  AlertTriangle,
  Activity
} from "lucide-react";

const AdminDashboard = () => {
  const systemStats = [
    { label: "Total Students", value: "1,245", change: "+12%", icon: Users, color: "text-primary" },
    { label: "Total Teachers", value: "84", change: "+3%", icon: BookOpen, color: "text-secondary" },  
    { label: "Active Sessions", value: "23", change: "-5%", icon: Activity, color: "text-accent" },
    { label: "System Uptime", value: "99.9%", change: "+0.1%", icon: Settings, color: "text-success" }
  ];

  const recentEvents = [
    {
      type: "User Registration",
      description: "New student registered: John Smith (STU1246)",
      time: "5 minutes ago",
      status: "success" as const
    },
    {
      type: "Session Alert",
      description: "Low attendance detected in Class 10-B Mathematics",
      time: "15 minutes ago", 
      status: "warning" as const
    },
    {
      type: "System Update",
      description: "Geofencing accuracy improved to 99.9%",
      time: "1 hour ago",
      status: "info" as const
    }
  ];

  const attendanceOverview = [
    { department: "Mathematics", average: 92, trend: "up" },
    { department: "Physics", average: 88, trend: "up" },
    { department: "Chemistry", average: 85, trend: "down" },
    { department: "Biology", average: 90, trend: "up" },
    { department: "English", average: 94, trend: "stable" }
  ];

  const topPerformers = [
    { name: "Class 12-A", teacher: "Dr. Sarah Johnson", attendance: 96 },
    { name: "Class 11-B", teacher: "Prof. Michael Chen", attendance: 94 },
    { name: "Class 10-A", teacher: "Dr. Emily Davis", attendance: 92 }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-accent p-6 text-accent-foreground rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="opacity-90">System Administration • Central Campus</p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">System Status</div>
            <div className="text-2xl font-bold flex items-center">
              <div className="w-3 h-3 bg-success rounded-full mr-2"></div>
              Online
            </div>
          </div>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <Card key={index} className="p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-success' : stat.change.startsWith('-') ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-muted/30`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Button className="h-20 bg-gradient-primary hover:opacity-90 flex-col">
          <Users className="w-6 h-6 mb-2" />
          Manage Users
        </Button>
        <Button variant="outline" className="h-20 flex-col">
          <School className="w-6 h-6 mb-2" />
          Classes & Sessions
        </Button>
        <Button variant="outline" className="h-20 flex-col">
          <BarChart3 className="w-6 h-6 mb-2" />
          Analytics
        </Button>
        <Button variant="outline" className="h-20 flex-col">
          <Calendar className="w-6 h-6 mb-2" />
          Events
        </Button>
        <Button variant="outline" className="h-20 flex-col">
          <Settings className="w-6 h-6 mb-2" />
          System Settings
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance Overview */}
          <Card className="p-6 shadow-soft">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              Department Attendance Overview
            </h2>
            <div className="space-y-4">
              {attendanceOverview.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-foreground">{dept.department}</h3>
                      <Badge className={`${dept.average >= 90 ? 'bg-success' : dept.average >= 80 ? 'bg-warning' : 'bg-destructive'} text-white`}>
                        {dept.average}%
                      </Badge>
                    </div>
                    <div className="flex items-center mt-2">
                      <div className="h-2 bg-muted rounded-full w-32 mr-3">
                        <div className={`h-full rounded-full ${dept.average >= 90 ? 'bg-success' : dept.average >= 80 ? 'bg-warning' : 'bg-destructive'}`} style={{width: `${dept.average}%`}}></div>
                      </div>
                      <TrendingUp className={`w-4 h-4 ${dept.trend === 'up' ? 'text-success' : dept.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}`} />
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Details
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent System Events */}
          <Card className="p-6 shadow-soft">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Recent System Events
            </h2>
            <div className="space-y-4">
              {recentEvents.map((event, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    event.status === 'success' ? 'bg-success/10' : 
                    event.status === 'warning' ? 'bg-warning/10' : 
                    'bg-primary/10'
                  }`}>
                    {event.status === 'success' && <UserCheck className="w-4 h-4 text-success" />}
                    {event.status === 'warning' && <AlertTriangle className="w-4 h-4 text-warning" />}
                    {event.status === 'info' && <Settings className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{event.type}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Performing Classes */}
          <Card className="p-6 shadow-soft">
            <h3 className="font-bold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Top Performing Classes
            </h3>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{performer.name}</h4>
                    <p className="text-sm text-muted-foreground">{performer.teacher}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-success">{performer.attendance}%</span>
                    <div className="h-2 bg-muted rounded-full w-12 mt-1">
                      <div className="h-full bg-success rounded-full" style={{width: `${performer.attendance}%`}}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* System Health */}
          <Card className="p-6 shadow-soft">
            <h3 className="font-bold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              System Health
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Server Status</span>
                <Badge className="bg-success text-success-foreground">Healthy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Database</span>
                <Badge className="bg-success text-success-foreground">Optimal</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">API Response</span>
                <Badge className="bg-success text-success-foreground">Fast</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Geofencing</span>
                <Badge className="bg-success text-success-foreground">Active</Badge>
              </div>
            </div>
          </Card>

          {/* Recent User Activity */}
          <Card className="p-6 shadow-soft">
            <h3 className="font-bold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              Live Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">23 active sessions</p>
                  <p className="text-xs text-muted-foreground">Students marking attendance</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">8 teachers online</p>
                  <p className="text-xs text-muted-foreground">Conducting classes</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">142 students active</p>
                  <p className="text-xs text-muted-foreground">In the last hour</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;