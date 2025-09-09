import { useState, useEffect } from "react";
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
  TrendingUp,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { attendanceService } from "@/services/attendanceService";
import { notesService } from "@/services/notesService";
import { gamificationService, AttendanceStreak, LeaderboardEntry } from "@/services/gamificationService";
import { useToast } from "@/hooks/use-toast";
import { Attendance, Note } from "@/lib/api";

const StudentDashboardConnected = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [streak, setStreak] = useState<AttendanceStreak | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load student attendance
      const attendanceRes = await attendanceService.getStudentAttendance(user.id);
      if (attendanceRes.success && attendanceRes.data) {
        setAttendance(attendanceRes.data);
      }

      // Load recent notes (limit to recent ones)
      if (user.class_id) {
        const notesRes = await notesService.getSubjects(user.class_id);
        if (notesRes.success && notesRes.data && notesRes.data.length > 0) {
          // Get notes from first subject as example
          const subjectNotesRes = await notesService.getSubjectNotes(notesRes.data[0].id);
          if (subjectNotesRes.success && subjectNotesRes.data) {
            setNotes(subjectNotesRes.data.slice(0, 3)); // Show latest 3
          }
        }
      }

      // Load attendance streak
      const streakRes = await gamificationService.getAttendanceStreak(user.id);
      if (streakRes.success && streakRes.data) {
        setStreak(streakRes.data);
      }

      // Load class leaderboard
      if (user.class_id) {
        const leaderboardRes = await gamificationService.getClassLeaderboard(user.class_id);
        if (leaderboardRes.success && leaderboardRes.data) {
          setLeaderboard(leaderboardRes.data.slice(0, 5)); // Top 5
        }
      }
    } catch (error) {
      toast({
        title: "Error loading dashboard",
        description: "Failed to load some dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!user?.class_id) {
      toast({
        title: "Error",
        description: "Class information not found",
        variant: "destructive",
      });
      return;
    }

    // Get current position
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        // Get current session for the class
        const sessionRes = await attendanceService.getCurrentSession(user.class_id!);
        if (!sessionRes.success || !sessionRes.data) {
          toast({
            title: "No active session",
            description: "There's no active class session right now",
            variant: "destructive",
          });
          return;
        }

        // Mark attendance
        const markRes = await attendanceService.markAttendance({
          session_id: sessionRes.data.id,
          gps_lat: position.coords.latitude,
          gps_long: position.coords.longitude,
        });

        if (markRes.success) {
          toast({
            title: "Attendance marked!",
            description: "Your attendance has been successfully recorded",
          });
          loadDashboardData(); // Refresh data
        } else {
          toast({
            title: "Failed to mark attendance",
            description: markRes.error || "Unable to mark attendance",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to mark attendance",
          variant: "destructive",
        });
      }
    }, (error) => {
      toast({
        title: "Location access denied",
        description: "Please allow location access to mark attendance",
        variant: "destructive",
      });
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to view dashboard</p>
      </div>
    );
  }

  const attendancePercentage = attendance.length > 0 
    ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary p-6 text-primary-foreground">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
              <p className="opacity-90">Student ID: {user.institution_id}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm opacity-90">Attendance Rate</div>
                <div className="text-2xl font-bold">{attendancePercentage}%</div>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="border-white/20 text-white hover:bg-white/10">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            className="h-20 bg-gradient-secondary hover:opacity-90 flex-col"
            onClick={handleMarkAttendance}
          >
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Attendance History */}
            <Card className="p-6 shadow-soft">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Recent Attendance
              </h2>
              <div className="space-y-4">
                {attendance.slice(0, 5).map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-foreground">Session #{record.session_id}</h3>
                        <Badge className={`${record.status === 'present' ? 'bg-success' : record.status === 'late' ? 'bg-warning' : 'bg-destructive'} text-white`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(record.check_in_time).toLocaleDateString()} at {new Date(record.check_in_time).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {attendance.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No attendance records yet</p>
                )}
              </div>
            </Card>

            {/* Recent Notes */}
            <Card className="p-6 shadow-soft">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" />
                Recent Notes
              </h2>
              <div className="space-y-3">
                {notes.map((note, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg cursor-pointer transition-smooth">
                    <div>
                      <h3 className="font-medium text-foreground">{note.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Uploaded {new Date(note.uploaded_at).toLocaleDateString()} • Downloaded {note.download_count} times
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No notes available yet</p>
                )}
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
                  <span className="text-muted-foreground">Total Sessions</span>
                  <span className="font-semibold">{attendance.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Present</span>
                  <span className="font-semibold text-success">
                    {attendance.filter(a => a.status === 'present').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attendance Rate</span>
                  <span className="font-semibold">{attendancePercentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{width: `${attendancePercentage}%`}}></div>
                </div>
              </div>
            </Card>

            {/* Current Streak */}
            {streak && (
              <Card className="p-6 bg-gradient-secondary text-secondary-foreground shadow-soft">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{streak.current_streak}</div>
                  <div className="text-sm opacity-90">Day Streak</div>
                  <div className="flex justify-center mt-3">
                    {[...Array(Math.min(streak.current_streak, 7))].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current ml-1" />
                    ))}
                  </div>
                  <p className="text-xs opacity-75 mt-2">
                    Longest: {streak.longest_streak} days
                  </p>
                </div>
              </Card>
            )}

            {/* Class Leaderboard */}
            {leaderboard.length > 0 && (
              <Card className="p-6 shadow-soft">
                <h3 className="font-bold mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-primary" />
                  Class Leaderboard
                </h3>
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-warning text-warning-foreground' :
                          index === 1 ? 'bg-muted text-muted-foreground' :
                          index === 2 ? 'bg-accent text-accent-foreground' :
                          'bg-muted/50 text-muted-foreground'
                        }`}>
                          {entry.rank}
                        </div>
                        <span className={`text-sm ${entry.student_name === user.name ? 'font-bold text-primary' : 'text-foreground'}`}>
                          {entry.student_name}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{entry.attendance_score}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardConnected;