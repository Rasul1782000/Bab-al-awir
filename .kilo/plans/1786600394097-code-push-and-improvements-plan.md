# Plan: Fix Blockers and Push to GitHub

## Current State

- Repo: `https://github.com/Rasul1782000/Bab-al-awir.git` (remote `origin` already configured)
- Branch: `main`, up to date with `origin/main`
- 13 modified files + 4 untracked directories (`auth/`, `flash-screen/`, `auth-shell/`, `auth.service.ts`)
- All changes are **uncommitted**

## Blockers (Must Fix Before Push)

These are code-quality defects that make the current state unfit to push.

### 1. Missing i18n Translation Keys (Critical)
**Files affected:** `frontend/src/assets/i18n/{en,ar,ml,ta}.json`
**Root cause:** The new auth pages (login, signup, forgot-password) and the updated `layout.html` reference translation keys that do not exist in any i18n file.

Missing keys include (non-exhaustive):
- `loginTitle`, `loginSubtitle`, `loginEmail`, `loginPassword`, `loginSubmit`, `loginFillAll`, `loginError`, `loginHintTitle`, `loginHintNote`, `loginForgot`, `loginSignup`
- `signupTitle`, `signupSubtitle`, `signupName`, `signupEmail`, `signupPhone`, `signupPassword`, `signupConfirmPassword`, `signupSubmit`, `signupLogin`, `signupFillAll`, `signupInvalidEmail`, `signupPasswordMismatch`, `signupWeakPassword`, `signupError`
- `forgotTitle`, `forgotSubtitle`, `forgotEmail`, `forgotSubmit`, `forgotSent`, `forgotBackToLogin`, `forgotFillEmail`, `forgotInvalidEmail`, `forgotError`
- `navLogin`, `navLogout`

**Impact:** The app will display raw key strings (e.g., `loginTitle`) instead of human-readable text.

**Fix:** Add all missing keys to all 4 i18n files.

### 2. Login/Signup Forms Don't Prevent Default Submission (Bug)
**Files affected:** `frontend/src/app/features/auth/login/login.ts`, `frontend/src/app/features/auth/signup/signup.ts`
**Root cause:** Templates use `(ngSubmit)="onLogin()"` and `(ngSubmit)="onSignup()"` without `$event.preventDefault()`. Compare with `forgot-password.ts` which correctly uses `(ngSubmit)="onSubmit(); $event.preventDefault()"`.

**Impact:** In some browsers/contexts, the form submission may trigger a full page reload.

**Fix:** Append `; $event.preventDefault()` to both `ngSubmit` bindings.

### 3. AuthShell Component Is Dead Code
**Files affected:** `frontend/src/app/shared/auth-shell/`, `frontend/src/app/shared/shared.module.ts`
**Root cause:** `AuthShell` is declared and exported from `SharedModule`, but the auth page templates (`login.html`, `signup.html`, `forgot-password.html`) do not wrap their content in `<app-auth-shell>`. The component renders nothing on its own.

**Impact:** The auth pages render as bare forms without the intended branded shell background and logo wrapper.

**Fix:** Either wrap each auth page template in `<app-auth-shell>` or remove the `auth-shell` directory and its `SharedModule` registration if it is not intended to be used.

### 4. CRLF Line Endings in Frontend Files
**Files affected:** 16 frontend `.ts`, `.html`, `.scss` files
**Root cause:** Backend has `.gitattributes` with `* text=auto eol=lf`, but the frontend has no equivalent. Git warns "LF will be replaced by CRLF" on these files.

**Fix:** Add a `.gitattributes` file to the frontend directory (or project root) enforcing LF, and normalize existing files.

## Post-Push Improvements (Non-Blocking)

### 5. Security Hardening of `backend/config/dummy.php`
- The `auth.token` value (`baw_live_demo_token_a1b2c3d4e5`) is a hardcoded demo token.
- User passwords are stored in plaintext.
- **Note:** `.env` is correctly gitignored. The `dummy.php` data is demo data, but the token should be treated as a placeholder, not a production secret.

### 6. Flash Screen Navigation Robustness
- `flash-screen.ts` navigates to `/welcome` after a 2s timeout but never applies the `flash-screen--hidden` class.
- This is acceptable because navigation destroys the component, but a guard or cleanup would make it more robust.

## Validation Steps

Before the push, an implementation agent must verify:
1. `ng build` completes without errors.
2. No i18n fallback warnings in the console (all translation keys resolve).
3. Login, signup, and forgot-password forms submit without triggering a page reload.
4. Auth pages render inside the `AuthShell` wrapper (if fix #3 is applied).

## Push Procedure

Once the blockers above are resolved:

```bash
git add .
git commit -m "feat: add auth flow, product images, and flash screen"
git push origin main
```

## Recommendation

The code should **not** be pushed in its current state. The missing i18n keys and form submission bugs will produce a broken user experience. An implementation-capable agent should apply the 4 blocker fixes, validate with `ng build`, and then commit and push.
