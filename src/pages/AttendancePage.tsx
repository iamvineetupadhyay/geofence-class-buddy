import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { attendanceService } from "@/services/attendanceService";
import { Attendance, Session, AttendanceStats } from "@/lib/api";
import { 
  Clock, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Users,
  Play,
  Square
} from "lucide-react";

const AttendancePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendanceData();
  }, [user]);

  const loadAttendanceData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      if (user.role === 'student') {
        // Load student attendance data
        const [attendanceRes, statsRes, sessionRes] = await Promise.all([
          attendanceService.getStudentAttendance(user.id),
          attendanceService.getAttendanceStats(user.id),
          user.class_id 
            ? attendanceService.getCurrentSession(user.class_id) 
            : Promise.resolve({ success: false, error: 'No class ID' } as const)
        ]);

        if (attendanceRes.success) setAttendance(attendanceRes.data || []);
        if (statsRes.success) setStats(statsRes.data);
        if (sessionRes.success && 'data' in sessionRes) setCurrentSession(sessionRes.data);
      } else if (user.role === 'teacher' && user.class_id) {
        // Load teacher class data
        const [attendanceRes, sessionRes] = await Promise.all([
          attendanceService.getClassAttendance(user.class_id),
          attendanceService.getCurrentSession(user.class_id)
        ]);

        if (attendanceRes.success) setAttendance(attendanceRes.data || []);
        if (sessionRes.success) setCurrentSession(sessionRes.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load attendance data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    if (!currentSession) {
      toast({
        title: "No Active Session",
        description: "There is no active class session to mark attendance for.",
        variant: "destructive"
      });
      return;
    }

    if (!navigator.geolocation) {
      toast({
        title: "Location Required",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await attendanceService.markAttendance({
            session_id: currentSession.id,
            gps_lat: position.coords.latitude,
            gps_long: position.coords.longitude,
          });

          if (response.success) {
            toast({
              title: "Attendance Marked",
              description: "Your attendance has been successfully recorded.",
            });
            loadAttendanceData(); // Refresh data
          } else {
            toast({
              title: "Failed to Mark Attendance",
              description: response.error || "Please try again.",
              variant: "destructive"
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to mark attendance. Please try again.",
            variant: "destructive"
          });
        }
      },
      (error) => {
        toast({
          title: "Location Access Denied",
          description: "Please enable location access to mark attendance.",
          variant: "destructive"
        });
      }
    );
  };

  const startSession = async () => {
    if (!user?.class_id) return;

    try {
      const response = await attendanceService.createSession({
        class_id: user.class_id,
        teacher_id: user.id,
        start_time: new Date().toISOString(),
        end_time: '',
        status: 'active'
      });

      if (response.success) {
        setCurrentSession(response.data);
        toast({
          title: "Session Started",
          description: "Class session has been started successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start session",
        variant: "destructive"
      });
    }
  };

  const endSession = async () => {
    if (!currentSession) return;

    try {
      const response = await attendanceService.endSession(currentSession.id);
      
      if (response.success) {
        setCurrentSession(null);
        toast({
          title: "Session Ended",
          description: "Class session has been ended successfully.",
        });
        loadAttendanceData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end session",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'late':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      present: 'default',
      late: 'secondary',
      absent: 'destructive'
    };
    return <Badge variant={variants[status] as any}>{status.toUpperCase()}</Badge>;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Attendance</h1>
          
          {user?.role === 'student' && (
            <Button 
              onClick={markAttendance}
              disabled={!currentSession}
              className="flex items-center space-x-2"
            >
              <MapPin className="h-4 w-4" />
              <span>Mark Attendance</span>
            </Button>
          )}

          {user?.role === 'teacher' && (
            <div className="space-x-2">
              {!currentSession ? (
                <Button onClick={startSession} className="flex items-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>Start Session</span>
                </Button>
              ) : (
                <Button onClick={endSession} variant="destructive" className="flex items-center space-x-2">
                  <Square className="h-4 w-4" />
                  <span>End Session</span>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Current Session */}
        {currentSession && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Current Session</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Session ID</p>
                  <p className="font-medium">{currentSession.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Started At</p>
                  <p className="font-medium">
                    {new Date(currentSession.start_time).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={currentSession.status === 'active' ? 'default' : 'secondary'}>
                    {currentSession.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics for Students */}
        {user?.role === 'student' && stats && (
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_sessions}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Present</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.present}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Late</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.attendance_percentage.toFixed(1)}%</div>
                <Progress value={stats.attendance_percentage} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Attendance Records</span>
            </CardTitle>
            <CardDescription>
              {user?.role === 'student' ? 'Your attendance history' : 'Class attendance records'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendance.length > 0 ? (
              <div className="space-y-3">
                {attendance.slice(0, 10).map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(record.status)}
                      <div>
                        <p className="font-medium">Session {record.session_id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.check_in_time).toLocaleDateString()} at{' '}
                          {new Date(record.check_in_time).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(record.status)}
                      {record.check_out_time && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Out: {new Date(record.check_out_time).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="mx-auto h-12 w-12 mb-4" />
                <p>No attendance records found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendancePage;