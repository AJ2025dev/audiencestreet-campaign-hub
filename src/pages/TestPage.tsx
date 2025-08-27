import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            If you can see this page, the React app is working correctly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}