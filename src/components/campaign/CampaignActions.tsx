import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
} from "lucide-react"

interface Campaign {
  id: string
  name: string
  status: string
  budget: number
  daily_budget?: number
  start_date: string
  end_date?: string
}

interface CampaignActionsProps {
  campaign: Campaign
  onUpdate?: () => void
}

export function CampaignActions({ campaign, onUpdate }: CampaignActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: campaign.name,
    budget: campaign.budget,
    daily_budget: campaign.daily_budget || 0,
    start_date: campaign.start_date.split('T')[0],
    end_date: campaign.end_date?.split('T')[0] || '',
  })
  
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const statusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const { error } = await supabase.rpc('update_campaign_status', {
        p_campaign_id: campaign.id,
        p_status: newStatus
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] })
      toast({
        title: "Success",
        description: `Campaign ${campaign.status === 'active' ? 'paused' : 'activated'} successfully`,
      })
      onUpdate?.()
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update campaign status",
        variant: "destructive",
      })
    }
  })

  const editMutation = useMutation({
    mutationFn: async (data: typeof editForm) => {
      const { error } = await supabase.rpc('update_campaign_budget', {
        p_campaign_id: campaign.id,
        p_budget: data.budget,
        p_daily_budget: data.daily_budget,
        p_start_date: new Date(data.start_date).toISOString(),
        p_end_date: data.end_date ? new Date(data.end_date).toISOString() : null
      })
      if (error) throw error

      // Also update the name
      const { error: nameError } = await supabase
        .from('campaigns')
        .update({ name: data.name })
        .eq('id', campaign.id)
      if (nameError) throw nameError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] })
      toast({
        title: "Success",
        description: "Campaign updated successfully",
      })
      setIsEditDialogOpen(false)
      onUpdate?.()
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update campaign",
        variant: "destructive",
      })
    }
  })

  const duplicateMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          name: `${campaign.name} (Copy)`,
          budget: campaign.budget,
          daily_budget: campaign.daily_budget,
          start_date: campaign.start_date,
          end_date: campaign.end_date,
          status: 'draft',
          user_id: user.id
        })
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] })
      toast({
        title: "Success",
        description: "Campaign duplicated successfully",
      })
      onUpdate?.()
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to duplicate campaign",
        variant: "destructive",
      })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaign.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] })
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      })
      onUpdate?.()
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      })
    }
  })

  const handleStatusToggle = () => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active'
    statusMutation.mutate(newStatus)
  }

  const handleEdit = () => {
    editMutation.mutate(editForm)
  }

  const handleDuplicate = () => {
    duplicateMutation.mutate()
  }

  const handleDelete = () => {
    deleteMutation.mutate()
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleStatusToggle}>
            {campaign.status === 'active' ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause Campaign
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Activate Campaign
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Campaign
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate Campaign
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Campaign
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="budget">Total Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                value={editForm.budget}
                onChange={(e) => setEditForm(prev => ({ ...prev, budget: parseFloat(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="daily_budget">Daily Budget ($)</Label>
              <Input
                id="daily_budget"
                type="number"
                step="0.01"
                value={editForm.daily_budget}
                onChange={(e) => setEditForm(prev => ({ ...prev, daily_budget: parseFloat(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={editForm.start_date}
                onChange={(e) => setEditForm(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date (Optional)</Label>
              <Input
                id="end_date"
                type="date"
                value={editForm.end_date}
                onChange={(e) => setEditForm(prev => ({ ...prev, end_date: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={editMutation.isPending}>
                {editMutation.isPending ? "Updating..." : "Update Campaign"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}