# Real‑Time Test Case Scenarios

These scenarios can be executed manually or automated via a test runner to verify that real data flows through the system. They reflect the current state of the application as of 2025‑08‑08.

## Test Case 1: Advertiser Management

**Scenario**: Create a new advertiser and verify it appears in the list.

**Steps**:
1. Sign in to the application.
2. Navigate to the **Advertisers** page (`/advertisers`).
3. Click **Create Advertiser**.
4. Fill in the form (e.g., Company name: `Test Corp`, Contact email: `contact@testcorp.com`).
5. Submit the form.
6. Verify that the new advertiser appears in the grid with:
   * Campaigns = `0`
   * Total Spend = `$0`
   * Company name and email displayed.

**Expected Result**: The advertiser is persisted to the `profiles` table and displayed dynamically; no static mock data remains.

## Test Case 2: Campaign Creation and Persistence

**Scenario**: Launch a campaign for an existing advertiser.

**Steps**:
1. From the **Advertisers** page, click **View Campaigns** for an advertiser.
2. On the campaigns page, click **Create Campaign**.
3. Fill in required fields (name, objective, budgets, dates). Select at least one DSP/SSP.
4. Generate a strategy and click **Launch Campaign**.
5. Confirm that the campaign appears in the table with correct budgets and dates.

**Expected Result**: The campaign is inserted into the `campaigns` table. After refresh, the campaign remains in the list.

## Test Case 3: Domain Lists Management

**Scenario**: Add and edit a domain allowlist entry.

**Steps**:
1. Navigate to **Domain Lists** (`/domain-lists`).
2. Click **Add Entry**.
3. Select `allowlist`, choose `domain`, and enter a value such as `example.com`. Mark it as global and active.
4. Save the entry and verify it appears.
5. Toggle its active status, then edit the entry to change the domain.

**Expected Result**: The entry is saved in the `domain_lists` table and updates correctly when edited or toggled.

## Test Case 4: Dashboard Metrics

**Scenario**: Verify aggregated metrics reflect real campaign data.

**Steps**:
1. Launch several campaigns with varying budgets as in Test Case 2.
2. Navigate to the **Dashboard** (`/`).
3. Observe the summary cards (Total Spend, Impressions, Clicks, CTR) and the Recent Campaigns table.

**Expected Result**: Total Spend reflects the sum of campaign budgets. Other metrics (Impressions, Clicks, CTR) remain static until performance tracking is implemented.

## Notes

* These tests assume that Supabase is configured and accessible via the environment variables in `supabase/config.toml`.
* Further test cases should be added when campaign editing and performance tracking are implemented.
