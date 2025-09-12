import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { gamificationService, LeaderboardEntry, StudentBadge, AttendanceStreak } from "@/services/gamificationService";
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  TrendingUp, 
  Calendar,
  Target,
  Award,
  Flame
} from "lucide-react";

const LeaderboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [classLeaderboard, setClassLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [studentBadges, setStudentBadges] = useState<StudentBadge[]>([]);
  const [attendanceStreak, setAttendanceStreak] = useState<AttendanceStreak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboardData();
  }, [user]);

  const loadLeaderboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load global leaderboard
      const globalResult = await gamificationService.getGlobalLeaderboard();
      if (globalResult.success) setGlobalLeaderboard(globalResult.data || []);

      // Load class leaderboard if user has class_id
      if (user.class_id) {
        const classResult = await gamificationService.getClassLeaderboard(user.class_id);
        if (classResult.success) setClassLeaderboard(classResult.data || []);
      }

      // Load student-specific data if user is a student
      if (user.role === 'student') {
        const [badgesResult, streakResult] = await Promise.all([
          gamificationService.getStudentBadges(user.id),
          gamificationService.getAttendanceStreak(user.id)
        ]);
        
        if (badgesResult.success) setStudentBadges(badgesResult.data || []);
        if (streakResult.success) setAttendanceStreak(streakResult.data);
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load leaderboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Trophy className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500">🥇 1st Place</Badge>;
    if (rank === 2) return <Badge variant="secondary">🥈 2nd Place</Badge>;
    if (rank === 3) return <Badge variant="outline">🥉 3rd Place</Badge>;
    return <Badge variant="outline">#{rank}</Badge>;
  };

  const LeaderboardTable = ({ data, title }: { data: LeaderboardEntry[], title: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{data.length} students ranked</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.slice(0, 10).map((entry, index) => (
            <div
              key={entry.student_id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                entry.student_id === user?.id ? 'bg-primary/10 border-primary' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10">
                  {getRankIcon(entry.rank)}
                </div>
                
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${entry.student_name}`} />
                  <AvatarFallback>
                    {entry.student_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <p className="font-semibold">{entry.student_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.badges_count} badges earned
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-bold">{entry.attendance_score.toFixed(1)}%</span>
                </div>
                {getRankBadge(entry.rank)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Leaderboard & Achievements</h1>
        </div>

        {/* Student Personal Stats */}
        {user?.role === 'student' && (
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">My Rank (Global)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {getRankIcon(globalLeaderboard.find(e => e.student_id === user.id)?.rank || 0)}
                  <span className="text-2xl font-bold">
                    {globalLeaderboard.find(e => e.student_id === user.id)?.rank || 'Unranked'}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold">{studentBadges.length}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="text-2xl font-bold">
                    {attendanceStreak?.current_streak || 0} days
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="global" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="global">Global Leaderboard</TabsTrigger>
            {user?.class_id && <TabsTrigger value="class">Class Leaderboard</TabsTrigger>}
            {user?.role === 'student' && <TabsTrigger value="achievements">My Achievements</TabsTrigger>}
          </TabsList>

          <TabsContent value="global">
            <LeaderboardTable data={globalLeaderboard} title="Global Leaderboard" />
          </TabsContent>

          {user?.class_id && (
            <TabsContent value="class">
              <LeaderboardTable data={classLeaderboard} title="Class Leaderboard" />
            </TabsContent>
          )}

          {user?.role === 'student' && (
            <TabsContent value="achievements" className="space-y-6">
              {/* Attendance Streak */}
              {attendanceStreak && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Flame className="h-5 w-5 text-orange-500" />
                      <span>Attendance Streak</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-500">
                          {attendanceStreak.current_streak}
                        </div>
                        <p className="text-sm text-muted-foreground">Current Streak</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-500">
                          {attendanceStreak.longest_streak}
                        </div>
                        <p className="text-sm text-muted-foreground">Longest Streak</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-500">
                          {attendanceStreak.total_present}
                        </div>
                        <p className="text-sm text-muted-foreground">Total Present</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span>Badges Earned ({studentBadges.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {studentBadges.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {studentBadges.map((badgeEntry) => (
                        <div
                          key={badgeEntry.badge_id}
                          className="flex items-center space-x-4 p-4 border rounded-lg"
                        >
                          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            {badgeEntry.badge.image_url ? (
                              <img 
                                src={badgeEntry.badge.image_url} 
                                alt={badgeEntry.badge.name}
                                className="w-8 h-8"
                              />
                            ) : (
                              <Star className="h-6 w-6 text-yellow-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold">{badgeEntry.badge.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {badgeEntry.badge.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Earned: {new Date(badgeEntry.awarded_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No badges earned yet</p>
                      <p className="text-sm text-muted-foreground">
                        Keep attending classes to earn your first badge!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default LeaderboardPage;