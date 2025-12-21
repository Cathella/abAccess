import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VisitCardProps {
  facility?: string;
  date?: string;
  doctor?: string;
  status?: string;
}

export function VisitCard({
  facility = "Healthcare Facility",
  date = "Today",
  doctor = "Dr. Name",
  status = "scheduled"
}: VisitCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{facility}</CardTitle>
          <Badge variant={status === "completed" ? "default" : "secondary"}>
            {status}
          </Badge>
        </div>
        <CardDescription>{doctor}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{date}</p>
      </CardContent>
    </Card>
  );
}
