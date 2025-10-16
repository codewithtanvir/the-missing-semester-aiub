# GitHub Copilot Instructions

## General Guidelines

- After completing a task, DO NOT automatically create markdown documentation files unless explicitly requested
- Focus on code implementation rather than documentation generation
- Only create documentation when the user specifically asks for it
- Prioritize working code over documentation

## Task Completion Behavior

When finishing a task:
- ✅ Summarize what was done in the response
- ✅ Show key code changes inline
- ✅ Provide next steps or suggestions
- ❌ DO NOT create summary markdown files
- ❌ DO NOT create implementation reports
- ❌ DO NOT generate documentation automatically

## Documentation Guidelines

Create documentation ONLY when:
- User explicitly requests documentation
- User asks "document this" or "write docs for this"
- Working on a complex feature that requires a README
- Setting up a new project that needs setup instructions

## Code Style

- Use TypeScript for type safety
- Follow Next.js 14 App Router conventions
- Use Tailwind CSS for styling
- Prefer server components over client components when possible
- Use 'use client' only when necessary (useState, useEffect, event handlers)

## Commit Messages

When making git commits, use conventional commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## Response Format

When completing tasks:
1. Implement the code changes
2. Provide a brief summary of what was done
3. List what was modified (files changed)
4. Suggest next steps if applicable
5. DO NOT create markdown files unless asked

## Examples

### ✅ Good Response:
```
I've implemented the feature. Here's what changed:
- Updated src/app/page.tsx with new section
- Modified 3 files total
- All changes are working in dev server

Test at http://localhost:3000
Ready to commit when you are.
```

### ❌ Avoid:
```
I've created the following documentation files:
- IMPLEMENTATION-SUMMARY.md
- TASK-COMPLETION-REPORT.md
- CHANGES-LOG.md
...
```

## Project-Specific Rules

### This Project (Missing Semester)
- Always test changes with `npm run dev` before committing
- Use Supabase for database operations
- Follow mobile-first responsive design
- Maintain accessibility standards (ARIA labels, keyboard navigation)
- Use existing component library (shadcn/ui)

## When to Break Rules

Create documentation when:
- User says: "document this", "write a guide", "create README"
- Setting up complex configuration that needs explanation
- API documentation is specifically requested
- User explicitly wants a markdown file for reference

## Summary

**Default behavior:** Code first, document only when asked.
**Focus on:** Working implementations, not reports.
**Remember:** Users can see git diffs, they don't need separate summary files.
