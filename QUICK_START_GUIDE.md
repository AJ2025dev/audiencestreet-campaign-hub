# 🚀 QUICK START - Fix Your Navigation Issue

## ❌ **What Went Wrong**
You tried to run:
```bash
cd /https://supabase.com/dashboard/project/uzcmjulbpmeythxfusrm/deploy-minimal.sh
```

This won't work because:
- `https://supabase.com/...` is a **web URL**, not a file path
- You need to navigate to your **local project directory**

## ✅ **Correct Steps**

### **Step 1: Find Your Project Directory**
Your project should be in one of these common locations:

```bash
# Option A: Desktop
cd ~/Desktop/audiencestreet-campaign-hub

# Option B: Documents  
cd ~/Documents/audiencestreet-campaign-hub

# Option C: Downloads
cd ~/Downloads/audiencestreet-campaign-hub

# Option D: Home directory
cd ~/audiencestreet-campaign-hub

# Option E: Current directory (if you cloned it here)
ls -la
# Look for a folder named "audiencestreet-campaign-hub" or similar
```

### **Step 2: Verify You're in the Right Place**
Once you think you're in the project directory, check:

```bash
# You should see these files:
ls -la
# Should show: package.json, supabase/, deploy-minimal.sh, etc.

# Specifically check for the deployment script:
ls -la deploy-minimal.sh
```

### **Step 3: Make Script Executable (if needed)**
```bash
chmod +x deploy-minimal.sh
```

### **Step 4: Install Supabase CLI**
```bash
npm install -g supabase
```

### **Step 5: Login to Supabase**
```bash
supabase login
```

### **Step 6: Deploy**
```bash
./deploy-minimal.sh
```

## 🔍 **If You Can't Find the Project**

### **Download the Project Again:**

#### **Option A: Clone from GitHub**
```bash
cd ~/Desktop  # or wherever you want it
git clone https://github.com/AJ2025dev/audiencestreet-campaign-hub.git
cd audiencestreet-campaign-hub
```

#### **Option B: Download ZIP**
1. Go to: https://github.com/AJ2025dev/audiencestreet-campaign-hub
2. Click "Code" → "Download ZIP"  
3. Extract it to your Desktop
4. Navigate to the extracted folder

## 🧭 **Find Your Project Directory**

Run this command to search for it:

```bash
find ~ -name "audiencestreet-campaign-hub" -type d 2>/dev/null
```

Or search for the specific files:

```bash
find ~ -name "deploy-minimal.sh" 2>/dev/null
```

## ✅ **Quick Verification Commands**

Once you think you're in the right directory:

```bash
# Check you're in a project directory
pwd
# Should show something like: /Users/aj/Desktop/audiencestreet-campaign-hub

# Check required files exist
ls -la | grep -E "(package.json|supabase|deploy-minimal.sh)"

# Check supabase directory structure
ls -la supabase/functions/
# Should show: admin-create-user/ and agency-create-advertiser/
```

## 🚀 **Complete Commands (After Finding Project)**

```bash
# 1. Navigate to your project (replace with actual path)
cd /Users/aj/Desktop/audiencestreet-campaign-hub

# 2. Verify you're in the right place
ls -la deploy-minimal.sh

# 3. Install Supabase CLI
npm install -g supabase

# 4. Login
supabase login

# 5. Deploy
./deploy-minimal.sh
```

## 📍 **Most Likely Locations**

Try these commands one by one:

```bash
cd ~/Desktop && find . -name "audiencestreet-campaign-hub" -type d
cd ~/Documents && find . -name "audiencestreet-campaign-hub" -type d  
cd ~/Downloads && find . -name "audiencestreet-campaign-hub" -type d
```

## 💡 **Pro Tip**

Use tab completion to help navigate:
```bash
cd ~/Des[TAB]  # Will complete to Desktop
cd ~/Desktop/aud[TAB]  # Will complete to audiencestreet-campaign-hub
```

Let me know what you see when you run `find ~ -name "audiencestreet-campaign-hub" -type d 2>/dev/null` and I'll help you navigate to the right location!