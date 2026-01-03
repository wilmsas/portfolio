# Password Protection System

This document describes the password protection implementation for sensitive pages in the portfolio site.

## Overview

The site uses a client-side password protection system with a blur overlay effect. This provides a clean, modern authentication experience without the harsh browser HTTP Basic Auth popup.

## Protected Pages

The following pages require password authentication:

- **Skills Matrix** (`/skills-matrix`) - Design competency tracking tool
- **Case Studies** (`/case-studies`) - Portfolio work examples

All other pages (home, contact, resume) remain publicly accessible.

## Password

**Current Password**: `skills`

To change the password, update the `CORRECT_PASSWORD` constant in `components/PasswordGate.tsx`:

```tsx
const CORRECT_PASSWORD = "your-new-password";
```

## Architecture

### PasswordGate Component

Located at `components/PasswordGate.tsx`, this component:

1. **Wraps protected content** - Acts as a gate around the page content
2. **Checks session storage** - Looks for existing authentication
3. **Renders blur overlay** - Shows blurred content until authenticated
4. **Handles authentication** - Validates password input
5. **Persists auth state** - Stores authentication in sessionStorage

### Key Features

- **Session-based**: Authentication persists for the browser session (until tab closed)
- **Per-page auth**: Each protected page has its own authentication state
- **Blur preview**: Users see a blurred version of the content before authenticating
- **Theme-aware**: Fully styled for both light and dark modes
- **Error feedback**: Clear messaging for incorrect passwords
- **No hydration issues**: Client-side only rendering to avoid SSR mismatches

### Storage Keys

Each protected page uses a unique sessionStorage key:

- Skills Matrix: `auth-skills-matrix`
- Case Studies: `auth-case-studies`

This allows users to authenticate separately for each protected page.

## Implementation

### Adding Password Protection to a New Page

1. Import the `PasswordGate` component
2. Wrap your page content with it
3. Provide a unique `storageKey`

```tsx
"use client";
import PasswordGate from "@/components/PasswordGate";
import YourPageContent from "@/components/YourPageContent";

export default function YourPage() {
  return (
    <PasswordGate storageKey="auth-your-page">
      <YourPageContent />
    </PasswordGate>
  );
}
```

### Removing Password Protection

Simply remove the `PasswordGate` wrapper from the page:

```tsx
// Before (protected)
export default function YourPage() {
  return (
    <PasswordGate storageKey="auth-your-page">
      <YourPageContent />
    </PasswordGate>
  );
}

// After (public)
export default function YourPage() {
  return <YourPageContent />;
}
```

## User Experience

### Authentication Flow

1. **Initial visit**: User navigates to a protected page
2. **Blur effect**: Content is visible but heavily blurred
3. **Password modal**: A centered modal appears requesting password
4. **Input password**: User enters the password
5. **Validation**:
   - If correct: Modal disappears, content becomes clear
   - If incorrect: Error message displays, input clears
6. **Session persistence**: Authentication persists until browser tab is closed

### Visual Design

**Light Mode:**
- White modal background
- Dark text
- Subtle border
- Backdrop blur

**Dark Mode:**
- Dark card background
- Light text
- Subtle border
- Backdrop blur

**Modal Layout:**
```
┌────────────────────────────┐
│  Password Required         │
│  This page is password-    │
│  protected. Please enter   │
│  the password to continue. │
│                            │
│  Password                  │
│  [________________]        │
│                            │
│  [    Continue    ]        │
└────────────────────────────┘
```

## Security Considerations

### Current Implementation

- **Client-side only**: Password checking happens in the browser
- **No server validation**: Authentication is not enforced server-side
- **Session-based**: Uses sessionStorage (cleared when tab closes)
- **Visible in source**: Password is visible in the client-side JavaScript

### Security Level

This implementation provides:
- ✅ **Basic protection** from casual visitors
- ✅ **Clean UX** without HTTP Basic Auth popups
- ✅ **Easy access** for invited users with password
- ❌ **Not secure** against determined users (password in source code)
- ❌ **Not suitable** for truly sensitive data

### Use Cases

**Appropriate for:**
- Portfolio work samples
- Draft content
- Personal projects
- Content you want to share selectively

**Not appropriate for:**
- Sensitive personal data
- Financial information
- Confidential business data
- Anything requiring true security

### Upgrading Security

For stronger security, consider:

1. **Server-side authentication** - Use Next.js API routes with proper auth
2. **Environment variables** - Store password in `.env` files
3. **Database verification** - Check credentials against a database
4. **JWT tokens** - Use proper authentication tokens
5. **Authentication providers** - Integrate Auth0, NextAuth.js, etc.

Example upgrade path:
```tsx
// Higher security approach
import { useSession } from "next-auth/react";

export default function ProtectedPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  if (status === "loading") return <Loading />;
  return <Content />;
}
```

## Technical Details

### Component Props

```tsx
interface PasswordGateProps {
  children: React.ReactNode;  // Content to protect
  storageKey: string;          // Unique key for sessionStorage
}
```

### State Management

The component manages three states:

1. **Mounted**: Client-side hydration complete
2. **Authenticated**: Password validated
3. **Error**: Incorrect password entered

### Performance

- **No server overhead**: All logic runs client-side
- **Single render**: Content renders once, just obscured
- **Session cache**: Repeated visits don't require re-authentication
- **Fast validation**: Instant password checking (no network calls)

## Migration Notes

### From Middleware Authentication

Previous implementation used Next.js middleware with HTTP Basic Auth:

```tsx
// Old approach (middleware.ts)
export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization");
  // HTTP Basic Auth validation
}
```

New implementation uses client-side component:

```tsx
// New approach (page.tsx)
<PasswordGate storageKey="auth-page">
  <Content />
</PasswordGate>
```

### Breaking Changes

- HTTP Basic Auth removed (no more browser popup)
- Username requirement removed (password-only now)
- Authentication now per-page instead of site-wide
- sessionStorage instead of HTTP headers

### Backward Compatibility

The password remains the same (`skills`), so existing users just need to enter it in the new modal instead of the browser popup.

## Troubleshooting

### Password Modal Doesn't Appear

**Cause**: SSR hydration mismatch
**Solution**: Ensure page is marked `"use client"`

### Password Doesn't Persist

**Cause**: sessionStorage cleared
**Solution**: This is expected behavior - session clears when tab closes

### Content Flashes Before Blur

**Cause**: Client-side rendering delay
**Solution**: Component returns `null` until client-side mounted

### Wrong Password Accepted

**Cause**: Incorrect constant value
**Solution**: Verify `CORRECT_PASSWORD` in PasswordGate.tsx

## Future Enhancements

Potential improvements:

- [ ] Admin panel to change password without code changes
- [ ] Multiple password support (different passwords per page)
- [ ] Time-limited access (password expires after X hours)
- [ ] IP-based allowlist
- [ ] Server-side validation
- [ ] Password strength requirements
- [ ] Rate limiting on attempts
- [ ] Audit logging of access attempts

---

**Last Updated**: January 2, 2026
**Version**: 1.0
