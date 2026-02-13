"use client";

import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Progress } from "@/components/ui/progress";
import { FileText, User, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ApplicantDashboard() {
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErrorData,
  } = trpc.applicant.getProfile.useQuery();

  const {
    data: applications,
    isLoading: appsLoading,
    isError: appsError,
    error: appsErrorData,
  } = trpc.applicant.getApplications.useQuery();

  useEffect(() => {
    if (profileError) {
      toast.error("Failed to load profile", {
        description: profileErrorData?.message || "Please try again later",
      });
    }
  }, [profileError, profileErrorData]);

  useEffect(() => {
    if (appsError) {
      toast.error("Failed to load applications", {
        description: appsErrorData?.message || "Please try again later",
      });
    }
  }, [appsError, appsErrorData]);

  if (profileLoading || appsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (profileError || appsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Unable to load dashboard
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            We encountered an error loading your data. Please try refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh page</Button>
        </div>
      </div>
    );
  }

  const completedSteps = [
    profile?.firstName,
    applications && applications.length > 0,
    applications?.some((app) => app.status === "submitted"),
  ].filter(Boolean).length;

  const totalSteps = 3;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {profile?.firstName || "there"}!
        </h2>
        <p className="text-muted-foreground mt-2">
          Track your applications and manage your profile.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Complete these steps to submit your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progressPercentage} />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className={`rounded-full p-2 ${profile?.firstName ? 'bg-green-100' : 'bg-gray-100'}`}>
                {profile?.firstName ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <User className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-sm">Complete Profile</h4>
                <p className="text-xs text-muted-foreground">
                  {profile?.firstName ? "Done" : "Not started"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className={`rounded-full p-2 ${applications && applications.length > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                {applications && applications.length > 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <FileText className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-sm">Start Application</h4>
                <p className="text-xs text-muted-foreground">
                  {applications && applications.length > 0 ? "In progress" : "Not started"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className={`rounded-full p-2 ${applications?.some(app => app.status === 'submitted') ? 'bg-green-100' : 'bg-gray-100'}`}>
                {applications?.some(app => app.status === 'submitted') ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-sm">Submit Application</h4>
                <p className="text-xs text-muted-foreground">
                  {applications?.some(app => app.status === 'submitted') ? "Submitted" : "Pending"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Applications</CardTitle>
            <CardDescription>
              View and manage your program applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!applications || applications.length === 0 ? (
              <div className="text-center py-6">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  You haven&apos;t started any applications yet
                </p>
                <Link href="/applicant/applications">
                  <Button>Browse Programs</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{app.program?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {app.submittedAt ? `Submitted ${formatDate(app.submittedAt)}` : "Draft"}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  ))}
                </div>
                <Link href="/applicant/applications">
                  <Button variant="outline" className="w-full">
                    View All Applications
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Status</CardTitle>
            <CardDescription>Keep your information up to date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!profile?.firstName ? (
              <div className="text-center py-6">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  Complete your profile to start applying
                </p>
                <Link href="/applicant/profile">
                  <Button>Complete Profile</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">
                      {profile.firstName} {profile.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{profile.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{profile.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">
                      {profile.city}, {profile.state}
                    </span>
                  </div>
                </div>
                <Link href="/applicant/profile">
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
