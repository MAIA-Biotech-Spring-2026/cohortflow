"use client";

import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ReviewQueuePage() {
  const { data: applications, isLoading } = trpc.reviewer.getAssignedApplications.useQuery();

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
        <h2 className="text-3xl font-bold tracking-tight">Review Queue</h2>
        <p className="text-muted-foreground mt-2">
          Applications assigned to you for review.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Applications ({applications?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!applications || applications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No applications assigned yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Avg Score</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {app.applicant?.firstName} {app.applicant?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {app.applicant?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{app.program?.name}</p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{app.reviewCount}</Badge>
                    </TableCell>
                    <TableCell>
                      {app.averageScore !== null ? (
                        <Badge variant="secondary">
                          {app.averageScore.toFixed(1)}/5.0
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{app.documents.length}</Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/reviewer/review/${app.id}`}>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
