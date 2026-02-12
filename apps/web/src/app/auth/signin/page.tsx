"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const demoAccounts = [
    { email: "applicant@demo.com", role: "Applicant" },
    { email: "reviewer@demo.com", role: "Reviewer" },
    { email: "coordinator@demo.com", role: "Coordinator" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password: "demo", // Any password works in demo mode
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email address");
      } else {
        // Redirect based on role
        if (email.includes("applicant")) {
          router.push("/applicant");
        } else if (email.includes("reviewer")) {
          router.push("/reviewer");
        } else if (email.includes("coordinator")) {
          router.push("/coordinator");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: demoEmail,
        password: "demo",
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email address");
      } else {
        if (demoEmail.includes("applicant")) {
          router.push("/applicant");
        } else if (demoEmail.includes("reviewer")) {
          router.push("/reviewer");
        } else if (demoEmail.includes("coordinator")) {
          router.push("/coordinator");
        }
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            CohortFlow
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or use a demo account
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <Button
                key={account.email}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleDemoLogin(account.email)}
                disabled={loading}
              >
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium">{account.role}</span>
                  <span className="text-xs text-muted-foreground">
                    {account.email}
                  </span>
                </div>
              </Button>
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Demo mode: Any password works for demo accounts
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
