# React Router Implementation

This project implements React Router v7 with modern best practices for authentication and routing.

## Features

### 🚀 Routes
- `/login` - Login page with authentication form
- `/dashboard` - Protected dashboard with sidebar navigation
- `/` - Redirects to dashboard
- `*` - Catch-all route redirects to dashboard

### 🔐 Authentication
- Context-based authentication state management
- Protected routes with automatic redirect to login
- Persistent login state during session
- Logout functionality with navigation

### 🎨 UI Components
- Modern login form with loading states
- Dashboard with collapsible sidebar
- Error boundary for route-level error handling
- Responsive design with Tailwind CSS

## Architecture

### Router Configuration (`src/router.tsx`)
```typescript
// Uses createBrowserRouter for modern React Router v7
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <RootLayout><LoginPage /></RootLayout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: (
      <RootLayout>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </RootLayout>
    ),
    errorElement: <ErrorBoundary />,
  },
])
```

### Authentication Context (`src/contexts/AuthContext.tsx`)
- Provides authentication state across the app
- Handles login/logout operations
- Mock authentication for demonstration

### Protected Routes (`src/components/ProtectedRoute.tsx`)
- Wraps protected components
- Redirects unauthenticated users to login
- Preserves intended destination for post-login redirect

## Best Practices Implemented

1. **Modern Router Patterns**: Uses React Router v7's `createBrowserRouter`
2. **Error Boundaries**: Route-level error handling with user-friendly UI
3. **Authentication Flow**: Context-based auth with protected routes
4. **Type Safety**: Full TypeScript implementation
5. **Component Organization**: Logical separation of pages, components, and contexts
6. **Navigation**: Programmatic navigation with `useNavigate`
7. **State Management**: React Context for global auth state
8. **Loading States**: UI feedback during async operations

## Usage

1. Start the development server:
   ```bash
   bun run dev
   ```

2. Navigate to `http://localhost:3000`
   - You'll be redirected to `/dashboard`
   - Since you're not authenticated, you'll be redirected to `/login`

3. Login with any email/password (mock authentication)
   - You'll be redirected to `/dashboard`
   - The sidebar shows your authenticated user info

4. Use the logout button in the user dropdown to sign out

## File Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── app-sidebar.tsx     # Main navigation sidebar
│   ├── login-form.tsx      # Login form component
│   ├── nav-user.tsx        # User dropdown with logout
│   ├── ProtectedRoute.tsx  # Route protection wrapper
│   └── ErrorBoundary.tsx   # Error handling component
├── contexts/
│   └── AuthContext.tsx     # Authentication state management
├── pages/
│   ├── LoginPage.tsx       # Login page layout
│   └── DashboardPage.tsx   # Dashboard page layout
├── router.tsx              # Router configuration
└── App.tsx                 # Main app component
```

## Technologies Used

- **React Router v7**: Latest routing library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Radix UI**: Accessible UI components
- **Tabler Icons**: Icon library
- **Rsbuild**: Build tool 