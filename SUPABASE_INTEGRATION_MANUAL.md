# Manual de Integración Supabase - NumTrip Platform

## 📋 Estado Actual de la Integración

### ✅ **Componentes Ya Implementados**

**Backend (NestJS)**
- ✅ AuthService completo con métodos Supabase (login, register, verify, refresh)
- ✅ Configuración de cliente Supabase con service key
- ✅ Soporte para tokens mock en desarrollo
- ✅ Integración con base de datos local (Prisma) para sincronización de usuarios
- ✅ Guards y middleware de autenticación funcionando

**Frontend (Next.js)**
- ✅ Cliente Supabase configurado con SSR support
- ✅ Auth Store (Zustand) con soporte dual Mock/Supabase
- ✅ Sistema de autenticación mock para desarrollo activo
- ✅ Componentes de ClaimButton integrados con autenticación
- ✅ Middleware Next.js básico configurado

**Variables de Entorno Configuradas**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://xvauchcfkrbbpfoszlah.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_m5XZWN0muumL2u_pJFpjtg_3qAB7FT7
NEXT_PUBLIC_MOCK_AUTH=true  # Currently active

# Backend (.env)
NEXT_PUBLIC_SUPABASE_URL=https://xvauchcfkrbbpfoszlah.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_m5XZWN0muumL2u_pJFpjtg_3qAB7FT7
SUPABASE_SERVICE_KEY=sb_secret_8VPgI3gIlboHsJNaFQAh8w_96_GR-Lb
```

### 🚧 **Componentes Por Configurar**

1. **Configuración del Proyecto Supabase**
2. **Providers OAuth (Google, GitHub)**
3. **Row Level Security (RLS)**
4. **Email Templates Personalizados**
5. **Desactivar Mock Auth**
6. **Testing Completo**

---

## 🚀 Guía Paso a Paso de Integración

### **Paso 1: Configuración Inicial del Proyecto Supabase**

#### 1.1 Acceder al Dashboard de Supabase
1. Ir a [supabase.com](https://supabase.com) y hacer login
2. Seleccionar el proyecto: `xvauchcfkrbbpfoszlah`
3. Verificar que las URLs y keys coincidan con las variables de entorno

#### 1.2 Configurar Authentication Settings
```sql
-- Navegar a: Authentication > Settings

-- Site URL (Development)
http://localhost:3000

-- Site URL (Production) - Actualizar cuando despliegues
https://numtrip.com

-- Redirect URLs
http://localhost:3000/auth/callback
http://localhost:3000/dashboard
https://numtrip.com/auth/callback
https://numtrip.com/dashboard
```

#### 1.3 Configurar Email Templates
```html
<!-- Navegar a: Authentication > Email Templates -->

<!-- Confirm Signup Template -->
<h2>Confirma tu cuenta en NumTrip</h2>
<p>Gracias por registrarte en NumTrip, la plataforma de contactos turísticos verificados.</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar mi cuenta</a></p>
<p>Si no creaste esta cuenta, puedes ignorar este email.</p>

<!-- Reset Password Template -->
<h2>Restablecer Contraseña - NumTrip</h2>
<p>Recibiste este email porque solicitaste restablecer tu contraseña.</p>
<p><a href="{{ .ConfirmationURL }}">Restablecer mi contraseña</a></p>
<p>Este enlace expira en 24 horas.</p>
```

---

### **Paso 2: Configurar Proveedores OAuth**

#### 2.1 Google OAuth Setup

**En Google Cloud Console:**
1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Crear nuevo proyecto o seleccionar existente
3. Habilitar Google+ API
4. Crear credenciales OAuth 2.0:

```
Authorized JavaScript origins:
- http://localhost:3000
- https://numtrip.com

Authorized redirect URIs:
- https://xvauchcfkrbbpfoszlah.supabase.co/auth/v1/callback
```

**En Supabase Dashboard:**
```bash
# Authentication > Providers > Google
# Habilitar Google provider

Client ID: [Google_Client_ID]
Client Secret: [Google_Client_Secret]
```

#### 2.2 GitHub OAuth Setup

**En GitHub:**
1. Ir a Settings > Developer settings > OAuth Apps
2. New OAuth App:

```
Application name: NumTrip
Homepage URL: https://numtrip.com
Authorization callback URL: https://xvauchcfkrbbpfoszlah.supabase.co/auth/v1/callback
```

**En Supabase Dashboard:**
```bash
# Authentication > Providers > GitHub
# Habilitar GitHub provider

Client ID: [GitHub_Client_ID]
Client Secret: [GitHub_Client_Secret]
```

---

### **Paso 3: Configurar Row Level Security (RLS)**

#### 3.1 Crear Tabla de Users (si no existe)
```sql
-- En SQL Editor de Supabase

-- La tabla auth.users ya existe, pero necesitamos crear políticas
-- para acceder a los metadatos del usuario

-- Crear una vista para acceder a users de forma segura
create or replace view public.user_profiles as
select 
  id,
  email,
  created_at,
  updated_at,
  raw_user_meta_data->>'name' as name,
  raw_user_meta_data->>'phone' as phone
from auth.users;

-- Habilitar RLS en la vista
alter view public.user_profiles enable row level security;
```

#### 3.2 Crear Políticas RLS
```sql
-- Política para que los usuarios solo vean su propia información
create policy "Users can view own profile" on public.user_profiles
for select using (auth.uid() = id);

-- Política para actualizar su propio perfil
create policy "Users can update own profile" on public.user_profiles  
for update using (auth.uid() = id);
```

---

### **Paso 4: Actualizar Frontend para Supabase Real**

#### 4.1 Crear Páginas de Autenticación

**`apps/web/src/app/[locale]/auth/login/page.tsx`**
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold">Login to NumTrip</h1>
        
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        
        <Button type="button" onClick={handleGoogleLogin}>
          Login with Google
        </Button>
      </form>
    </div>
  );
}
```

