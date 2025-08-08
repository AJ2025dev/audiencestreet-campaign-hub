# Real-Time User Test Cases for DSP Platform

## Test Environment Setup
- **URL**: https://659000ac-be11-4322-aab0-8a31f355427d.lovableproject.com
- **Current Route**: `/auth`
- **Test Date**: 2025-08-08
- **Status**: Active testing of GitHub changes integration
- **Test Dashboard**: Available at `/test-dashboard` for automated testing

## 🚀 End-to-End User Scenarios (Priority Tests)

### Test Case 1: Advertiser Management
**Scenario**: Create a new advertiser and verify it appears in the list
**Status**: ⚠️ PARTIALLY IMPLEMENTED - Uses mock data, needs Supabase integration
**Steps**:
1. Sign in to the application
2. Navigate to **Advertisers** page (`/advertisers`)
3. Click "Create Advertiser" button
4. Fill form:
   - Company name: `Test Corp Inc`
   - Industry: `Technology`
   - Contact email: `test@testcorp.com`
   - Description: `Test advertiser for E2E validation`
5. Click "Create Advertiser"
6. Verify new advertiser appears in grid with:
   - Campaigns = 0
   - Total Spend = $0
   - Company name and email displayed (not placeholder values)

**Expected Results**:
- ✅ Form displays correctly
- ⚠️ Currently only logs to console, doesn't persist to database
- ⚠️ Uses hardcoded mock data in display
- **NEEDS**: Supabase integration for advertiser CRUD operations

### Test Case 2: Campaign Creation and Persistence  
**Scenario**: Launch a campaign for an advertiser
**Status**: ⚠️ PARTIALLY IMPLEMENTED - Uses mock data, needs Supabase integration
**Steps**:
1. From Advertisers page, click "View Campaigns" for any advertiser
2. Navigate to `/advertisers/{id}/campaigns`
3. Click "Create Campaign"
4. Fill required fields:
   - Name: `Q1 2025 Brand Campaign`
   - Objective: `Brand Awareness`
   - Budget: `$25,000`
   - Daily Budget: `$1,000`
   - Start Date: Current date
   - End Date: 3 months from now
   - Select DSPs/SSPs
5. Generate campaign strategy with AI button
6. Click "Launch Campaign"
7. Verify campaign appears in campaigns table

**Expected Results**:
- ✅ Campaign creation form exists
- ⚠️ Currently uses mock data display
- ⚠️ No actual persistence to Supabase campaigns table
- **NEEDS**: Full Supabase integration for campaigns CRUD

### Test Case 3: Domain Lists Management
**Scenario**: Add and edit domain allowlist entry
**Status**: ✅ FULLY IMPLEMENTED - Connected to Supabase
**Steps**:
1. Navigate to **Domain Lists** page (`/domain-lists`)
2. Click "Add Entry" button
3. Configure entry:
   - List Type: `allowlist`
   - Entry Type: `domain`
   - Value: `example.com`
   - Description: `Test domain for validation`
   - Apply Globally: `true`
   - Active: `true`
4. Click "Add Entry"
5. Verify entry appears in table
6. Toggle Active status on/off
7. Click Edit button, modify domain to `updated-example.com`
8. Save changes and verify update

**Expected Results**:
- ✅ Fully functional with Supabase integration
- ✅ Real-time updates and persistence
- ✅ Toggle functionality works
- ✅ Edit functionality works
- ✅ No hardcoded mock data

### Test Case 4: Dynamic Advertiser and Campaign Stats
**Scenario**: Check aggregated metrics on dashboard
**Status**: ⚠️ PARTIALLY IMPLEMENTED - Uses static mock data
**Steps**:
1. After creating campaigns with different budgets, go to Dashboard (`/`)
2. Check summary cards:
   - Total Spend
   - Impressions  
   - Clicks
   - CTR
3. Verify "Recent Campaigns" table shows latest campaigns
4. Confirm metrics reflect actual data, not static values

**Expected Results**:
- ✅ Dashboard displays metrics
- ⚠️ Currently shows static mock data
- ⚠️ Not connected to real campaign/advertiser data
- **NEEDS**: Integration with campaigns table for dynamic stats

## 🔐 Authentication Test Scenarios

