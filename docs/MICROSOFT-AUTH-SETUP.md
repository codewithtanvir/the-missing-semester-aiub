# Microsoft Authentication Setup Guide

This guide will help you configure Microsoft (Azure AD) authentication for student login.

## 📋 Prerequisites

1. A Microsoft/Azure account
2. Your Supabase project already created
3. Access to Azure Portal

## 🔧 Step 1: Create Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **"New registration"**
4. Fill in the details:
   - **Name**: Course Resources App (or any name you prefer)
   - **Supported account types**: 
     - Choose "Accounts in any organizational directory and personal Microsoft accounts" (for broad access)
     - OR "Accounts in this organizational directory only" (if for specific organization)
   - **Redirect URI**: 
     - Platform: **Web**
     - URI: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
     - (Get this from Supabase → Authentication → Providers → Azure)
5. Click **"Register"**

## 🔑 Step 2: Get Client ID and Secret

### Get Client ID
1. After registration, you'll see the **Overview** page
2. Copy the **Application (client) ID** - you'll need this

### Create Client Secret
1. Go to **Certificates & secrets** (left sidebar)
2. Click **"New client secret"**
3. Add a description: "Course Resources App Secret"
4. Choose expiration: 24 months (or your preference)
5. Click **"Add"**
6. **IMPORTANT**: Copy the **Value** immediately - it won't be shown again!

## ⚙️ Step 3: Configure API Permissions

1. Go to **API permissions** (left sidebar)
2. Click **"Add a permission"**
3. Select **Microsoft Graph**
4. Select **Delegated permissions**
5. Add these permissions:
   - ✅ `email`
   - ✅ `openid`
   - ✅ `profile`
   - ✅ `User.Read`
6. Click **"Add permissions"**
7. Click **"Grant admin consent"** (if you have admin rights)

## 🗂️ Step 4: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find and enable **Azure** provider
4. Fill in the configuration:
   - **Azure Client ID**: Paste the Application (client) ID from Step 2
   - **Azure Secret**: Paste the client secret value from Step 2
   - **Azure Tenant**: 
     - For personal Microsoft accounts: `common`
     - For organizational accounts: Your Azure AD tenant ID
5. Copy the **Callback URL** shown in Supabase
6. Click **"Save"**

## 🔗 Step 5: Update Azure Redirect URI (if needed)

1. Go back to Azure Portal → Your App Registration
2. Go to **Authentication** (left sidebar)
3. Under **Platform configurations** → **Web**
4. Verify the Redirect URI matches Supabase's callback URL:
   ```
   https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
   ```
5. Click **"Save"**

## 🌐 Step 6: Update Your App Configuration

Your `.env.local` should already have:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

No additional environment variables needed for Azure auth!

## ✅ Step 7: Test the Authentication

1. Start your development server:
   ```powershell
   npm run dev
   ```

2. Open `http://localhost:3000`

3. Click **"Student Login"**

4. Click **"Sign in with Microsoft"**

5. You should be redirected to Microsoft login

6. After successful login, you'll be redirected back to the app

## 🎯 For Development Testing

If testing locally, you may need to add localhost redirect:

1. In Azure Portal → Your App Registration → **Authentication**
2. Add a platform → **Single-page application**
3. Add redirect URI: `http://localhost:3000/auth/callback`
4. Click **"Configure"**

## 🚀 For Production Deployment

When deploying to production (e.g., Vercel):

1. Add your production domain to Azure redirect URIs:
   ```
   https://your-domain.com/auth/callback
   https://your-domain.vercel.app/auth/callback
   ```

2. Supabase callback URL remains the same (Supabase handles the OAuth flow)

## 🔍 Troubleshooting

### Error: "Redirect URI mismatch"
- Verify the redirect URI in Azure matches Supabase's callback URL exactly
- Make sure there are no trailing slashes

### Error: "Invalid client secret"
- The secret may have expired
- Generate a new secret in Azure and update Supabase

### Error: "AADSTS50020: User account from identity provider does not exist"
- The account type doesn't match your Azure AD configuration
- Update "Supported account types" in Azure AD app settings

### Students can't log in
- Check if the Azure app is configured for the right account types
- Verify API permissions are granted
- Ensure admin consent is given for organizational accounts

## 📱 User Experience

After setup, students will:
1. Click "Student Login" on homepage
2. Click "Sign in with Microsoft"
3. Enter their Microsoft email
4. Authenticate with Microsoft
5. Get redirected back to app (logged in)
6. See their email in the header
7. Can browse and download course resources

## 🔐 Security Notes

- Client secret should be kept secure (only in Supabase dashboard)
- Never commit secrets to version control
- Regularly rotate client secrets (Azure allows multiple active secrets)
- Monitor authentication logs in Supabase dashboard
- Consider enabling MFA for admin accounts

## 📚 Additional Resources

- [Supabase Auth with Azure](https://supabase.com/docs/guides/auth/social-login/auth-azure)
- [Azure AD App Registration](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
