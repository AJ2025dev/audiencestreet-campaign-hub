import { StatusBadge, StatusType } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FeatureStatus {
  feature: string;
  status: StatusType;
  description?: string;
}

interface TestCase {
  id: string;
  name: string;
  description: string;
  steps: string[];
  expected: string;
}

/**
 * TestDashboard
 *
 * This page provides a high‑level overview of the current feature implementation
 * status and enumerates test cases that can be performed manually or automated.
 * It complements the IMPLEMENTATION_STATUS.md and REALTIME_TEST_CASES.md files
 * by presenting the information within the application itself.
 */
const TestDashboard = () => {
  const navigate = useNavigate();

  const featureStatuses: FeatureStatus[] = [
    {
      feature: "Authentication",
      status: "complete",
      description: "User sign‑up, login, and role based access control.",
    },
    {
      feature: "User Profiles",
      status: "complete",
      description: "Profiles stored in Supabase with role metadata.",
    },
    {
      feature: "Domain Lists",
      status: "complete",
      description: "Allowlist/blocklist CRUD with Supabase integration.",
    },
    {
      feature: "Advertisers",
      status: "complete",
      description:
        "Advertiser CRUD and listing backed by Supabase. Campaign counts and spend aggregated.",
    },
    {
      feature: "Campaigns",
      status: "partial",
      description:
        "Create campaigns and list them. Editing, pausing and deleting coming soon.",
    },
    {
      feature: "Dashboard Metrics",
      status: "partial",
      description:
        "Budgets aggregated from campaigns. Impressions/clicks still static.",
    },
  ];

  const testCases: TestCase[] = [
    {
      id: "TC1",
      name: "Advertiser Management",
      description:
        "Create a new advertiser and verify it appears with zero campaigns and zero spend.",
      steps: [
        "Sign in and navigate to the Advertisers page.",
        "Click 'Create Advertiser' and complete the form.",
        "Submit the form and verify the new advertiser appears in the list.",
      ],
      expected:
        "The advertiser is persisted to Supabase with campaigns = 0 and total spend = $0.",
    },
    {
      id: "TC2",
      name: "Campaign Creation",
      description:
        "Launch a campaign for an advertiser and verify it persists across refreshes.",
      steps: [
        "Navigate to an advertiser’s campaigns page.",
        "Click 'Create Campaign', fill out details, generate a strategy and launch it.",
        "Refresh the page and verify the campaign appears.",
      ],
      expected:
        "The campaign is inserted into the 'campaigns' table and remains visible after refresh.",
    },
    {
      id: "TC3",
      name: "Domain List Management",
      description:
        "Add and edit domain entries in allowlists or blocklists.",
      steps: [
        "Navigate to Domain Lists.",
        "Add a new entry, marking it global or campaign specific.",
        "Toggle the entry’s active state and edit its value.",
      ],
      expected:
        "The entry is saved, can be toggled, edited, and persists in the table.",
    },
    {
      id: "TC4",
      name: "Dashboard Metrics",
      description:
        "Verify that dashboard summary cards reflect real budgets.",
      steps: [
        "Launch multiple campaigns with different budgets.",
        "Navigate to the Dashboard page.",
      ],
      expected:
        "Total Spend reflects the sum of campaign budgets. Impressions and clicks remain static until implemented.",
    },
  ];

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-6">Test Dashboard</h1>
      <div className="grid gap-6 lg:grid-cols-2 mb-10">
        {featureStatuses.map((item) => (
          <Card key={item.feature}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {item.feature}
              </CardTitle>
              <StatusBadge status={item.status} />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Test Cases</h2>
      <div className="space-y-6">
        {testCases.map((test) => (
          <Card key={test.id}>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                {test.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {test.description}
              </p>
              <div>
                <span className="font-medium">Steps:</span>
                <ul className="list-disc list-inside text-sm">
                  {test.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm">
                <span className="font-medium">Expected:</span> {test.expected}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
      </div>
    </div>
  );
};

export default TestDashboard;