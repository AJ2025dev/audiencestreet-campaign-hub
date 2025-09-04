// Replace the fetchUsers function in src/pages/EnhancedAdmin.tsx with this:

const fetchUsers = async () => {
  try {
    // Get auth users (this will show all created users)
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('Error fetching auth users:', authError)
    }

    // Get profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (profileError) {
      console.error('Error fetching profiles:', profileError)
    }

    // Combine auth users with profiles
    const combinedUsers = (authUsers?.users || []).map(authUser => {
      const profile = profiles?.find(p => p.user_id === authUser.id)
      
      return {
        id: authUser.id,
        email: authUser.email,
        created_at: authUser.created_at,
        email_confirmed_at: authUser.email_confirmed_at,
        profiles: profile || {
          id: authUser.id,
          user_id: authUser.id,
          role: authUser.user_metadata?.role || 'user',
          company_name: authUser.user_metadata?.company_name || 'Unknown',
          contact_email: authUser.user_metadata?.contact_email || authUser.email,
          phone: authUser.user_metadata?.phone || '',
          address: authUser.user_metadata?.address || '',
          created_at: authUser.created_at,
          updated_at: authUser.updated_at
        }
      }
    })

    setUsers(combinedUsers)

  } catch (error) {
    console.error('Error fetching users:', error)
    // Fallback to demo data
    const demoUserId = '12345678-1234-4567-8901-123456789012'
    setUsers([
      {
        id: demoUserId,
        email: 'admin@example.com',
        created_at: new Date().toISOString(),
        profiles: {
          id: demoUserId,
          user_id: demoUserId,
          role: 'admin',
          company_name: 'Demo Admin',
          contact_email: 'admin@example.com',
          phone: '+1-555-0001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    ])
  }
}