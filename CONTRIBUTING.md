# Contributing to ViralShortsOps

Thank you for your interest in contributing to ViralShortsOps! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We're building a collaborative community.

## Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/Unfazed-Max/viralshortsops.git
   cd viralshortsops
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Set up database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branching Strategy

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `fix/*`: Bug fixes
- `docs/*`: Documentation updates

### Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow the existing code style
   - Add tests if applicable

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   # Run any relevant tests
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   Use conventional commit messages:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation
   - `style:` Code style changes
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable names

```typescript
// Good
interface UserProfile {
  id: string
  email: string
  name: string
}

// Avoid
const data: any = {...}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types

```typescript
// Good
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick} className={`btn-${variant}`}>{children}</button>
}
```

### File Organization

```
src/
├── app/              # Next.js app directory
│   ├── api/         # API routes
│   ├── dashboard/   # Dashboard pages
│   └── auth/        # Auth pages
├── components/       # React components
├── lib/             # Library functions
├── types/           # TypeScript types
└── utils/           # Utility functions
```

## Adding Features

### New API Route

1. Create route file in `src/app/api/`
2. Add authentication check
3. Implement business logic
4. Add error handling
5. Update API documentation

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Your logic here
    
    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

### New Database Model

1. Add model to `prisma/schema.prisma`
2. Run migration: `npm run db:migrate`
3. Update TypeScript types
4. Add CRUD operations

### New UI Component

1. Create component in `src/components/`
2. Add proper TypeScript props
3. Style with TailwindCSS
4. Make it responsive
5. Add to Storybook (if available)

## Testing

### Manual Testing Checklist

- [ ] Test in development mode
- [ ] Test production build
- [ ] Test on different browsers
- [ ] Test responsive design
- [ ] Test error scenarios
- [ ] Test authentication flow
- [ ] Test API endpoints

### Writing Tests

```typescript
// Example test structure
describe('Campaign API', () => {
  it('should create a new campaign', async () => {
    const response = await fetch('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', niche: 'tech' })
    })
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.campaign).toBeDefined()
  })
})
```

## Database Changes

When modifying the database schema:

1. **Update Prisma schema**
   ```prisma
   model NewModel {
     id        String   @id @default(cuid())
     name      String
     createdAt DateTime @default(now())
   }
   ```

2. **Create migration**
   ```bash
   npm run db:migrate
   ```

3. **Update TypeScript types**
   ```bash
   npm run db:generate
   ```

4. **Test changes locally**

## Documentation

Update documentation when:
- Adding new features
- Changing API endpoints
- Modifying database schema
- Updating configuration

Documentation files:
- `README.md`: Project overview
- `API.md`: API documentation
- `DEPLOYMENT.md`: Deployment guide
- `CONTRIBUTING.md`: This file

## Pull Request Guidelines

### PR Title
Use conventional commit format:
```
feat: add video analytics dashboard
fix: resolve authentication issue
docs: update API documentation
```

### PR Description
Include:
- What changed and why
- Screenshots (for UI changes)
- Testing steps
- Related issues

### PR Checklist
- [ ] Code follows project style
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive design (if UI)
- [ ] Accessibility considered

## Common Tasks

### Adding a New Social Platform

1. Add platform to Prisma schema
2. Implement OAuth flow
3. Add posting logic in `src/lib/social-posting.ts`
4. Update UI to show new platform
5. Add platform icon/branding
6. Update documentation

### Adding a New Video API

1. Create new service file in `src/lib/`
2. Add API key to `.env.example`
3. Implement video generation logic
4. Add to video generation queue
5. Update documentation

### Performance Optimization

- Use Next.js Image component
- Implement lazy loading
- Add loading states
- Optimize database queries
- Use Redis caching
- Minimize API calls

## Questions?

- Open an issue for bugs
- Start a discussion for features
- Check existing issues first
- Provide detailed information

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing to ViralShortsOps! 🚀
