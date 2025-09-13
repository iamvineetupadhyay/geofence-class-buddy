import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Phone,
  Building,
  Save,
  Edit,
} from "lucide-react";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    institution_id: user?.institution_id || "",
  });

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({
        title: "✅ Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      institution_id: user?.institution_id || "",
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 shadow-soft bg-background/40 backdrop-blur-md">
          <CardTitle className="text-xl font-semibold text-center">
            Please log in to view your profile.
          </CardTitle>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <Card className="shadow-strong bg-background/40 backdrop-blur-md border border-border">
        <CardHeader className="border-b border-border pb-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24 ring-4 ring-primary/30 shadow-soft">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
              />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {user.name}
              </CardTitle>
              <CardDescription>
                 <Badge
                   variant={
                     user.role === "admin"
                       ? "default"
                       : user.role === "teacher"
                       ? "secondary"
                       : "outline"
                   }
                   className="px-3 py-1 rounded-full shadow-soft"
                 >
                   {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student'}
                 </Badge>
              </CardDescription>
            </div>
            <div className="ml-auto">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="shadow-soft"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button onClick={handleSave} className="shadow-soft">
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 mt-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Section - Editable Fields */}
            <div className="space-y-6">
              {[
                {
                  id: "name",
                  label: "Full Name",
                  value: formData.name,
                  icon: User,
                  fallback: user.name,
                },
                {
                  id: "email",
                  label: "Email Address",
                  value: formData.email,
                  type: "email",
                  icon: Mail,
                  fallback: user.email,
                },
                {
                  id: "phone",
                  label: "Phone Number",
                  value: formData.phone,
                  icon: Phone,
                  fallback: user.phone || "Not provided",
                },
                {
                  id: "institution",
                  label: "Institution ID",
                  value: formData.institution_id,
                  icon: Building,
                  fallback: user.institution_id || "Not provided",
                },
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="text-sm font-medium">
                    {field.label}
                  </Label>
                  {isEditing ? (
                    <Input
                      id={field.id}
                      type={field.type || "text"}
                      value={field.value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.id === "institution" ? "institution_id" : field.id]:
                            e.target.value,
                        }))
                      }
                      className="shadow-inner"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg shadow-inner">
                      <field.icon className="h-4 w-4 text-muted-foreground" />
                      <span>{field.fallback}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Section - Account Info */}
            <Card className="bg-background/40 backdrop-blur-sm shadow-soft border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">User ID:</span>
                  <span className="text-sm font-medium">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Role:</span>
                   <Badge
                     variant={
                       user.role === "admin"
                         ? "default"
                         : user.role === "teacher"
                         ? "secondary"
                         : "outline"
                     }
                   >
                     {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student'}
                   </Badge>
                </div>
                {user.class_id && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Class ID:
                    </span>
                    <span className="text-sm font-medium">{user.class_id}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={user.active ? "default" : "secondary"}>
                    {user.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Member Since:
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
