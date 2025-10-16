# Adding New Contributors

## How to Add a New Contributor

Open `src/app/contributors/page.tsx` and add a new object to the `contributors` array:

```typescript
{
  id: 3, // Increment the ID
  name: "Contributor Name",
  role: "Role/Title",
  avatar: "CN", // Initials (2 letters)
  contributions: "What they contributed",
  github: "github-username", // or null if no GitHub
  year: "2024 - Present",
  color: "from-green-500 to-green-600" // Choose a gradient color
}
```

## Available Gradient Colors:
- `"from-blue-500 to-blue-600"`
- `"from-purple-500 to-purple-600"`
- `"from-green-500 to-green-600"`
- `"from-red-500 to-red-600"`
- `"from-yellow-500 to-yellow-600"`
- `"from-pink-500 to-pink-600"`
- `"from-indigo-500 to-indigo-600"`
- `"from-orange-500 to-orange-600"`

## Example:

```typescript
const contributors = [
  {
    id: 1,
    name: "Tanvir Rahman",
    role: "Founder & Lead Developer",
    avatar: "TR",
    contributions: "Platform Development, UI/UX Design",
    github: "codewithtanvir",
    year: "2024 - Present",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    name: "John Doe",
    role: "Content Contributor",
    avatar: "JD",
    contributions: "CSE Course Notes",
    github: "johndoe",
    year: "2024 - Present",
    color: "from-green-500 to-green-600"
  },
  // Add more here...
];
```

Save the file and the new contributor will appear automatically!
