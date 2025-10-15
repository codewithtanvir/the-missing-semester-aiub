# Broadcast Message Feature

## Overview
A floating broadcast message system that allows admins to display important announcements on the courses page. Messages are displayed as floating notifications at the top of the page and can be dismissed by users.

## Features

### For Users
- **Floating Message Display**: Messages appear as a dismissible floating notification at the top of the courses page
- **Real-time Updates**: Messages update automatically when admins create or modify them
- **Visual Types**: 4 message types with distinct colors:
  - **Info** (Blue): General information
  - **Success** (Green): Positive announcements
  - **Warning** (Yellow): Important notices
  - **Error** (Red): Critical alerts
- **Dismissible**: Users can dismiss messages they've seen

### For Admins
- **Easy Management**: Create, activate/deactivate, and delete messages from admin dashboard
- **Message Types**: Choose from 4 visual styles
- **Active/Inactive Toggle**: Control which messages are displayed
- **Message History**: View all past and current broadcasts

## Database Schema

```sql
CREATE TABLE public.broadcast_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## Components

### 1. BroadcastMessage Component (`src/components/broadcast-message.tsx`)
- Displays active broadcast messages
- Subscribes to real-time updates
- Handles user dismissal
- Auto-loads on component mount

### 2. Broadcast Management Page (`src/app/admin/dashboard/broadcast/page.tsx`)
- Admin interface for managing broadcasts
- Create new messages
- Toggle active/inactive status
- Delete messages
- View message history

## Usage

### For Admins

1. **Create a Broadcast**:
   - Navigate to Admin Dashboard → Broadcast
   - Enter your message text
   - Select message type (Info, Success, Warning, Error)
   - Click "Create Broadcast"

2. **Manage Broadcasts**:
   - View all broadcasts in the list
   - Toggle active/inactive status with the eye icon
   - Delete unwanted messages

### For Developers

**Add to any page**:
```tsx
import { BroadcastMessage } from '@/components/broadcast-message';

export default function YourPage() {
  return (
    <div>
      <Navigation />
      <BroadcastMessage />  {/* Add this line */}
      {/* Rest of your content */}
    </div>
  );
}
```

## Security (RLS Policies)

- **SELECT**: Anyone can view active messages
- **INSERT/UPDATE/DELETE**: Only admins can manage messages
- Admin validation checks `raw_user_meta_data->>'role' = 'admin'`

## Real-time Functionality

The broadcast system uses Supabase real-time subscriptions to:
- Automatically show new messages when created
- Update messages when modified
- Remove messages when deactivated
- No page reload required

## Styling

Message types and their colors:

| Type    | Background | Border | Icon Color |
|---------|-----------|--------|------------|
| Info    | Blue-50   | Blue-200 | Blue-600 |
| Success | Green-50  | Green-200 | Green-600 |
| Warning | Yellow-50 | Yellow-200 | Yellow-600 |
| Error   | Red-50    | Red-200 | Red-600 |

## Future Enhancements

Potential improvements:
- [ ] Schedule messages for future display
- [ ] Message expiration dates
- [ ] Target specific user groups
- [ ] Rich text formatting
- [ ] Multiple active messages carousel
- [ ] Analytics (view count, dismiss rate)

## Troubleshooting

**Message not appearing?**
- Check if message is set to "Active" in admin panel
- Verify RLS policies are correctly set
- Check browser console for errors

**Can't create messages?**
- Ensure you're logged in as admin
- Verify admin role in user metadata
- Check Supabase connection

## Files Modified

- ✅ `src/components/broadcast-message.tsx` - Floating message component
- ✅ `src/app/admin/dashboard/broadcast/page.tsx` - Admin management page
- ✅ `src/app/admin/dashboard/layout.tsx` - Added broadcast nav link
- ✅ `src/app/courses/page.tsx` - Added broadcast component
- ✅ `src/types/database.ts` - Added BroadcastMessage type
- ✅ Database migration - Created broadcast_messages table with RLS

## TypeScript Note

Due to Supabase type generation, you may need to run:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

Or use `@ts-ignore` comments temporarily for broadcast_messages operations until types are regenerated.
