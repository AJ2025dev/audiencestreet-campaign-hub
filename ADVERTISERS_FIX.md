# Advertisers.tsx Fix Implementation Guide

## Overview

This guide provides detailed instructions for fixing the backend integration in the Advertisers.tsx file. The current implementation only logs to the console, but it should save data to the Supabase database and fetch real data from the database.

## Current Issues

1. The `handleCreateAdvertiser` function only logs to the console
2. Uses mock data instead of fetching from database
3. No database integration for saving advertiser data

## Implementation Steps

### 1. Import Required Dependencies

Add the following imports at the top of the file:

```javascript
import { useAuth } from "@/hooks/useAuth"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
```

### 2. Set Up Authentication and Query Client

Add these hooks after the existing `useState` hooks:

```javascript
const { user } = useAuth()
const queryClient = useQueryClient()
```

### 3. Fetch Advertisers from Database

Replace the mock data with a query to fetch real data from the database:

```javascript
// Fetch advertisers from database
const { data: advertisersData, isLoading, isError } = useQuery({
  queryKey: ["advertisers", user?.id],
  enabled: !!user?.id,
  queryFn: async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "advertiser")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data as any[];
  },
})
```

### 4. Create Advertiser Mutation

Add the advertiser creation mutation:

```javascript
// Advertiser creation mutation
const createAdvertiserMutation = useMutation({
  mutationFn: async (advertiserData: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        ...advertiserData,
        role: 'advertiser',
        user_id: user?.id, // This would be the advertiser's user ID if they have one
        // For now, we'll create a profile entry for the advertiser
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['advertisers'] })
    toast.success('Advertiser created successfully!')
    setIsCreateDialogOpen(false)
    setFormData({ name: "", industry: "", contactEmail: "", description: "" })
  },
  onError: (error: any) => {
    toast.error(`Failed to create advertiser: ${error.message}`)
  },
})
```

### 5. Update handleCreateAdvertiser Function

Replace the existing `handleCreateAdvertiser` function with:

```javascript
const handleCreateAdvertiser = () => {
  if (!formData.name) {
    toast.error('Please enter an advertiser name')
    return
  }
  
  if (!user) {
    toast.error('You must be logged in to create an advertiser')
    return
  }
  
  // Save advertiser to database
  createAdvertiserMutation.mutate({
    company_name: formData.name,
    contact_email: formData.contactEmail,
    // Map other fields as needed
  })
}
```

### 6. Update Loading and Error States

Add loading and error states to the UI:

```javascript
if (isLoading) {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    </div>
  )
}

if (isError) {
  return (
    <div className="text-center text-destructive">
      Failed to load advertisers. Please try again later.
    </div>
  )
}
```

### 7. Update Advertiser Display

Update the advertiser display to use the real data:

```javascript
{/* Advertisers Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {advertisersData && advertisersData.map((advertiser) => (
    <Card key={advertiser.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{advertiser.company_name}</CardTitle>
              <CardDescription>{advertiser.industry || "Not specified"}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewCampaigns(advertiser.id)}>
                <Eye className="h-4 w-4 mr-2" />
                View Campaigns
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge className="bg-success/10 text-success border-success/20">
            Active
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Campaigns</span>
          <span className="font-medium">-</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Spend</span>
          <span className="font-medium">-</span>
        </div>
        <p className="text-sm text-muted-foreground">{advertiser.description || "No description provided"}</p>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => handleViewCampaigns(advertiser.id)}
        >
          View Campaigns
        </Button>
      </CardContent>
    </Card>
  ))}
</div>
```

## Database Considerations

The application uses a `profiles` table with a role field to distinguish between different user types. For advertisers, you might want to:

1. Create a separate `advertisers` table if you need more specific fields
2. Use the existing `profiles` table with `role = 'advertiser'`
3. Create a relationship between agencies and advertisers if needed

## Testing

After implementing these changes, test the following:

1. Advertiser creation with valid data
2. Advertiser creation with invalid data (missing required fields)
3. Error handling and user feedback
4. Loading states during data fetching
5. Display of real advertiser data from database

## Security Considerations

- All database operations are performed with proper authentication
- Row Level Security (RLS) policies are already implemented in Supabase
- Input validation is performed before saving to database

## Performance Considerations

- React Query is used for efficient data fetching and caching
- Query invalidation ensures fresh data is displayed
- Toast notifications provide immediate feedback to users
- Loading and error states improve user experience