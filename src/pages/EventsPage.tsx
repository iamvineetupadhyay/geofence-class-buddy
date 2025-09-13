import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Plus, 
  Filter,
  Bell,
  ExternalLink
} from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
  type: 'academic' | 'sports' | 'cultural' | 'workshop' | 'announcement';
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  max_attendees?: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  priority: 'low' | 'medium' | 'high';
  media_url?: string;
}

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  // Mock events data
  const mockEvents: Event[] = [
    {
      id: 1,
      title: "Annual Science Exhibition",
      description: "Showcase of innovative projects and research by students from all departments. Join us for an amazing display of creativity and scientific thinking.",
      type: "academic",
      date: "2024-01-25",
      time: "09:00 AM",
      location: "Main Auditorium",
      organizer: "Dr. Sarah Johnson",
      attendees: 245,
      max_attendees: 300,
      status: "upcoming",
      priority: "high",
      media_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500"
    },
    {
      id: 2,
      title: "Mathematics Workshop: Advanced Calculus",
      description: "Interactive workshop covering advanced calculus concepts with practical applications in engineering and physics.",
      type: "workshop",
      date: "2024-01-20",
      time: "02:00 PM",
      location: "Room 301, Mathematics Building",
      organizer: "Prof. Michael Chen",
      attendees: 42,
      max_attendees: 50,
      status: "upcoming",
      priority: "medium"
    },
    {
      id: 3,
      title: "Inter-College Football Championship",
      description: "Annual football tournament featuring teams from 12 different colleges. Support your team!",
      type: "sports",
      date: "2024-01-22",
      time: "10:00 AM",
      location: "University Sports Ground",
      organizer: "Sports Committee",
      attendees: 156,
      status: "upcoming",
      priority: "medium"
    },
    {
      id: 4,
      title: "Cultural Night 2024",
      description: "An evening of music, dance, and cultural performances celebrating diversity and talent.",
      type: "cultural",
      date: "2024-01-18",
      time: "06:00 PM", 
      location: "Central Amphitheater",
      organizer: "Cultural Society",
      attendees: 423,
      max_attendees: 500,
      status: "completed",
      priority: "high"
    },
    {
      id: 5,
      title: "Important: Mid-Semester Exam Schedule",
      description: "Updated examination schedule for mid-semester tests. Please check your respective time slots and rooms.",
      type: "announcement",
      date: "2024-01-16",
      time: "All Day",
      location: "Various Exam Halls",
      organizer: "Examination Department",
      attendees: 0,
      status: "ongoing",
      priority: "high"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-primary text-primary-foreground';
      case 'sports': return 'bg-success text-success-foreground';
      case 'cultural': return 'bg-accent text-accent-foreground';
      case 'workshop': return 'bg-secondary text-secondary-foreground';
      case 'announcement': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-primary';
      case 'ongoing': return 'text-success';
      case 'completed': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Star className="w-4 h-4 text-warning fill-warning" />;
      case 'medium': return <Star className="w-4 h-4 text-muted-foreground" />;
      case 'low': return null;
      default: return null;
    }
  };

  const isEventToday = (eventDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    return eventDate === today;
  };

  const isEventSoon = (eventDate: string) => {
    const today = new Date();
    const event = new Date(eventDate);
    const diffTime = event.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <CardTitle>Please log in to view events</CardTitle>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Events & Announcements
          </h1>
          <p className="text-muted-foreground mt-1">Stay updated with campus activities and important notices</p>
        </div>
        {user.role === 'admin' || user.role === 'teacher' ? (
          <Button className="bg-gradient-primary shadow-glow">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        ) : (
          <Button variant="outline" className="shadow-soft">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 p-4 bg-background/50 backdrop-blur-sm rounded-xl shadow-soft">
        <Button
          variant={filter === 'all' ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter('all')}
        >
          <Filter className="w-4 h-4 mr-2" />
          All Events
        </Button>
        {['academic', 'sports', 'cultural', 'workshop', 'announcement'].map((type) => (
          <Button
            key={type}
            variant={filter === type ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {filteredEvents.length === 0 ? (
          <Card className="p-12 text-center shadow-soft">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or check back later</p>
          </Card>
        ) : (
          filteredEvents.map((event) => (
            <Card 
              key={event.id} 
              className={`shadow-soft hover:shadow-medium transition-all bg-background/50 backdrop-blur-sm ${
                isEventToday(event.date) ? 'ring-2 ring-primary/50' : ''
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      {getPriorityIcon(event.priority)}
                      {isEventToday(event.date) && (
                        <Badge className="bg-warning text-warning-foreground animate-pulse">
                          Today
                        </Badge>
                      )}
                      {isEventSoon(event.date) && !isEventToday(event.date) && (
                        <Badge variant="outline" className="border-primary text-primary">
                          Soon
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.location}
                      </div>
                      {event.max_attendees && (
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {event.attendees}/{event.max_attendees}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(event.type)}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(event.status)}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${event.organizer}`} />
                      <AvatarFallback className="text-xs">
                        {event.organizer.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Organized by</p>
                      <p className="text-xs text-muted-foreground">{event.organizer}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {event.status === 'upcoming' && (
                      <Button size="sm" className="bg-gradient-primary">
                        {event.type === 'announcement' ? 'View Details' : 'Register'}
                      </Button>
                    )}
                    {event.media_url && (
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Media
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsPage;