import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Mail, Lock, User, Phone, Hash } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

interface LoginFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const LoginForm = ({ onSuccess, onBack }: LoginFormProps) => {
  const { login, register, loginWithGoogle, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    institution_id: "",
    role: "student" as "student" | "teacher" | "admin",
    class_id: undefined as number | undefined,
  });

  // ---------- LOGIN ----------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(loginData.email, loginData.password);
      if (result.success) onSuccess();
      else alert("Login failed: " + (result.error ?? "Unknown error"));
    } catch (err) {
      alert("Unexpected error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // ---------- GOOGLE LOGIN ----------
  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (result.success) onSuccess();
      else alert("Google login failed: " + (result.error ?? "Unknown error"));
    } catch (err) {
      alert("Unexpected error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // ---------- REGISTER ----------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem("attendmate_token");
    localStorage.removeItem("attendmate_user");

    try {
      const result = await register(registerData);
      if (result.success) onSuccess();
      else alert("Registration failed: " + (result.error ?? "Unknown error"));
    } catch (err) {
      alert("Unexpected error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 bg-background/95 backdrop-blur-sm shadow-elegant">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AttendMate</h1>
          <p className="text-muted-foreground">Access your account</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* ---------- LOGIN FORM ---------- */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-6">
              <InputField
                id="email"
                label="Email"
                type="email"
                icon={<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
              <PasswordField
                id="password"
                label="Password"
                value={loginData.password}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
              <Button type="submit" className="w-full bg-gradient-primary" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <GoogleButton onClick={handleGoogleLogin} loading={loading} />
            </form>
          </TabsContent>

          {/* ---------- REGISTER FORM ---------- */}
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <InputField
                id="name"
                label="Full Name"
                type="text"
                icon={<User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              />
              <InputField
                id="reg-email"
                label="Email"
                type="email"
                icon={<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
              <InputField
                id="phone"
                label="Phone Number"
                type="tel"
                icon={<Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
                value={registerData.phone}
                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
              />
              <InputField
                id="institution_id"
                label="ID Number"
                type="text"
                icon={<Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
                value={registerData.institution_id}
                onChange={(e) => setRegisterData({ ...registerData, institution_id: e.target.value })}
              />
              <RoleSelect value={registerData.role} onChange={(role) => setRegisterData({ ...registerData, role })} />
              {registerData.role === "student" && (
                <Input
                  id="class_id"
                  type="number"
                  placeholder="Class ID (Optional)"
                  value={registerData.class_id || ""}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, class_id: e.target.value ? parseInt(e.target.value) : undefined })
                  }
                />
              )}
              <PasswordField
                id="reg-password"
                label="Password"
                value={registerData.password}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />
              <Button type="submit" className="w-full bg-gradient-secondary" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
              <GoogleButton onClick={handleGoogleLogin} loading={loading} />
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
            ← Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

// ---------- Subcomponents ----------
const InputField = ({ id, label, type, icon, value, onChange }: any) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">{icon}<Input id={id} type={type} placeholder={label} className="pl-10" value={value} onChange={onChange} required /></div>
  </div>
);

const PasswordField = ({ id, label, value, showPassword, setShowPassword, onChange }: any) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input id={id} type={showPassword ? "text" : "password"} placeholder={label} className="pl-10 pr-10" value={value} onChange={onChange} required />
      <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-2 h-8 w-8 p-0" onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  </div>
);

const RoleSelect = ({ value, onChange }: any) => (
  <div className="space-y-2">
    <Label htmlFor="role">Role</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder="Select your role" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="student">Student</SelectItem>
        <SelectItem value="teacher">Teacher</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

const GoogleButton = ({ onClick, loading }: any) => (
  <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2 mt-4" onClick={onClick} disabled={loading}>
    <FcGoogle className="h-5 w-5" />
    {loading ? "Connecting..." : "Continue with Google"}
  </Button>
);

export default LoginForm;
