<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f936dc34-4147-4df3-9620-8b93c96f09a3

## Features

- Track daily habits and earn XP
- Complete quests and battle weekly bosses
- Catch Pokemon as rewards
- Export your data to Google Sheets (CSV format)

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Export to Google Sheets

The app includes CSV export functionality that allows you to import your data into Google Sheets:

1. Click "📊 Export Habits to CSV" to download all your daily habit tracking data
2. Click "✅ Export Tasks to CSV" to download all your task history
3. Open Google Sheets and go to File > Import
4. Upload the CSV file and follow the import wizard

The CSV files include:
- **Habits**: All daily metrics including business activities, health habits, and XP earned
- **Tasks**: Task title, category, XP reward, completion status, and timestamps

You can then use Google Sheets to create charts, analyze trends, and share your progress!
