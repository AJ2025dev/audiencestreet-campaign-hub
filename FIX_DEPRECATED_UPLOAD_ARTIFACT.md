# Fix for Deprecated actions/upload-artifact v3

## Issue
GitHub Actions is reporting an error:
```
Error: This request has been automatically failed because it uses a deprecated version of `actions/upload-artifact: v3`. Learn more: https://github.blog/changelog/2024-04-16-deprecation-notice-v3-of-the-artifact-actions/
```

## Solution
Update any workflow files that use `actions/upload-artifact@v3` to use `actions/upload-artifact@v4`.

## Steps to Fix

### Step 1: Check All Workflow Files
1. Go to your repository's `.github/workflows/` directory
2. Open each workflow file and look for:
   ```yaml
   uses: actions/upload-artifact@v3
   ```

### Step 2: Update to v4
Change any instances of:
```yaml
uses: actions/upload-artifact@v3
```
to:
```yaml
uses: actions/upload-artifact@v4
```

### Step 3: Example Fix
Before:
```yaml
- name: Upload test results
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

After:
```yaml
- name: Upload test results
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
```

## Common Locations to Check
1. `.github/workflows/` directory
2. Any workflow files in subdirectories
3. Workflow templates or reusable workflows

## Verification
1. After making changes, commit and push the workflow files
2. Trigger the workflow again to see if the error is resolved
3. Check the GitHub Actions logs to confirm the fix

## Additional Notes
- The v4 version has the same parameters as v3, so no other changes are needed
- If you can't find any v3 references in your repository, the error might be coming from:
  - A workflow in a different branch
  - A workflow in a forked repository
  - A workflow being called from another repository
  - A cached workflow run that's still showing the old error

## Next Steps
1. Search your entire repository for `upload-artifact@v3`
2. Update any instances found to `upload-artifact@v4`
3. Commit and push the changes
4. Re-run the workflow to verify the fix