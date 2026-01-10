# 🔐 ADMIN ACCOUNT SETUP - SUPABASE

## Current Setup

Right now, your app uses a **simple password-based admin login**:
- Password: `admin2026david` (hardcoded in code)
- No database authentication for admin

## Option 1: Keep Current Setup (Simplest) ✅

**Pros:**
- Already working
- No extra setup needed
- Simple and fast

**Cons:**
- Password is in source code
- Can't have multiple admins
- Can't revoke access easily

**This is what you currently have and it works fine for a single admin!**

---

## Option 2: Add Supabase Authentication (Recommended for Production)

This creates a proper admin account with email/password in Supabase.

### Step 1: Enable Email Authentication in Supabase

1. Go to: https://supabase.com/dashboard/project/fjdkdoantfcwbnsqghlj/auth/users
2. Click **"Add user"** button (top right)
3. Fill in:
   ```
   Email: contactphotodavidirie@gmail.com
   Password: [Choose a strong password]
   Auto Confirm Email: ✅ YES
   ```
4. Click **"Create user"**

### Step 2: Update Code to Use Supabase Auth

Create a new file: `src/config/auth.js`

```javascript
import { supabase } from './supabase'

/**
 * Sign in admin user
 */
export async function signInAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

/**
 * Sign out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}
```

### Step 3: Update PrivateGalleries.jsx

Replace the admin password check with Supabase auth:

```javascript
import { signInAdmin, signOut, getCurrentUser } from '../config/auth'

// In handleLogin function:
const handleLogin = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)
  
  try {
    // Try admin login with Supabase Auth
    try {
      await signInAdmin(password, password) // Or use email field
      setIsAdmin(true)
      setIsAuthenticated(true)
      return
    } catch (adminError) {
      // Not admin, try client gallery password
      const gallery = await getGalleryByPassword(password)
      
      if (gallery) {
        setIsAuthenticated(true)
        setSelectedGallery(gallery)
      } else {
        setError('Mot de passe incorrect. Veuillez réessayer.')
        setPassword('')
      }
    }
  } catch (err) {
    console.error('Login error:', err)
    setError('Une erreur est survenue. Veuillez réessayer.')
  } finally {
    setLoading(false)
  }
}

// In handleLogout:
const handleLogout = async () => {
  if (isAdmin) {
    await signOut()
  }
  setIsAuthenticated(false)
  setIsAdmin(false)
  setSelectedGallery(null)
  setPassword('')
}
```

---

## Option 3: Create Admin Users Table (Most Flexible)

This allows multiple admin accounts and role-based access.

### Step 1: Create Admin Table in Supabase

Run this SQL in Supabase SQL Editor:

```sql
-- Create admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create index
CREATE INDEX idx_admin_email ON admin_users(email);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can read
CREATE POLICY "Admin users readable by authenticated"
ON admin_users FOR SELECT
USING (auth.role() = 'authenticated');

-- Insert first admin (password: admin2026david)
-- Note: You should use bcrypt in production!
INSERT INTO admin_users (email, password_hash, name)
VALUES (
  'contactphotodavidirie@gmail.com',
  '$2a$10$encrypted_password_here', -- Use bcrypt.hash('admin2026david', 10)
  'David Irie'
);
```

### Step 2: Install bcrypt for password hashing

```bash
npm install bcryptjs
```

### Step 3: Create admin auth functions

```javascript
import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

export async function loginAdmin(email, password) {
  // Get admin user
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .single()
  
  if (error || !data) {
    throw new Error('Invalid credentials')
  }
  
  // Verify password
  const isValid = await bcrypt.compare(password, data.password_hash)
  
  if (!isValid) {
    throw new Error('Invalid credentials')
  }
  
  // Update last login
  await supabase
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', data.id)
  
  return data
}
```

---

## 🎯 RECOMMENDATION

**For now, stick with Option 1** (current setup):
- ✅ It's working
- ✅ Simple and fast
- ✅ Good enough for single admin

**Later, upgrade to Option 2** when you need:
- Multiple admin accounts
- Better security
- Audit logs
- Password reset functionality

---

## 🔒 Current Admin Access

**URL:** http://localhost:5174/#/galeries-privees  
**Password:** `admin2026david`

**In production:** https://your-site.run.app/#/galeries-privees  
**Password:** `admin2026david`

---

## 📝 Quick Security Tips

1. **Change the admin password** in code to something unique
2. **Use HTTPS** (Cloud Run does this automatically)
3. **Don't share the admin password**
4. **Consider 2FA** if using Option 2
5. **Monitor access logs** in Supabase dashboard

---

**Need help implementing any of these options? Let me know!**
