# 📌 Pin Courses Feature

## Overview
Users can now pin/bookmark their favorite courses for quick and easy access. Pinned courses appear in a dedicated section at the top of the courses page.

## Features Implemented

### 1. Database Layer
**Table: `pinned_courses`**
```sql
CREATE TABLE pinned_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  pinned_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);
```

**Features:**
- ✅ Each user can pin a course only once (UNIQUE constraint)
- ✅ Cascading deletes (if user or course deleted, pins removed)
- ✅ Timestamps for tracking when courses were pinned

**RLS Policies:**
```sql
-- Users can view their own pinned courses
SELECT: auth.uid() = user_id

-- Users can pin courses
INSERT: auth.uid() = user_id

-- Users can unpin their own courses
DELETE: auth.uid() = user_id
```

**Indexes:**
- `user_id` - Fast lookup of user's pins
- `course_id` - Fast lookup of who pinned a course
- Composite `(user_id, course_id)` - Fast pin status checks

### 2. UI Components

#### CourseCard Component Updates
**Location:** `src/components/course-card.tsx`

**New Props:**
```typescript
interface CourseCardProps {
  course: Course;
  viewMode?: 'grid' | 'list';
  isPinned?: boolean;        // Is this course pinned?
  onPinChange?: () => void;  // Callback after pin/unpin
}
```

**Features:**
- 📍 **Pin Button** - Top-right corner of each card
- ⭐ **Visual Indicator** - Yellow star when pinned, gray when not
- 🔄 **Toggle Function** - Click to pin/unpin
- 🎨 **Filled Icon** - Pinned courses show filled pin icon
- ✋ **Event Handling** - Prevents navigation when clicking pin button
- 💬 **Toast Notifications** - Success messages for pin/unpin actions
- 🔒 **Auth Check** - Requires login to pin courses

**Visual States:**
```
Unpinned: Gray pin icon (outline)
Pinned:   Yellow pin icon (filled)
Loading:  Button disabled during toggle
```

#### Courses Page Updates
**Location:** `src/app/courses/page.tsx`

**New State:**
```typescript
const [pinnedCourseIds, setPinnedCourseIds] = useState<Set<string>>(new Set());
```

**New Function:**
```typescript
const loadPinnedCourses = async () => {
  // Fetches user's pinned course IDs
  // Updates pinnedCourseIds Set
}
```

**Features:**
- 📋 **Pinned Section** - Displays pinned courses at the top
- 🔢 **Pin Count Badge** - Shows number of pinned courses
- 👁️ **Conditional Display** - Only shows when user has pins
- 🔍 **Smart Hiding** - Hides during search/filter to avoid confusion
- ↕️ **Separator** - Visual divider between pinned and all courses
- 🔄 **Auto Refresh** - Reloads pins after pin/unpin action

### 3. Type Definitions
**Location:** `src/types/database.ts`

```typescript
export interface PinnedCourse {
  id: string;
  user_id: string;
  course_id: string;
  pinned_at: string;
  created_at: string;
}

// Added to Database.public.Tables
pinned_courses: {
  Row: PinnedCourse;
  Insert: Omit<PinnedCourse, 'id' | 'created_at' | 'pinned_at'>;
  Update: Partial<Omit<PinnedCourse, 'id' | 'created_at'>>;
}
```

## User Experience Flow

### Pinning a Course
1. User browses courses page
2. Hovers over a course card
3. Sees pin button in top-right corner (gray outline)
4. Clicks pin button
5. Button turns yellow and fills in
6. Toast notification: "Course Pinned! [CODE] has been added to your pinned courses"
7. Course appears in "Pinned Courses" section at top

### Unpinning a Course
1. User sees yellow filled pin on a course card
2. Clicks the pin button
3. Pin turns gray (outline)
4. Toast notification: "Course Unpinned [CODE] has been removed from your pinned courses"
5. Course removed from "Pinned Courses" section

### Viewing Pinned Courses
1. Navigate to `/courses`
2. If user has pinned courses, they appear at the top
3. Section header shows: "📌 Pinned Courses" with count badge
4. Courses display in same grid/list view as selected
5. Separator line divides pinned from all courses

## Technical Implementation

### Pin Toggle Logic
```typescript
const togglePin = async (e: React.MouseEvent) => {
  e.preventDefault();  // Don't navigate to course page
  e.stopPropagation(); // Don't trigger parent Link
  
  setIsTogglingPin(true);

  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Show auth required message
      return;
    }

    if (isPinned) {
      // DELETE from pinned_courses
      await supabase
        .from('pinned_courses')
        .delete()
        .eq('user_id', session.user.id)
        .eq('course_id', course.id);
      
      setIsPinned(false);
    } else {
      // INSERT into pinned_courses
      await supabase
        .from('pinned_courses')
        .insert({
          user_id: session.user.id,
          course_id: course.id,
        });
      
      setIsPinned(true);
    }

    // Notify parent to refresh pins
    if (onPinChange) {
      onPinChange();
    }
  } catch (error) {
    // Show error toast
  } finally {
    setIsTogglingPin(false);
  }
};
```

