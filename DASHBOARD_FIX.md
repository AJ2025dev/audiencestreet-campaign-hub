# Dashboard.tsx Fix Implementation Guide

## Overview

This guide provides detailed instructions for fixing the backend integration in the Dashboard.tsx file. The current implementation uses a mix of real data (from database) and mock data for charts. The charts should use real data from the database.

## Current Issues

1. Performance charts use mock data instead of real data from database
2. Campaign table shows real data but with placeholder values for metrics
3. Some metrics are not calculated from real campaign data

## Implementation Steps

### 1. Import Required Dependencies

The file already has the necessary imports, but we need to add a few more for the charts:

```javascript
// These are already imported
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// No additional imports needed
```

### 2. Fetch Real Performance Data

Replace the mock `performanceData` with a query to fetch real data from the database:

```javascript
// Remove the mock performanceData array

// Fetch real performance data
const { data: performanceData } = useQuery({
  queryKey: ["performance-data", user?.id],
  enabled: !!user?.id,
  queryFn: async () => {
    // This would fetch real performance data from your database
    // You might need to create a view or function in Supabase to aggregate this data
    const { data, error } = await supabase
      .rpc('get_campaign_performance_metrics', {
        user_id: user!.id
      });
    
    if (error) throw error;
    return data as { date: string; impressions: number; clicks: number; spend: number }[];
  },
})
```

### 3. Update Campaign Table to Show Real Metrics

Update the campaign table to show real metrics instead of placeholders:

```javascript
{recentCampaigns && recentCampaigns.length > 0 ? (
  recentCampaigns.slice(0, 5).map((campaign: any, index: number) => (
    <tr key={campaign.id} className={`border-b border-border/20 hover:bg-primary/5 transition-all duration-200 ${index % 2 === 0 ? 'bg-muted/10' : ''}`}>
      <td className="py-4 px-6 font-semibold text-foreground">{campaign.name}</td>
      <td className="py-4 px-6">
        <Badge 
          variant="secondary"
          className={campaign.status === "active" 
            ? "bg-success/10 text-success border-success/20 hover:bg-success/20" 
            : campaign.status === "paused"
            ? "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20"
            : "bg-muted/10 text-muted-foreground border-muted/20 hover:bg-muted/20"
          }
        >
          {campaign.status}
        </Badge>
      </td>
      <td className="py-4 px-6 font-medium">
        {campaign.metrics?.impressions ? 
          campaign.metrics.impressions.toLocaleString() : 
          '-'}
      </td>
      <td className="py-4 px-6 font-medium">
        {campaign.metrics?.clicks ? 
          campaign.metrics.clicks.toLocaleString() : 
          '-'}
      </td>
      <td className="py-4 px-6 font-medium text-primary">
        {campaign.metrics?.ctr ? 
          `${campaign.metrics.ctr.toFixed(2)}%` : 
          '-'}
      </td>
      <td className="py-4 px-6 font-bold text-foreground">
        ${campaign.budget?.toLocaleString() || 0}
      </td>
      <td className="py-4 px-6 font-medium">
        {campaign.metrics?.cpm ? 
          `$${campaign.metrics.cpm.toFixed(2)}` : 
          '-'}
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            {campaign.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-muted/50 transition-all duration-200"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan={8} className="py-8 text-center text-muted-foreground">
      No campaigns found. Create your first campaign to get started.
    </td>
  </tr>
)}
```

### 4. Create Database Functions for Metrics

You may need to create database functions to calculate metrics. Here's an example of what you might add to your Supabase database:

```sql
-- Function to get campaign performance metrics
CREATE OR REPLACE FUNCTION get_campaign_performance_metrics(user_id UUID)
RETURNS TABLE(
  date DATE,
  impressions INTEGER,
  clicks INTEGER,
  spend NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as date,
    SUM(impression_count) as impressions,
    SUM(click_count) as clicks,
    SUM(spend_cents) / 100.0 as spend
  FROM impression_tracking
  WHERE user_id = $1
  GROUP BY DATE(created_at)
  ORDER BY date;
END;
$$ LANGUAGE plpgsql;
```

### 5. Update Metrics Cards to Show Real Data

The metrics cards already use real data from the `get_user_metrics` RPC function, so no changes are needed there.

### 6. Add Loading and Error States

Add loading and error states for the performance data:

```javascript
// Add this to your component
const { data: performanceData, isLoading: isPerformanceLoading, isError: isPerformanceError } = useQuery({
  queryKey: ["performance-data", user?.id],
  enabled: !!user?.id,
  queryFn: async () => {
    // ... same query function as above
  },
})

// Update the charts to show loading and error states
{
  isPerformanceLoading ? (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ) : isPerformanceError ? (
    <div className="flex items-center justify-center h-64 text-destructive">
      Failed to load performance data
    </div>
  ) : (
    // ... existing chart components
  )
}
```

## Database Considerations

The application already has tables for tracking impressions and clicks. You may need to:

1. Create database functions to aggregate performance data
2. Create views to simplify complex queries
3. Add indexes on frequently queried fields (created_at, user_id, campaign_id)

## Testing

After implementing these changes, test the following:

1. Dashboard loads with real performance data
2. Campaign table shows real metrics
3. Loading and error states work correctly
4. Charts display real data correctly
5. Performance with large datasets

## Security Considerations

- All database operations are performed with proper authentication
- Row Level Security (RLS) policies are already implemented in Supabase
- Database functions should use parameterized queries to prevent SQL injection

## Performance Considerations

- Use React Query for efficient data fetching and caching
- Implement pagination for large datasets
- Use database indexes on frequently queried fields
- Consider implementing data aggregation at the database level for better performance
- Use suspense or loading states to improve user experience

## Alternative Approaches

1. **Real-time Updates**: Use Supabase real-time subscriptions to update charts as new data comes in
2. **Caching**: Implement longer cache times for performance data that doesn't change frequently
3. **Data Sampling**: For large datasets, consider sampling data for charts to improve performance
4. **Lazy Loading**: Load detailed metrics only when needed