#### 4.2 Callback Handler
**`apps/web/src/app/[locale]/auth/callback/route.ts`**
```typescript
import { createClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to error page if something went wrong
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
```

---

### **Paso 5: Desactivar Mock Authentication**

#### 5.1 Actualizar Variables de Entorno
```bash
# apps/web/.env.local
# Cambiar esta línea:
NEXT_PUBLIC_MOCK_AUTH=false  # Cambiar de true a false
```

#### 5.2 Actualizar Auth Store
**Opcional: Limpiar código mock del auth store si ya no se necesita**

---

### **Paso 6: Testing del Sistema Completo**

#### 6.1 Test Cases de Autenticación

**Test 1: Email/Password Login**
1. ✅ Registro con email/password
2. ✅ Confirmación de email
3. ✅ Login exitoso
4. ✅ Acceso a dashboard
5. ✅ Logout

**Test 2: OAuth Login**
1. ✅ Login con Google
2. ✅ Callback correcto
3. ✅ Usuario creado en base local
4. ✅ Sesión persistente

**Test 3: Business Claiming**
1. ✅ Usuario autenticado puede reclamar negocio
2. ✅ Código de verificación enviado
3. ✅ Acceso a dashboard empresarial
4. ✅ Guards de seguridad funcionando

#### 6.2 Scripts de Testing

**`apps/web/scripts/test-auth.js`**
```javascript
// Script para testing básico de autenticación
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xvauchcfkrbbpfoszlah.supabase.co';
const supabaseKey = 'sb_publishable_m5XZWN0muumL2u_pJFpjtg_3qAB7FT7';

async function testAuth() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test 1: Sign up
  console.log('Testing signup...');
  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'testpass123'
  });
  
  console.log('Signup result:', { data, error });
  
  // Test 2: Sign in
  console.log('Testing signin...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'test@example.com', 
    password: 'testpass123'
  });
  
  console.log('Signin result:', { loginData, loginError });
}

testAuth();
```

---

### **Paso 7: Configuración para Producción**

#### 7.1 Variables de Entorno de Producción

**Vercel (Frontend)**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xvauchcfkrbbpfoszlah.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_m5XZWN0muumL2u_pJFpjtg_3qAB7FT7
NEXT_PUBLIC_MOCK_AUTH=false
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
NEXT_PUBLIC_APP_URL=https://numtrip.com
NODE_ENV=production
```

**Railway/Render (Backend)**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xvauchcfkrbbpfoszlah.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_m5XZWN0muumL2u_pJFpjtg_3qAB7FT7
SUPABASE_SERVICE_KEY=sb_secret_8VPgI3gIlboHsJNaFQAh8w_96_GR-Lb
DATABASE_URL=your_production_postgres_url
REDIS_URL=your_production_redis_url
JWT_SECRET=production_jwt_secret_very_secure
NODE_ENV=production
```

#### 7.2 Actualizar Site URLs en Supabase
```bash
# En Supabase Dashboard > Authentication > Settings

Site URL: https://numtrip.com

Redirect URLs:
- https://numtrip.com/auth/callback
- https://numtrip.com/dashboard
- https://numtrip.com/dashboard/business/overview
```

---

## 🔒 Consideraciones de Seguridad

### Row Level Security (RLS)
- ✅ Habilitar RLS en todas las tablas públicas
- ✅ Crear políticas restrictivas para cada tabla
- ✅ Testing de acceso no autorizado

### Environment Variables
- ✅ Nunca commitear secrets reales
- ✅ Usar diferentes keys para desarrollo/producción
- ✅ Rotar keys periódicamente

### OAuth Security
- ✅ Configurar dominios autorizados correctamente
- ✅ Usar HTTPS en producción
- ✅ Implementar rate limiting

---

## 🚨 Solución de Problemas Comunes

### Error: "Invalid JWT"
```typescript
// Verificar que las URLs coincidan entre frontend y backend
// Verificar que las keys no hayan expirado
// Check environment variables

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

### Error: "Email not confirmed"
```typescript
// Verificar que el email template esté configurado
// Verificar redirects URLs
// Revisar spam folder para emails de confirmación
```

### Error: OAuth callback failed
```typescript
// Verificar callback URLs en provider (Google/GitHub)
// Verificar redirect URLs en Supabase
// Check browser console for CORS errors
```

---

## ✅ Checklist de Integración Completa

- [ ] ✅ Proyecto Supabase configurado con URLs correctas
- [ ] ✅ Email templates personalizados creados
- [ ] ✅ Google OAuth configurado y funcionando
- [ ] ✅ GitHub OAuth configurado y funcionando
- [ ] ✅ Row Level Security implementado
- [ ] ✅ Frontend login/register pages creadas
- [ ] ✅ Auth callback handler implementado
- [ ] ✅ Mock auth deshabilitado
- [ ] ✅ Testing completo de flujos de auth
- [ ] ✅ Variables de producción configuradas
- [ ] ✅ Business claiming integrado con Supabase real
- [ ] ✅ Dashboard security guards funcionando

---

## 📞 Siguientes Pasos

Una vez completada la integración de Supabase:

1. **Testing Exhaustivo** - Probar todos los flujos de autenticación
2. **Performance Monitoring** - Implementar logging y métricas
3. **User Onboarding** - Mejorar experiencia de primer login
4. **Phase 6 - Data Integration** - Continuar con Google Places API
5. **Production Deployment** - Deploy con configuración real

---

## 📚 Resources Adicionales

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Supabase Integration](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [OAuth Providers Setup](https://supabase.com/docs/guides/auth/social-login)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)