### Loading Pinned Status
```typescript
const loadPinnedCourses = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const { data } = await supabase
    .from('pinned_courses')
    .select('course_id')
    .eq('user_id', session.user.id);

  if (data) {
    setPinnedCourseIds(new Set(data.map(p => p.course_id)));
  }
};
```

## Design Decisions

### Why Pin Icon Instead of Star?
- More specific to the "pinning" concept
- Visually distinct from rating systems
- Clearer user intent (bookmark/quick access)

### Why Top-Right Placement?
- Doesn't interfere with course information
- Common UI pattern for secondary actions
- Easily accessible without covering content

### Why Separate "Pinned Courses" Section?
- Immediate visibility of bookmarked courses
- No need to search for pinned items
- Clear separation from browsing all courses
- Users can quickly access favorite courses

### Why Hide During Search/Filter?
- Avoid confusion (pinned courses might not match filter)
- Keep search results clean and relevant
- User can clear filters to see pinned section again

### Why Use Set for pinnedCourseIds?
- O(1) lookup time for `.has()` checks
- Efficient for checking pin status on many courses
- Prevents duplicate IDs

## Security

### RLS Protection
- ✅ Users can only see their own pins
- ✅ Users can only pin/unpin their own courses
- ✅ Cannot modify other users' pins
- ✅ Cannot view other users' pins

### Auth Requirements
- ✅ Must be logged in to pin courses
- ✅ Toast notification if not authenticated
- ✅ Session validation on every pin action

## Performance Optimizations

1. **Single Query** - Load all pinned IDs in one query
2. **Set Data Structure** - Fast O(1) pin status lookups
3. **Optimistic Updates** - Immediate UI feedback
4. **Indexed Queries** - Database indexes for fast lookups
5. **Callback Pattern** - Only refresh when needed

## Testing Checklist

- [x] Pin a course
- [x] Unpin a course
- [x] Multiple pins
- [x] Pin button doesn't navigate
- [x] Pinned section shows/hides correctly
- [x] Pin count badge accurate
- [x] Toast notifications work
- [x] Auth check works
- [x] RLS policies enforced
- [x] Pins persist across sessions
- [x] Grid and list view both work
- [x] Responsive design
- [x] No TypeScript errors

## Future Enhancements

### Possible Additions:
1. **Pin Limit** - Max 10 pinned courses
2. **Drag to Reorder** - Custom pin order
3. **Pin Collections** - Group pins by semester/category
4. **Share Pins** - Share pinned courses with friends
5. **Quick Access Menu** - Pinned courses in navigation
6. **Analytics** - Track most pinned courses
7. **Keyboard Shortcuts** - Press 'P' to pin
8. **Bulk Actions** - Pin all courses from department

## Files Modified

### Created:
1. Migration: `add_pinned_courses_table.sql`
2. Documentation: `PIN-COURSES-FEATURE.md` (this file)

### Modified:
1. `src/components/course-card.tsx` - Added pin button and toggle logic
2. `src/app/courses/page.tsx` - Added pinned section and pin state
3. `src/types/database.ts` - Added PinnedCourse interface

## Usage Example

```typescript
// In courses page
<CourseCard 
  course={course} 
  viewMode="grid"
  isPinned={pinnedCourseIds.has(course.id)}
  onPinChange={loadPinnedCourses}
/>
```

## Troubleshooting

### Pins Not Showing?
- Check if user is logged in
- Verify RLS policies are enabled
- Check browser console for errors
- Ensure pinned_courses table exists

### Can't Pin Courses?
- Verify user is authenticated
- Check network tab for errors
- Ensure RLS INSERT policy works
- Verify course_id exists

### Duplicate Pin Errors?
- UNIQUE constraint prevents duplicates
- This is expected behavior
- UI should already show as pinned

## Summary

The pin courses feature provides a simple, intuitive way for users to bookmark their favorite or most important courses for quick access. The implementation is secure, performant, and follows modern React/Next.js best practices.

**Key Benefits:**
- ⚡ Quick access to important courses
- 🎯 Improved user experience
- 🔒 Secure with RLS policies
- 📱 Works in grid and list views
- ♿ Accessible with clear visual feedback
- 🚀 Fast with optimized queries

Enjoy pinning your courses! 📌
