# Deployment Checklist

This checklist ensures a smooth deployment of the portfolio site with dark mode support.

## Pre-Deployment Checks

### ✅ Code Quality
- [x] Production build completes successfully (`npm run build`)
- [x] No TypeScript errors
- [x] All components render in both light and dark modes
- [x] Theme toggle works correctly
- [x] Skills Matrix visualizations display properly in both themes
- [ ] Manually test all pages in light mode
- [ ] Manually test all pages in dark mode
- [ ] Test theme persistence (refresh should maintain selected theme)

### ✅ Performance
- [ ] Run Lighthouse audit in production mode
- [ ] Check bundle size (`npm run build` output)
- [ ] Verify image optimization
- [ ] Test page load times on slow connections
- [ ] Check for unnecessary re-renders on theme toggle

### ✅ Accessibility
- [ ] Test keyboard navigation (Tab, Shift+Tab, Enter, Space)
- [ ] Verify focus indicators are visible in both themes
- [ ] Run axe DevTools accessibility scan
- [ ] Check color contrast ratios (WCAG AA)
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Ensure all interactive elements have accessible names

### ✅ Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### ✅ Responsive Design
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)
- [ ] Skills Matrix charts scale properly on all sizes
- [ ] Theme toggle accessible on mobile

### ✅ Theme Functionality
- [ ] Light mode displays correctly
- [ ] Dark mode displays correctly
- [ ] System theme matches OS preference
- [ ] No flash of wrong theme on page load (FOUT/FOUC)
- [ ] Theme preference persists across sessions
- [ ] Visualizations (radar/polar charts) render correctly in both themes

## Deployment Steps

### 1. Final Build
```bash
npm run build
```

### 2. Environment Variables
Ensure these are set in your deployment platform:
- `NODE_ENV=production`
- Any API keys or secrets (if applicable)

### 3. Deploy to Platform

#### Vercel (Recommended for Next.js)
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to production
vercel --prod
```

#### Other Platforms
- Netlify: Connect repository and configure build settings
  - Build command: `npm run build`
  - Publish directory: `.next`
  - Node version: 18.x or higher

- AWS Amplify: Connect repository and use default Next.js settings
- Cloudflare Pages: Configure with Next.js build settings

### 4. Post-Deployment Verification
- [ ] Visit production URL
- [ ] Test theme toggle on production
- [ ] Navigate to /skills-matrix and verify visualizations
- [ ] Test all navigation links
- [ ] Check console for errors (F12)
- [ ] Verify analytics/tracking (if applicable)
- [ ] Test form submissions (if applicable)

## Rollback Plan

If issues are discovered post-deployment:

1. **Immediate**: Revert to previous deployment in platform dashboard
2. **Investigation**: Review deployment logs and error tracking
3. **Fix**: Create hotfix branch, test locally, re-deploy
4. **Communication**: Update status page/users if necessary

## Monitoring

After deployment, monitor:
- Error rates in analytics/Sentry
- Page load performance
- User theme preferences (light vs dark vs system)
- Browser/device distribution
- Core Web Vitals (LCP, FID, CLS)

## Common Issues & Solutions

### Flash of Unstyled Content (FOUC)
**Problem**: Wrong theme flashes before correct theme loads
**Solution**: Verify `suppressHydrationWarning` on `<html>` tag and `ThemeProvider` is wrapping app

### Dark Mode Not Working
**Problem**: Site stays in light mode even when dark mode selected
**Solution**: Check CSS variable order in globals.css (`:root` and `.dark` before `@theme`)

### Charts Rendering Incorrectly
**Problem**: Visualizations show wrong colors or layout issues
**Solution**: Clear browser cache, verify `useTheme()` hook is being called in chart components

### Build Failures
**Problem**: Build fails on deployment platform
**Solution**:
- Ensure Node version matches local (18.x+)
- Check for missing dependencies in package.json
- Verify all file imports use correct casing

## Success Criteria

Deployment is successful when:
- ✅ All pages load without errors
- ✅ Theme toggle works in all modes (light/dark/system)
- ✅ Skills Matrix visualizations render correctly
- ✅ No console errors or warnings
- ✅ Lighthouse score > 90 for Performance, Accessibility, Best Practices
- ✅ All interactive elements work as expected
- ✅ Mobile experience is smooth and functional

## Next Steps After Deployment

1. **Monitor**: Watch error logs and analytics for first 24 hours
2. **Gather Feedback**: Share with colleagues/stakeholders
3. **Iterate**: Track feature requests and bugs
4. **Optimize**: Review performance metrics and optimize slow pages
5. **Document**: Update README with deployment notes

## Useful Commands

```bash
# Local development
npm run dev

# Production build
npm run build

# Production preview locally
npm run start

# Type checking
npm run type-check # (if available)

# Linting
npm run lint

# Test
npm run test # (if tests are set up)
```

## Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Dark Mode Implementation Guide](./DARK_MODE.md)
- [Skills Matrix Guide](./SKILLS_MATRIX_GUIDE.md)

---

**Last Updated**: 2026-01-02
**Version**: v2.0 (Dark Mode Release)
