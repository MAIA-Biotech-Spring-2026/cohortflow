"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { DEMO_PROGRAMS } from "@/lib/mock-data";

export default function ExportPage() {
  const [selectedProgram, setSelectedProgram] = useState(DEMO_PROGRAMS[0]?.id || "");
  const [isExporting, setIsExporting] = useState(false);

  const { data: csvData, refetch } = trpc.coordinator.exportApplications.useQuery(
    { programId: selectedProgram },
    { enabled: false }
  );

  const handleExport = async () => {
    setIsExporting(true);
    const result = await refetch();

    if (result.data) {
      // Create download link
      const blob = new Blob([result.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `applications_${selectedProgram}_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }

    setIsExporting(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Export Data</h2>
        <p className="text-muted-foreground mt-2">
          Download application data as CSV files.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Configuration</CardTitle>
          <CardDescription>
            Select a program and configure export settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="program">Select Program</Label>
            <select
              id="program"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {DEMO_PROGRAMS.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <Label>Export Options</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includePersonalInfo"
                  defaultChecked
                  className="rounded border-input"
                />
                <Label htmlFor="includePersonalInfo" className="cursor-pointer">
                  Include personal information
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeReviews"
                  defaultChecked
                  className="rounded border-input"
                />
                <Label htmlFor="includeReviews" className="cursor-pointer">
                  Include review scores and comments
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeDocuments"
                  defaultChecked
                  className="rounded border-input"
                />
                <Label htmlFor="includeDocuments" className="cursor-pointer">
                  Include document metadata
                </Label>
              </div>
            </div>
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting || !selectedProgram}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export to CSV"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-2">
            <p className="font-medium">Exported Fields:</p>
            <ul className="text-muted-foreground space-y-1 ml-4">
              <li>• Application ID</li>
              <li>• Applicant name and contact information</li>
              <li>• Application status</li>
              <li>• Submission date</li>
              <li>• Review count and average score</li>
              <li>• Document count</li>
            </ul>
          </div>

          <div className="text-sm space-y-2">
            <p className="font-medium">File Format:</p>
            <p className="text-muted-foreground">
              CSV (Comma-Separated Values) compatible with Excel, Google Sheets,
              and other spreadsheet applications.
            </p>
          </div>

          <div className="text-sm space-y-2">
            <p className="font-medium">Privacy Notice:</p>
            <p className="text-muted-foreground">
              Exported data contains sensitive personal information. Please handle
              according to your organization's data protection policies.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
