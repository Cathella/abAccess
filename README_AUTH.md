# Authentication System - Quick Start

## 📖 Full Documentation

See **[AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)** for complete documentation.

## ✅ Status: Production Ready

All MVP authentication requirements are implemented and tested.

## 🚀 Quick Start

### For Developers

```typescript
import { useAuth } from '@/hooks/useAuth';

export default function MyPage() {
  const { login, user, isAuthenticated, logout } = useAuth();

  // Login
  const handleLogin = async () => {
    const result = await login('+256781234567', '1234');
    if (result.success) {
      router.push('/dashboard');
    }
  };

  // Check auth
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome {user.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `lib/supabase/auth.ts` | Core auth functions |
| `stores/authStore.ts` | State management |
| `hooks/useAuth.ts` | **Use this in components** |
| `types/index.ts` | User, LoginResult types |
| `supabase-schema.sql` | Database schema |

## 🔐 Security Features

- ✅ bcryptjs PIN hashing (10 rounds)
- ✅ 3-attempt lockout
- ✅ Smart session persistence
- ✅ Route protection
- ✅ Type-safe implementation

## 📋 Setup Checklist

- [ ] Create Supabase project
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add Supabase URL and anon key to `.env.local`
- [ ] Run `supabase-schema.sql` in Supabase SQL Editor
- [ ] Verify tables created (11 tables)
- [ ] Test login flow

## 🎯 What Works

- ✅ Phone + PIN authentication
- ✅ Secure PIN hashing
- ✅ Attempt limiting (3 max)
- ✅ Session persistence
- ✅ Type-safe User model
- ✅ Route protection
- ✅ "Forgot PIN?" state

## 📖 Documentation

- **Main Guide:** [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)
- **Archived Docs:** [docs/archive/](./docs/archive/)

## 🧪 Test It

```typescript
// In browser console
import { useAuth } from '@/hooks/useAuth';

const { login } = useAuth();
await login('+256781234567', '1234');
```

## 💡 Need Help?

1. Read [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)
2. Check troubleshooting section
3. Review code examples
4. See archived docs in `docs/archive/`

---

**Ready to build the UI!** All backend logic is complete and tested.
