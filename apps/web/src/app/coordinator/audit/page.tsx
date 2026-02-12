"use client";

import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

export default function AuditLogPage() {
  const { data, isLoading } = trpc.coordinator.getAuditLogs.useQuery({
    limit: 100,
    offset: 0,
  });

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

  const actionColors: Record<string, "default" | "secondary" | "success" | "warning" | "info"> = {
    "Created Application": "success",
    "Updated Application Status": "info",
    "Submitted Review": "success",
    "Created Program": "success",
    "Updated Program": "info",
    "Assigned as Reviewer": "info",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Audit Log</h2>
        <p className="text-muted-foreground mt-2">
          System activity and user actions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity ({data?.total || 0} total)</CardTitle>
            <Badge variant="secondary">Last 100 entries</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">
                    {formatDateTime(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{log.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        ID: {log.userId}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={actionColors[log.action] || "default"}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{log.entityType}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {log.entityId}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm text-muted-foreground truncate">
                      {log.details}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit Log Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="font-medium mb-2">Tracked Actions:</p>
            <ul className="text-muted-foreground space-y-1 ml-4">
              <li>• Application submissions and updates</li>
              <li>• Review submissions and modifications</li>
              <li>• Program creation and configuration changes</li>
              <li>• Reviewer assignments</li>
              <li>• Status changes and workflow transitions</li>
              <li>• Data exports and report generation</li>
            </ul>
          </div>

          <div>
            <p className="font-medium mb-2">Data Retention:</p>
            <p className="text-muted-foreground">
              Audit logs are retained for compliance and security purposes. Contact
              your system administrator for retention policy details.
            </p>
          </div>

          <div>
            <p className="font-medium mb-2">Security:</p>
            <p className="text-muted-foreground">
              All actions are timestamped and attributed to authenticated users.
              Logs cannot be modified or deleted by users.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