### Test Case 1: Admin User Registration & Login
**Scenario**: Create and verify admin access
**Steps**:
1. Navigate to `/auth`
2. Click "Sign Up" tab
3. Enter test data:
   - Email: `admin@dsp.com`
   - Company: `DSP Admin`
   - Account Type: `Admin`
   - Password: `admin123456`
   - Confirm Password: `admin123456`
4. Click "Create Account"
5. Check email for confirmation (if required)
6. Return to sign-in and login with credentials
7. Verify redirect to dashboard
8. Check console for any error logs

**Expected Results**:
- ✅ Account creation success message
- ✅ Email confirmation sent (if enabled)
- ✅ Successful login with improved error logging
- ✅ Admin role properly assigned in profile
- ✅ Access to admin-only features

### Test Case 2: Agency User Flow
**Scenario**: Agency user managing advertiser relationships
**Steps**:
1. Sign up as agency: `agency@testdsp.com`
2. Company: `Test Agency LLC`
3. Role: `Agency`
4. Login and verify dashboard access
5. Navigate to `/advertisers` page
6. Test campaign creation for clients
7. Verify agency-specific permissions

### Test Case 3: Advertiser User Flow  
**Scenario**: Direct advertiser account management
**Steps**:
1. Sign up as advertiser: `advertiser@brand.com`
2. Company: `Brand Corp`
3. Role: `Advertiser`  
4. Login and test campaign self-management
5. Verify limited access (no agency features)

## 📊 Dashboard Real-Time Testing

### Test Case 4: Dashboard Metrics Validation
**Scenario**: Verify dashboard data and interactions
**Steps**:
1. Login as admin user
2. Navigate to dashboard (`/`)
3. Check metric cards display:
   - Total Spend: $24,680
   - Impressions: 4.2M
   - Clicks: 88.3K
   - CTR: 2.08%
4. Verify chart rendering (Performance Trends, Daily Spend)
5. Test campaign table interactions
6. Click campaign action buttons (Play/Pause)
7. Test "Create Campaign" button functionality

**Expected Results**:
- ✅ All metrics display correctly
- ✅ Charts render with proper data visualization  
- ✅ Campaign table shows active campaigns
- ✅ Interactive elements respond properly
- ✅ Smooth animations and hover effects

### Test Case 5: Real-Time Data Updates
**Scenario**: Test live data synchronization
**Steps**:
1. Open dashboard in multiple browser tabs
2. Simulate campaign status changes
3. Test metric updates across sessions
4. Verify WebSocket/real-time connections
5. Check for data consistency

## 🚀 Campaign Management Testing

### Test Case 6: Campaign Creation Flow
**Scenario**: End-to-end campaign creation
**Steps**:
1. Click "Create Campaign" from dashboard
2. Navigate to `/campaigns/create`
3. Fill out campaign form with test data:
   - Name: `Test Campaign Q1 2025`
   - Budget: `$10,000`
   - Daily Budget: `$500`
   - Start Date: Current date
   - End Date: 30 days from now
4. Configure targeting parameters
5. Set frequency capping rules
6. Add domain lists (allowlist/blocklist)
7. Submit and verify creation

### Test Case 7: Campaign Status Management
**Scenario**: Test campaign lifecycle management
**Steps**:
1. Navigate to `/campaigns`
2. Test campaign status changes:
   - Active → Paused
   - Paused → Active  
   - Draft → Active
3. Verify status updates in real-time
4. Check permission-based access control

## 🔧 Technical Error Testing

### Test Case 8: Enhanced Error Logging Validation
**Scenario**: Test the GitHub changes for improved error handling
**Steps**:
1. Attempt login with invalid credentials:
   - Email: `invalid@test.com`
   - Password: `wrongpassword`
2. Check browser console for detailed error logging
3. Verify error messages display properly
4. Test network connectivity issues
5. Validate error recovery mechanisms

**Verify Console Output**:
```javascript
// Expected console logs from GitHub changes:
Sign-in error: {error object details}
Sign-in failed: Invalid login credentials
```

### Test Case 9: Network & Performance Testing
**Scenario**: Test application resilience and performance
**Steps**:
1. Monitor network requests in DevTools
2. Test application with slow network simulation
3. Verify loading states and error boundaries  
4. Test offline/online state handling
5. Check for memory leaks during navigation

