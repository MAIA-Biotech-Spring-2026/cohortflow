"use client";

import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, FileText, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ReviewerDashboard() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErrorData,
  } = trpc.reviewer.getReviewStats.useQuery();

  const {
    data: applications,
    isLoading: appsLoading,
    isError: appsError,
    error: appsErrorData,
  } = trpc.reviewer.getAssignedApplications.useQuery();

  useEffect(() => {
    if (statsError) {
      toast.error("Failed to load review statistics", {
        description: statsErrorData?.message || "Please try again later",
      });
    }
  }, [statsError, statsErrorData]);

  useEffect(() => {
    if (appsError) {
      toast.error("Failed to load assigned applications", {
        description: appsErrorData?.message || "Please try again later",
      });
    }
  }, [appsError, appsErrorData]);

  if (statsLoading || appsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (statsError || appsError) {
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
            We encountered an error loading your review data. Please try refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh page</Button>
        </div>
      </div>
    );
  }

  const pendingApplications = applications?.filter(
    (app) => !app.reviewCount || app.reviewCount === 0
  ) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reviewer Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Review applications and provide feedback.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reviews Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completed || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.averageScore ? stats.averageScore.toFixed(1) : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
          <CardDescription>
            Applications waiting for your review
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingApplications.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-muted-foreground">
                All caught up! No pending reviews.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApplications.slice(0, 5).map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium">
                      {app.applicant?.firstName} {app.applicant?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {app.program?.name}
                    </p>
                  </div>
                  <Link href={`/reviewer/review/${app.id}`}>
                    <Button size="sm">Review</Button>
                  </Link>
                </div>
              ))}
              {pendingApplications.length > 5 && (
                <Link href="/reviewer/queue">
                  <Button variant="outline" className="w-full">
                    View All ({pendingApplications.length} total)
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your recently reviewed applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications && applications.length > 0 ? (
            <div className="space-y-3">
              {applications
                .filter((app) => app.reviewCount > 0)
                .slice(0, 5)
                .map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {app.applicant?.firstName} {app.applicant?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {app.program?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        {app.averageScore?.toFixed(1) || "N/A"} / 5.0
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {app.reviewCount} review{app.reviewCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No reviews yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
