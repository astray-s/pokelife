# Google Sheets Auto-Sync Setup

This guide will help you set up automatic syncing of your PokeLife data to Google Sheets.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "PokeLife Tracker" (or whatever you prefer)
4. Create two sheets (tabs):
   - **Habits** - for daily metrics
   - **Tasks** - for task tracking

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. Delete any existing code
3. Paste the following code:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Sync Habits
    if (data.habits && data.habits.length > 0) {
      const habitsSheet = ss.getSheetByName('Habits') || ss.insertSheet('Habits');
      
      // Clear existing data
      habitsSheet.clear();
      
      // Headers
      const headers = [
        'Date', 'XP Earned',
        'Work Hours', 'Discovery Calls', 'Networking Calls', 'Sales Calls',
        'First DMs', 'Follow-ups', 'Commenting Mins', 'Posts Created', 'Posts Posted',
        'Calls Booked', 'Calls Taken', 'Total DMs',
        'Time Asleep', 'Time Awake', 'Cold Showers', 'Fast Hours', 'Exercise Type', 'Food Tracking',
        'Affirmations', 'Visualizations', 'Plan Tomorrow', 'Story List', 'Journal',
        'YouTube', 'Reels', 'Shorts', 'Processed Food', 'Gaming'
      ];
      
      habitsSheet.appendRow(headers);
      
      // Data rows
      data.habits.forEach(row => {
        habitsSheet.appendRow([
          row.date, row.xpEarned,
          row.workHours, row.discoveryCalls, row.networkingCalls, row.salesCalls,
          row.firstDmsSent, row.followUpsSent, row.commentingMinutes, row.postsCreated, row.postsPosted,
          row.callsBooked, row.callsTaken, row.totalDmsSent,
          row.timeAsleep, row.timeAwake, row.coldShowers, row.fastHours, row.exerciseType, row.foodTracking,
          row.affirmations, row.visualizations, row.planTomorrow, row.storyList, row.journal,
          row.youtube, row.reels, row.shorts, row.processedFood, row.gaming
        ]);
      });
      
      // Format header row
      habitsSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f3f4f6');
    }
    
    // Sync Tasks
    if (data.tasks && data.tasks.length > 0) {
      const tasksSheet = ss.getSheetByName('Tasks') || ss.insertSheet('Tasks');
      
      // Clear existing data
      tasksSheet.clear();
      
      // Headers
      const headers = ['Title', 'Category', 'XP Reward', 'Completed', 'Created At', 'Completed At'];
      tasksSheet.appendRow(headers);
      
      // Data rows
      data.tasks.forEach(row => {
        tasksSheet.appendRow([
          row.title,
          row.category,
          row.xpReward,
          row.completed ? 'Yes' : 'No',
          row.createdAt,
          row.completedAt
        ]);
      });
      
      // Format header row
      tasksSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f3f4f6');
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (💾 icon)
5. Name your project (e.g., "PokeLife Sync")

## Step 3: Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: "PokeLife Sync API"
   - **Execute as**: Me
   - **Who has access**: Anyone
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** > **Go to [Project Name] (unsafe)**
9. Click **Allow**
10. **Copy the Web app URL** (it looks like: `https://script.google.com/macros/s/...`)

## Step 4: Configure PokeLife App

1. Open your PokeLife app
2. Go to the **History** tab
3. Scroll to **Google Sheets Sync** section
4. Paste the Web app URL
5. Toggle **Auto-sync on every update** to ON
6. Click **Sync Now** to test

## Done! 🎉

Your data will now automatically sync to Google Sheets every time you:
- Save daily metrics
- Add a new task
- Complete a task
- Delete a task

## Troubleshooting

**Sync not working?**
- Make sure the URL is correct (starts with `https://script.google.com/macros/s/`)
- Check that you deployed the script as "Anyone" can access
- Try clicking "Sync Now" manually to test
- Check your browser console for errors (F12)

**Want to update the script?**
1. Make changes in Apps Script editor
2. Click **Deploy** > **Manage deployments**
3. Click the pencil icon ✏️
4. Change version to **New version**
5. Click **Deploy**

## Privacy & Security

- Your data is sent directly from your browser to your Google Sheet
- No third-party servers are involved
- Only you have access to your Google Sheet
- The script runs under your Google account
- Completely free with no limits!