## 📱 Responsive & Cross-Browser Testing

### Test Case 10: Multi-Device Compatibility
**Scenario**: Test responsive design and functionality
**Steps**:
1. Test on desktop browsers (Chrome, Firefox, Safari, Edge)
2. Test on mobile devices (iOS Safari, Chrome Mobile)
3. Test tablet layouts and interactions
4. Verify touch interactions work properly
5. Check accessibility features (keyboard navigation, screen readers)

## 🔄 Real-Time Collaboration Features

### Test Case 11: Multi-User Session Testing
**Scenario**: Test concurrent user interactions
**Steps**:
1. Login as admin in Browser 1
2. Login as agency in Browser 2  
3. Login as advertiser in Browser 3
4. Test simultaneous:
   - Campaign creation/editing
   - Status changes
   - Data updates
   - Permission enforcement
5. Verify data consistency across all sessions

### Test Case 12: WebSocket Connection Testing
**Scenario**: Test real-time communication channels
**Steps**:
1. Open browser DevTools → Network tab
2. Filter for WebSocket connections
3. Monitor connection establishment
4. Test connection recovery after network interruption
5. Verify message queuing during disconnection

## 🛡️ Security & Permission Testing

### Test Case 13: Role-Based Access Control
**Scenario**: Verify security boundaries
**Steps**:
1. Test admin access to `/admin` route
2. Verify agency users cannot access admin features  
3. Confirm advertisers have limited permissions
4. Test direct URL access to protected routes
5. Validate API endpoint security

### Test Case 14: Data Privacy & Isolation
**Scenario**: Test data access restrictions
**Steps**:
1. Create campaigns as different user types
2. Verify users only see their own data
3. Test agency-advertiser relationship data sharing
4. Confirm admin oversight capabilities
5. Test data export/import permissions

## 📊 Performance Benchmarks

### Test Case 15: Load Performance Testing
**Scenario**: Measure application performance metrics
**Steps**:
1. Measure initial page load time
2. Test dashboard chart rendering performance  
3. Monitor memory usage during navigation
4. Test large dataset handling (1000+ campaigns)
5. Benchmark API response times

**Performance Targets**:
- Initial load: < 3 seconds
- Dashboard render: < 2 seconds  
- API responses: < 500ms
- Memory usage: < 100MB sustained

## 🔍 GitHub Integration Testing

### Test Case 16: Code Deployment Verification
**Scenario**: Verify GitHub changes are properly deployed
**Steps**:
1. Check if enhanced error logging is active
2. Verify all recent commits are reflected in live app
3. Test any new features from latest pushes
4. Confirm build process completed successfully
5. Validate environment variables and configuration

## ⚠️ Error Recovery Testing

### Test Case 17: Failure Scenario Testing
**Scenario**: Test application resilience
**Steps**:
1. Test database connection failures
2. Simulate API endpoint unavailability
3. Test Supabase authentication service interruption
4. Verify graceful error handling and user feedback
5. Test automatic retry mechanisms

## 📝 Test Execution Checklist

- [ ] All authentication flows tested
- [ ] Dashboard functionality verified
- [ ] Campaign management working
- [ ] Real-time updates functioning
- [ ] Error logging improvements active
- [ ] Performance benchmarks met
- [ ] Security boundaries enforced
- [ ] GitHub changes deployed successfully
- [ ] Multi-browser compatibility confirmed
- [ ] Mobile responsiveness verified

## 🚨 Critical Issues to Monitor

1. **Vite Server Connection**: Monitor for `server connection lost` errors
2. **Authentication Persistence**: Verify session management across page refreshes
3. **Real-time Sync**: Ensure WebSocket connections remain stable
4. **Memory Leaks**: Watch for increasing memory usage over time
5. **API Rate Limits**: Monitor Supabase API call patterns

## 📞 Support & Debugging

If issues arise during testing:
1. Check browser console for detailed error logs
2. Verify network connectivity and API responses
3. Test in incognito/private browsing mode
4. Clear browser cache and cookies
5. Review Supabase dashboard for backend issues

---

**Test Status**: ✅ Ready for execution
**Last Updated**: 2025-08-08T15:16:42Z
**Next Review**: After GitHub changes verification