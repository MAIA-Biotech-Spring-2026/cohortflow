"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PipelineBoard } from "@/components/pipeline-board";
import { DEMO_PROGRAMS } from "@/lib/mock-data";
import type { ApplicationStatus } from "@/types";

export default function PipelinePage() {
  const [selectedProgram, setSelectedProgram] = useState(DEMO_PROGRAMS[0]?.id || "");

  const { data: pipelineData, isLoading, refetch } = trpc.coordinator.getPipelineData.useQuery(
    { programId: selectedProgram },
    { enabled: !!selectedProgram }
  );

  const updateStatus = trpc.coordinator.updateApplicationStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleMoveApplication = async (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    await updateStatus.mutateAsync({
      applicationId,
      status: newStatus,
    });
  };

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Application Pipeline</h2>
        <p className="text-muted-foreground mt-2">
          Track and manage applications through each stage.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Program</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {DEMO_PROGRAMS.map((program) => (
              <Button
                key={program.id}
                variant={selectedProgram === program.id ? "default" : "outline"}
                onClick={() => setSelectedProgram(program.id)}
              >
                {program.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {pipelineData && (
        <PipelineBoard
          stages={pipelineData}
          onMoveApplication={handleMoveApplication}
        />
      )}
    </div>
  );
}
