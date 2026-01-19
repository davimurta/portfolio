import { BlogPost, Author, ApiResponse } from '@/types'

const author: Author = {
  name: 'Davi Murta',
  avatar: '/images/avatar.jpg',
  bio: 'Desenvolvedor Web & Mobile apaixonado por criar experiências digitais incríveis.'
}

export const blogPostsData: BlogPost[] = [
  {
    id: '1',
    slug: 'building-scalable-react-applications-nextjs',
    title: 'Building Scalable React Applications with Next.js',
    excerpt: 'Learn how to structure your Next.js projects for maximum scalability and maintainability using best practices.',
    content: `
# Building Scalable React Applications with Next.js

Next.js has become the go-to framework for building production-ready React applications. In this article, we'll explore best practices for structuring your projects for maximum scalability.

## Project Structure

A well-organized project structure is crucial for maintainability. Here's the structure I recommend:

\`\`\`
src/
├── app/           # App Router pages
├── components/    # Reusable components
│   ├── ui/        # Basic UI components
│   ├── layout/    # Layout components
│   └── sections/  # Page sections
├── hooks/         # Custom hooks
├── lib/           # Utility functions
├── types/         # TypeScript types
└── data/          # Data and API calls
\`\`\`

## Component Organization

Each component should have its own folder with:
- The component file (.tsx)
- Styles (.css or .module.css)
- Tests (.test.tsx)
- Index file for clean exports

## State Management

For most applications, React's built-in state management (useState, useContext, useReducer) is sufficient. Only reach for external libraries like Redux or Zustand when you have complex global state requirements.

## Performance Optimization

1. **Use Server Components** where possible
2. **Implement proper caching** with revalidation
3. **Lazy load** heavy components
4. **Optimize images** with next/image

## Conclusion

Building scalable applications is about making good architectural decisions early. Follow these patterns and your Next.js project will be ready to grow with your needs.
    `,
    image: '/images/blog-1.jpg',
    category: 'Development',
    tags: ['Next.js', 'React', 'Architecture', 'Best Practices'],
    author,
    readTime: '8 min read',
    publishedAt: '2026-01-10'
  },
  {
    id: '2',
    slug: 'art-of-minimalist-ui-design',
    title: 'The Art of Minimalist UI Design',
    excerpt: 'Exploring the principles of minimalist design and how to apply them effectively in modern web interfaces.',
    content: `
# The Art of Minimalist UI Design

Minimalism in design is about removing the unnecessary while keeping what matters. Let's explore how to apply these principles to create beautiful, functional interfaces.

## Core Principles

### 1. Whitespace is Your Friend

Don't fear empty space. Whitespace helps users focus on what's important and makes your interface feel more premium.

### 2. Limited Color Palette

Stick to 2-3 primary colors. Use shades and tints to create hierarchy without adding complexity.

### 3. Typography Hierarchy

Use font size, weight, and color to create clear visual hierarchy. You don't need many fonts – one or two well-chosen typefaces are enough.

### 4. Purposeful Elements

Every element should serve a purpose. If you can't explain why something is there, remove it.

## Practical Tips

- Start with mobile design first
- Use consistent spacing (8px grid system)
- Limit yourself to essential UI elements
- Focus on content over decoration

## Common Mistakes

1. Removing too much and sacrificing usability
2. Making everything the same visual weight
3. Forgetting about accessibility

## Conclusion

Minimalist design isn't about having less – it's about making room for more of what matters. Apply these principles thoughtfully and your interfaces will be both beautiful and functional.
    `,
    image: '/images/blog-2.jpg',
    category: 'Design',
    tags: ['UI Design', 'Minimalism', 'UX', 'Web Design'],
    author,
    readTime: '5 min read',
    publishedAt: '2026-01-05'
  },
  {
    id: '3',
    slug: 'react-native-vs-flutter-2026',
    title: 'React Native vs Flutter in 2026',
    excerpt: 'A comprehensive comparison of the two leading cross-platform mobile development frameworks.',
    content: `
# React Native vs Flutter in 2026

Both React Native and Flutter have matured significantly. Let's compare them to help you choose the right framework for your next project.

## Performance

**Flutter** compiles to native ARM code, giving it a slight edge in raw performance. However, **React Native's** New Architecture with Fabric and TurboModules has closed the gap significantly.

## Developer Experience

### React Native
- JavaScript/TypeScript (familiar to web devs)
- Hot reload
- Large npm ecosystem
- Expo for rapid development

### Flutter
- Dart language (learning curve)
- Hot reload
- Rich widget library
- Great documentation

## When to Choose React Native

- Your team knows JavaScript/React
- You need to share code with a web app
- You want access to npm ecosystem
- You're using Expo for simplicity

## When to Choose Flutter

- You need pixel-perfect UI across platforms
- Performance is critical (games, animations)
- You're starting fresh without JS experience
- You want built-in Material/Cupertino widgets

## My Recommendation

For most projects in 2026, **React Native with Expo** is my recommendation. The ecosystem maturity, developer experience, and ability to share code with web projects make it the pragmatic choice.

However, if you're building something animation-heavy or need absolute performance, Flutter is excellent.

## Conclusion

Both frameworks are production-ready. Choose based on your team's skills and project requirements, not hype.
    `,
    image: '/images/blog-3.jpg',
    category: 'Mobile',
    tags: ['React Native', 'Flutter', 'Mobile Development', 'Comparison'],
    author,
    readTime: '10 min read',
    publishedAt: '2025-12-28'
  },
  {
    id: '4',
    slug: 'mastering-typescript-generics',
    title: 'Mastering TypeScript Generics',
    excerpt: 'Deep dive into TypeScript generics and how to use them to write more flexible and type-safe code.',
    content: `
# Mastering TypeScript Generics

Generics are one of TypeScript's most powerful features. Let's demystify them and learn how to use them effectively.

## What Are Generics?

Generics allow you to write code that works with multiple types while maintaining type safety.

\`\`\`typescript
// Without generics
function identity(arg: any): any {
  return arg;
}

// With generics
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

## Common Use Cases

### 1. Generic Functions

\`\`\`typescript
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = firstElement([1, 2, 3]); // type: number
const str = firstElement(['a', 'b']); // type: string
\`\`\`

### 2. Generic Interfaces

\`\`\`typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

const userResponse: ApiResponse<User> = {
  data: { id: 1, name: 'Davi' },
  success: true
};
\`\`\`

### 3. Generic Constraints

\`\`\`typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length);
}
\`\`\`

## Advanced Patterns

- **Conditional Types**: \`T extends U ? X : Y\`
- **Mapped Types**: \`{ [K in keyof T]: ... }\`
- **Infer keyword**: Extract types from other types

## Conclusion

Generics might seem complex at first, but they're essential for writing reusable, type-safe code. Start with simple use cases and gradually tackle more advanced patterns.
    `,
    image: '/images/blog-4.jpg',
    category: 'Development',
    tags: ['TypeScript', 'Generics', 'Programming', 'Type Safety'],
    author,
    readTime: '7 min read',
    publishedAt: '2025-12-20'
  },
  {
    id: '5',
    slug: 'creating-smooth-animations-framer-motion',
    title: 'Creating Smooth Animations with Framer Motion',
    excerpt: 'A practical guide to building beautiful and performant animations in React applications.',
    content: `
# Creating Smooth Animations with Framer Motion

Framer Motion makes it easy to add beautiful animations to your React applications. Let's explore how to create smooth, performant animations.

## Getting Started

\`\`\`bash
npm install framer-motion
\`\`\`

## Basic Animations

\`\`\`tsx
import { motion } from 'framer-motion';

function FadeIn() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Hello World
    </motion.div>
  );
}
\`\`\`

## Scroll Animations

\`\`\`tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  Appears on scroll
</motion.div>
\`\`\`

## Variants for Complex Animations

\`\`\`tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
\`\`\`

## Performance Tips

1. Use \`transform\` properties (x, y, scale, rotate) – they're GPU-accelerated
2. Avoid animating \`width\`, \`height\`, or \`top\`/\`left\`
3. Use \`layoutId\` for shared element transitions
4. Set \`will-change\` sparingly

## Conclusion

Framer Motion provides a powerful, declarative API for animations. Start simple and progressively add complexity as needed.
    `,
    image: '/images/blog-5.jpg',
    category: 'Development',
    tags: ['Framer Motion', 'Animation', 'React', 'UI'],
    author,
    readTime: '6 min read',
    publishedAt: '2025-12-15'
  }
]

// Função para buscar post por slug (usada nas páginas dinâmicas)
export const getBlogPostBySlug = async (slug: string): Promise<ApiResponse<BlogPost | null>> => {
  const post = blogPostsData.find(p => p.slug === slug)

  return {
    data: post || null,
    success: !!post,
    message: post ? undefined : 'Blog post not found'
  }
}
