import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { notesService, Subject } from "@/services/notesService";
import { Note } from "@/lib/api";
import { 
  BookOpen, 
  Download, 
  Upload, 
  Search, 
  FileText, 
  Eye,
  Calendar,
  User,
  Trash2
} from "lucide-react";

const NotesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, [user]);

  useEffect(() => {
    if (selectedSubject) {
      loadNotes(selectedSubject);
    }
  }, [selectedSubject]);

  const loadSubjects = async () => {
    try {
      const response = await notesService.getSubjects(user?.class_id);
      if (response.success) {
        setSubjects(response.data || []);
        if (response.data?.length > 0) {
          setSelectedSubject(response.data[0].id);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load subjects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async (subjectId: number) => {
    try {
      const response = await notesService.getSubjectNotes(subjectId);
      if (response.success) {
        setNotes(response.data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async (noteId: number, title: string) => {
    try {
      const response = await notesService.downloadNote(noteId);
      if (response.success && response.data?.download_url) {
        // Open download URL in new tab
        window.open(response.data.download_url, '_blank');
        toast({
          title: "Download Started",
          description: `Downloading ${title}`,
        });
      } else {
        toast({
          title: "Download Failed",
          description: "Could not download the file",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      const response = await notesService.deleteNote(noteId);
      if (response.success) {
        toast({
          title: "Note Deleted",
          description: "The note has been successfully deleted.",
        });
        if (selectedSubject) {
          loadNotes(selectedSubject);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive"
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      if (selectedSubject) {
        loadNotes(selectedSubject);
      }
      return;
    }

    try {
      const response = await notesService.searchNotes(searchQuery, user?.class_id);
      if (response.success) {
        setNotes(response.data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Search failed",
        variant: "destructive"
      });
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Notes Repository</h1>
          
          {user?.role === 'teacher' && (
            <Button className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload Note</span>
            </Button>
          )}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Subjects Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {subjects.map((subject) => (
                    <Button
                      key={subject.id}
                      variant={selectedSubject === subject.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedSubject(subject.id)}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      {subject.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>
                    {selectedSubject 
                      ? subjects.find(s => s.id === selectedSubject)?.name 
                      : 'All Notes'
                    }
                  </span>
                </CardTitle>
                <CardDescription>
                  {filteredNotes.length} note(s) available
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredNotes.length > 0 ? (
                  <div className="space-y-4">
                    {filteredNotes.map((note) => (
                      <div
                        key={note.id}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>Uploaded by: {note.uploaded_by}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(note.uploaded_at).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Download className="h-3 w-3" />
                                <span>{note.download_count} downloads</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(note.file_url, '_blank')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            
                            <Button
                              size="sm"
                              onClick={() => handleDownload(note.id, note.title)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>

                            {(user?.role === 'teacher' || user?.role === 'admin') && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(note.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Notes Found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No notes match your search.' : 'No notes available for this subject.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;