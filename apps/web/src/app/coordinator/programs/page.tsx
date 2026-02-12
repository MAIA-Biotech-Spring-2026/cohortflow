"use client";

import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ProgramsPage() {
  const { data: programs, isLoading } = trpc.coordinator.getPrograms.useQuery();

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

  const statusColors: Record<string, "default" | "secondary" | "success" | "warning"> = {
    draft: "secondary",
    open: "success",
    closed: "warning",
    archived: "default",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Programs</h2>
          <p className="text-muted-foreground mt-2">
            Manage your programs and templates.
          </p>
        </div>
        <Button disabled>
          Create New Program (Demo)
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {programs?.map((program) => (
          <Card key={program.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{program.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {program.description}
                  </CardDescription>
                </div>
                <Badge variant={statusColors[program.status]}>
                  {program.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{formatDate(program.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="font-medium">{formatDate(program.endDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Capacity</p>
                    <p className="font-medium">{program.capacity} positions</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Deadline</p>
                    <p className="font-medium">
                      {formatDate(program.applicationDeadline)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Requirements:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {program.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Rubric:</p>
                <p className="text-sm text-muted-foreground">
                  {program.rubric.name} ({program.rubric.criteria.length} criteria)
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Edit
                </Button>
                <Button variant="outline" size="sm" disabled>
                  View Applications
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
