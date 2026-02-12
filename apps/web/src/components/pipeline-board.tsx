"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import type { Application, Applicant, ApplicationStatus } from "@/types";

interface PipelineStage {
  id: string;
  name: string;
  status: ApplicationStatus;
  applications: Array<
    Application & {
      applicant?: Applicant;
      reviewCount: number;
      averageScore: number | null;
    }
  >;
}

interface PipelineBoardProps {
  stages: PipelineStage[];
  onMoveApplication?: (applicationId: string, newStatus: ApplicationStatus) => void;
}

export function PipelineBoard({ stages, onMoveApplication }: PipelineBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stages.map((stage) => (
        <div key={stage.id} className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-lg">{stage.name}</h3>
            <Badge variant="secondary">{stage.applications.length}</Badge>
          </div>
          <div className="space-y-2 flex-1">
            {stage.applications.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  No applications
                </CardContent>
              </Card>
            ) : (
              stage.applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onMove={onMoveApplication}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ApplicationCard({
  application,
  onMove,
}: {
  application: Application & {
    applicant?: Applicant;
    reviewCount: number;
    averageScore: number | null;
  };
  onMove?: (applicationId: string, newStatus: ApplicationStatus) => void;
}) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium truncate">
              {application.applicant?.firstName}{" "}
              {application.applicant?.lastName}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {application.applicant?.email}
            </p>
          </div>
          <StatusBadge status={application.status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Reviews:</span>
          <Badge variant="outline">{application.reviewCount}</Badge>
        </div>
        {application.averageScore !== null && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Avg Score:</span>
            <Badge variant="secondary">
              {application.averageScore.toFixed(1)}/5.0
            </Badge>
          </div>
        )}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Documents:</span>
          <Badge variant="outline">{application.documents.length}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
