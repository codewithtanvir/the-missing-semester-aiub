# Setup Instructions

Run these commands in PowerShell from the project directory:

```powershell
# Navigate to the project
cd o:\valult\course-resources-app

# Install dependencies
npm install

# Copy the example environment file
Copy-Item .env.local.example .env.local

# Edit .env.local with your Supabase credentials
notepad .env.local

# Run the development server
npm run dev
```

Then open http://localhost:3000 in your browser.
