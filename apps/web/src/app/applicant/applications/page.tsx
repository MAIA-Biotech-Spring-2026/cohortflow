"use client";

import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Clock } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { DEMO_PROGRAMS } from "@/lib/mock-data";

export default function ApplicationsPage() {
  const { data: applications, isLoading } = trpc.applicant.getApplications.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const activePrograms = DEMO_PROGRAMS.filter((p) => p.status === "open");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
        <p className="text-muted-foreground mt-2">
          Manage your applications and browse available programs.
        </p>
      </div>

      {applications && applications.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Your Applications</h3>
          <div className="grid gap-4">
            {applications.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{app.program?.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {app.program?.description}
                      </CardDescription>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Start: {app.program && formatDate(app.program.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Documents: {app.documents.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {app.submittedAt
                          ? `Submitted ${formatDate(app.submittedAt)}`
                          : "Draft"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/applicant/applications/${app.id}`}>
                      <Button variant="outline" size="sm">
                        {app.status === "draft" ? "Continue" : "View Details"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Available Programs</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {activePrograms.map((program) => {
            const hasApplied = applications?.some(
              (app) => app.programId === program.id
            );

            return (
              <Card key={program.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle>{program.name}</CardTitle>
                    {hasApplied && (
                      <Badge variant="secondary">Applied</Badge>
                    )}
                  </div>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">
                        {formatDate(program.startDate)} -{" "}
                        {formatDate(program.endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span className="font-medium">
                        {formatDate(program.applicationDeadline)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="font-medium">{program.capacity} positions</span>
                    </div>
                  </div>
                  {!hasApplied && (
                    <Button variant="default" className="w-full" disabled>
                      Apply Now (Demo)
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
