import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PackageCardProps {
  title?: string;
  description?: string;
  price?: string;
  status?: string;
}

export function PackageCard({
  title = "Package Name",
  description = "Package description",
  price = "UGX 0",
  status = "active"
}: PackageCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{price}</p>
      </CardContent>
    </Card>
  );
}
