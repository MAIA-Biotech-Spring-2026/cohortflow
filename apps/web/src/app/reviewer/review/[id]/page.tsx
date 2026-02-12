"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { FileList } from "@/components/file-upload";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReviewApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const { data, isLoading } = trpc.reviewer.getApplicationForReview.useQuery({
    applicationId,
  });

  const { data: existingReview } = trpc.reviewer.getMyReview.useQuery({
    applicationId,
  });

  const submitReview = trpc.reviewer.submitReview.useMutation({
    onSuccess: () => {
      router.push("/reviewer/queue");
    },
  });

  const [scores, setScores] = useState<Record<string, number>>(
    existingReview?.scores || {}
  );
  const [comments, setComments] = useState(existingReview?.comments || "");
  const [recommendation, setRecommendation] = useState<
    "accept" | "reject" | "waitlist" | "interview"
  >(existingReview?.recommendation || "accept");

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

  if (!data) {
    return <div>Application not found</div>;
  }

  const { application, applicant, program, reviews } = data;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitReview.mutateAsync({
      applicationId,
      programId: application.programId,
      scores,
      comments,
      recommendation,
    });
  };

  const totalScore = program?.rubric.criteria.reduce((sum, criterion) => {
    const score = scores[criterion.id] || 0;
    return sum + (score / criterion.maxScore) * criterion.weight * 5;
  }, 0) || 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/reviewer/queue">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Queue
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Review Application</h2>
        <p className="text-muted-foreground mt-2">
          Evaluate this application using the rubric below.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Applicant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">
                {applicant?.firstName} {applicant?.lastName}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{applicant?.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium">{applicant?.phone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">
                {applicant?.city}, {applicant?.state}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm items-center">
              <span className="text-muted-foreground">Status:</span>
              <StatusBadge status={application.status} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Program:</span>
              <span className="font-medium">{program?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reviews:</span>
              <Badge variant="outline">{reviews?.length || 0}</Badge>
            </div>
            {reviews && reviews.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Score:</span>
                <Badge variant="secondary">
                  {(
                    reviews.reduce((sum, r) => sum + r.totalScore, 0) /
                    reviews.length
                  ).toFixed(1)}
                  /5.0
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Responses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(application.responses).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label className="text-base capitalize">
                {key.replace(/_/g, " ")}
              </Label>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {value}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <FileList files={application.documents} />
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Rubric</CardTitle>
            <CardDescription>
              Score each criterion from 0 to {program?.rubric.criteria[0]?.maxScore || 5}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {program?.rubric.criteria.map((criterion) => (
              <div key={criterion.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Label className="text-base">{criterion.name}</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {criterion.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Weight: {(criterion.weight * 100).toFixed(0)}%
                    </p>
                  </div>
                  <select
                    value={scores[criterion.id] || 0}
                    onChange={(e) =>
                      setScores({
                        ...scores,
                        [criterion.id]: parseInt(e.target.value),
                      })
                    }
                    className="ml-4 rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    {[...Array(criterion.maxScore + 1)].map((_, i) => (
                      <option key={i} value={i}>
                        {i} / {criterion.maxScore}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Score:</span>
                <Badge variant="default" className="text-base px-3 py-1">
                  {totalScore.toFixed(2)} / 5.0
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comments & Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Provide detailed feedback on the application..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recommendation">Recommendation</Label>
              <select
                id="recommendation"
                value={recommendation}
                onChange={(e) =>
                  setRecommendation(
                    e.target.value as "accept" | "reject" | "waitlist" | "interview"
                  )
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="accept">Accept</option>
                <option value="interview">Interview</option>
                <option value="waitlist">Waitlist</option>
                <option value="reject">Reject</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={submitReview.isPending}
            className="flex-1"
          >
            {submitReview.isPending
              ? "Submitting..."
              : existingReview
              ? "Update Review"
              : "Submit Review"}
          </Button>
          <Link href="/reviewer/queue">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
