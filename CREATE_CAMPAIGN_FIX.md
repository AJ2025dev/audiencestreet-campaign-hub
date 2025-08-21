# CreateCampaign.tsx Fix Implementation Guide

## Overview

This guide provides detailed instructions for fixing the backend integration in the CreateCampaign.tsx file. The current implementation only logs to the console, but it should save data to the Supabase database.

## Current Issues

1. The `launchCampaign` function only logs to the console
2. Form fields are not properly connected to state variables
3. No database integration for saving campaign data

## Implementation Steps

### 1. Import Required Dependencies

Add the following imports at the top of the file:

```javascript
import { useAuth } from "@/hooks/useAuth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
```

### 2. Set Up Authentication and Query Client

Add these hooks after the existing `useState` hooks:

```javascript
const { user } = useAuth()
const queryClient = useQueryClient()
```

### 3. Create Campaign Mutation

Add the campaign creation mutation after the `useState` hooks:

```javascript
// Campaign creation mutation
const createCampaignMutation = useMutation({
  mutationFn: async (campaignData: any) => {
    const { data, error } = await supabase
      .from('campaigns')
      .insert(campaignData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    toast.success('Campaign created successfully!')
    navigate('/campaigns')
  },
  onError: (error: any) => {
    toast.error(`Failed to create campaign: ${error.message}`)
  },
})
```

### 4. Connect Form Fields to State Variables

Update the budget and date fields to connect to state variables:

```javascript
{/* Budget & Schedule */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <DollarSign className="h-5 w-5" />
      Budget & Schedule
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="total-budget">Total Budget</Label>
        <Input 
          id="total-budget"
          placeholder="$10,000"
          type="number"
          value={campaignData.budget}
          onChange={(e) => setCampaignData(prev => ({ ...prev, budget: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="daily-budget">Daily Budget</Label>
        <Input 
          id="daily-budget"
          placeholder="$100"
          type="number"
          value={campaignData.dailyBudget}
          onChange={(e) => setCampaignData(prev => ({ ...prev, dailyBudget: e.target.value }))}
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="start-date">Start Date</Label>
        <Input 
          id="start-date"
          type="date"
          value={campaignData.startDate}
          onChange={(e) => setCampaignData(prev => ({ ...prev, startDate: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="end-date">End Date</Label>
        <Input 
          id="end-date"
          type="date"
          value={campaignData.endDate}
          onChange={(e) => setCampaignData(prev => ({ ...prev, endDate: e.target.value }))}
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label>Budget Pacing</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select pacing strategy" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="standard">Standard (Even distribution)</SelectItem>
          <SelectItem value="accelerated">Accelerated (Spend as fast as possible)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </CardContent>
</Card>
```

### 5. Update Targeting Fields

Update the targeting fields to connect to state variables:

```javascript
{/* Demographics */}
<div className="space-y-4">
  <h4 className="font-medium text-foreground">Demographics</h4>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="space-y-2">
      <Label>Age Range</Label>
      <div className="flex items-center gap-2">
        <Input 
          placeholder="18" 
          type="number" 
          value={campaignData.targeting.age.min}
          onChange={(e) => setCampaignData(prev => ({
            ...prev,
            targeting: {
              ...prev.targeting,
              age: {
                ...prev.targeting.age,
                min: parseInt(e.target.value) || 18
              }
            }
          }))}
        />
        <span className="text-muted-foreground">to</span>
        <Input 
          placeholder="65" 
          type="number" 
          value={campaignData.targeting.age.max}
          onChange={(e) => setCampaignData(prev => ({
            ...prev,
            targeting: {
              ...prev.targeting,
              age: {
                ...prev.targeting.age,
                max: parseInt(e.target.value) || 65
              }
            }
          }))}
        />
      </div>
    </div>
    
    <div className="space-y-2">
      <Label>Gender</Label>
      <Select 
        value={campaignData.targeting.gender}
        onValueChange={(value) => setCampaignData(prev => ({
          ...prev,
          targeting: {
            ...prev.targeting,
            gender: value
          }
        }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="All genders" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All genders</SelectItem>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label>Location</Label>
      <Input 
        placeholder="United States" 
        value={campaignData.targeting.locations[0] || ""}
        onChange={(e) => setCampaignData(prev => ({
          ...prev,
          targeting: {
            ...prev.targeting,
            locations: [e.target.value]
          }
        }))}
      />
    </div>
  </div>
</div>
```

### 6. Update launchCampaign Function

Replace the existing `launchCampaign` function with:

```javascript
const launchCampaign = () => {
  // Validate required fields
  if (!campaignData.name) {
    toast.error('Please enter a campaign name')
    return
  }
  
  if (!campaignData.advertiserId) {
    toast.error('Please select an advertiser')
    return
  }
  
  if (!user) {
    toast.error('You must be logged in to create a campaign')
    return
  }
  
  // Create campaign object for database
  const campaignPayload = {
    name: campaignData.name,
    budget: parseFloat(campaignData.budget) || 0,
    daily_budget: parseFloat(campaignData.dailyBudget) || null,
    start_date: campaignData.startDate || new Date().toISOString(),
    end_date: campaignData.endDate || null,
    status: 'draft',
    user_id: user.id,
    targeting_config: {
      age: campaignData.targeting.age,
      gender: campaignData.targeting.gender,
      locations: campaignData.targeting.locations,
      interests: campaignData.targeting.interests,
      behaviors: campaignData.targeting.behaviors
    },
    domain_lists: null, // Will be updated when domain lists are implemented
    frequency_caps: null, // Will be updated when frequency capping is implemented
  }
  
  // Save campaign to database
  createCampaignMutation.mutate(campaignPayload)
}
```

## Testing

After implementing these changes, test the following:

1. Campaign creation with valid data
2. Campaign creation with invalid data (missing required fields)
3. Error handling and user feedback
4. Navigation to campaigns page after successful creation

## Security Considerations

- All database operations are performed with proper authentication
- Row Level Security (RLS) policies are already implemented in Supabase
- Input validation is performed before saving to database

## Performance Considerations

- React Query is used for efficient data fetching and caching
- Query invalidation ensures fresh data is displayed
- Toast notifications provide immediate feedback to users