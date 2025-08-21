# 🎨 Design System - Plataforma de Contactos Verificados para Turismo

## 1. Principios de Diseño

### 1.1 Valores Fundamentales
- **Confianza**: Cada elemento visual debe transmitir seguridad y verificación
- **Claridad**: La información de contacto debe ser inmediatamente visible y accesible
- **Velocidad**: Diseño minimalista que prioriza la carga rápida
- **Accesibilidad**: Usable por todos, especialmente en dispositivos móviles

### 1.2 Personalidad de Marca
- **Profesional pero amigable**
- **Moderna sin ser compleja**
- **Local con visión global**
- **Enfocada en la acción**

## 2. Identidad Visual

### 2.1 Logo
- **Concepto**: Símbolo de verificación (✓) integrado con un pin de ubicación
- **Variantes**:
  - Logo completo (símbolo + texto)
  - Logo compacto (solo símbolo)
  - Logo monocromático

### 2.2 Colores

#### Colores Primarios
```css
/* Azul Principal - Confianza y profesionalismo */
--primary-blue: #0066CC;
--primary-blue-hover: #0052A3;
--primary-blue-light: #E6F0FF;

/* Verde Verificación - Estado verificado */
--verified-green: #00A651;
--verified-green-light: #E8F5E9;
```

#### Colores Secundarios
```css
/* Grises - Jerarquía de información */
--gray-900: #1A1A1A; /* Textos principales */
--gray-700: #4A4A4A; /* Textos secundarios */
--gray-500: #737373; /* Textos terciarios */
--gray-300: #D4D4D4; /* Bordes */
--gray-100: #F5F5F5; /* Fondos */

/* Colores de Estado */
--error-red: #DC2626;
--warning-orange: #F59E0B;
--success-green: #10B981;
--info-blue: #3B82F6;
```

#### Colores de Categorías
```css
/* Para diferenciar tipos de servicios */
--hotel-purple: #7C3AED;
--tour-orange: #FB923C;
--transport-blue: #0EA5E9;
```

### 2.3 Tipografía

#### Familia Tipográfica
```css
/* Fuente principal - Sans-serif moderna y legible */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Fuente para números - Monoespaciada para datos de contacto */
--font-mono: 'Roboto Mono', 'Monaco', monospace;
```

#### Escala Tipográfica
```css
/* Tamaños base */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Pesos */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 2.4 Espaciado
```css
/* Sistema de 8 puntos */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### 2.5 Elevación (Sombras)
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
```

### 2.6 Bordes y Radios
```css
--radius-sm: 0.25rem;  /* 4px */
--radius-md: 0.5rem;   /* 8px */
--radius-lg: 0.75rem;  /* 12px */
--radius-xl: 1rem;     /* 16px */
--radius-full: 9999px; /* Píldora */

--border-width: 1px;
--border-color: var(--gray-300);
```

## 3. Grid System y Layout

### 3.1 Contenedores
```css
/* Anchos máximos */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;

/* Padding lateral */
--container-padding: 1rem; /* Móvil */
--container-padding-lg: 2rem; /* Desktop */
```

### 3.2 Grid
- **Sistema**: 12 columnas
- **Gutter**: 24px (desktop), 16px (móvil)
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

## 4. Componentes

### 4.1 Botones

#### Variantes
```jsx
/* Primario - Acciones principales */
<Button variant="primary">
  Buscar
</Button>

/* Secundario - Acciones secundarias */
<Button variant="secondary">
  Filtrar
</Button>

/* Ghost - Acciones terciarias */
<Button variant="ghost">
  Cancelar
</Button>

/* Verificado - Estado especial */
<Button variant="verified">
  ✓ Verificado
</Button>
```

#### Tamaños
- **Small**: 32px altura, 14px texto
- **Medium**: 40px altura, 16px texto
- **Large**: 48px altura, 18px texto

#### Estados
- Default
- Hover
- Active
- Disabled
- Loading

### 4.2 Tarjetas de Empresa

```jsx
<BusinessCard>
  <BusinessHeader>
    <CategoryBadge type="hotel" />
    <VerifiedBadge status={true} />
  </BusinessHeader>
  
  <BusinessInfo>
    <BusinessName />
    <BusinessRating />
  </BusinessInfo>
  
  <ContactSection>
    <ContactItem type="phone" />
    <ContactItem type="email" />
    <ContactItem type="whatsapp" />
  </ContactSection>
  
  <PromoSection />
  <ValidationSection />
</BusinessCard>
```

### 4.3 Campos de Formulario

#### Input de Búsqueda
```jsx
<SearchInput>
  <SearchIcon />
  <Input placeholder="Buscar hoteles, tours..." />
  <ClearButton />
</SearchInput>
```

#### Selectores
```jsx
<Select>
  <option>Cartagena</option>
  <option>Santa Marta</option>
</Select>
```

### 4.4 Badges y Etiquetas

#### Badge de Verificación
```jsx
<VerifiedBadge>
  ✓ Verificado
</VerifiedBadge>
```

#### Badge de Categoría
```jsx
<CategoryBadge type="hotel">
  Hotel
</CategoryBadge>
```

#### Badge de Promoción
```jsx
<PromoBadge>
  20% OFF
</PromoBadge>
```

### 4.5 Modales y Overlays

```jsx
<Modal size="medium">
  <ModalHeader>
    <ModalTitle />
    <CloseButton />
  </ModalHeader>
  
  <ModalBody>
    {/* Contenido */}
  </ModalBody>
  
  <ModalFooter>
    <Button variant="secondary">Cancelar</Button>
    <Button variant="primary">Confirmar</Button>
  </ModalFooter>
</Modal>
```

### 4.6 Notificaciones

#### Toast
```jsx
<Toast type="success">
  Número copiado al portapapeles
</Toast>
```

#### Alert
```jsx
<Alert type="info">
  Esta empresa ofrece descuentos exclusivos
</Alert>
```

## 5. Iconografía

### 5.1 Sistema de Iconos
- **Librería**: Lucide Icons (consistente, código abierto)
- **Tamaño base**: 24x24px
- **Stroke**: 2px
- **Variantes**: 16px, 20px, 24px, 32px

### 5.2 Iconos Principales
```
- search (búsqueda)
- phone (teléfono)
- mail (email)
- message-circle (WhatsApp)
- map-pin (ubicación)
- check-circle (verificado)
- alert-circle (reportar)
- copy (copiar)
- star (calificación)
- filter (filtrar)
- chevron-down (expandir)
- x (cerrar)
```

## 6. Patrones de Interacción

### 6.1 Estados de Carga
- **Skeleton screens** para carga inicial
- **Spinners** para acciones puntuales
- **Progress bars** para procesos largos

### 6.2 Feedback Visual
- **Hover**: Cambio de color + cursor pointer
- **Active**: Escala 0.98 + sombra reducida
- **Focus**: Outline azul de 2px
- **Disabled**: Opacidad 0.5 + cursor not-allowed

### 6.3 Animaciones
```css
/* Transiciones estándar */
--transition-fast: 150ms ease-in-out;
--transition-base: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;

/* Curvas de animación */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0.0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

## 7. Responsive Design

### 7.1 Breakpoints
```css
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
```

### 7.2 Comportamiento Móvil
- **Touch targets**: Mínimo 44x44px
- **Navegación**: Bottom navigation en móvil
- **Modales**: Full screen en móvil
- **Tarjetas**: Stack vertical en móvil

## 8. Accesibilidad

### 8.1 Contraste
- **Texto normal**: Mínimo 4.5:1
- **Texto grande**: Mínimo 3:1
- **Enlaces**: Subrayado + color diferenciado

### 8.2 Focus Management
- **Tab order** lógico
- **Skip links** para navegación
- **Focus traps** en modales

### 8.3 ARIA Labels
```jsx
<button aria-label="Copiar número de teléfono">
  <CopyIcon />
</button>
```

## 9. Dark Mode (Futuro)

### 9.1 Colores Dark Mode
```css
/* Inversión de grises */
--dark-bg: #1A1A1A;
--dark-surface: #2D2D2D;
--dark-text: #F5F5F5;
--dark-text-secondary: #A3A3A3;
```

## 10. Guías de Implementación

### 10.1 Nomenclatura CSS
- **BEM** para componentes: `.card__header--verified`
- **Utility classes** con Tailwind CSS

### 10.2 Estructura de Componentes
```
/components
  /ui
    /Button
      Button.tsx
      Button.styles.ts
      Button.test.tsx
    /Card
    /Input
  /business
    /BusinessCard
    /ContactItem
  /layout
    /Header
    /Footer
```

### 10.3 Tokens de Diseño
Exportar como:
- CSS variables
- JS/TS constants
- Tailwind config
- Figma tokens

## 11. Casos de Uso Específicos

### 11.1 Página de Búsqueda
- Grid de 3 columnas en desktop
- 1 columna en móvil
- Filtros colapsables en móvil
- Carga infinita con skeleton

### 11.2 Perfil de Empresa
- Hero section con verificación prominente
- Sección de contacto sticky en móvil
- Botones de acción flotantes
- Códigos promocionales destacados

### 11.3 Panel de Administración
- Sidebar navegación en desktop
- Bottom tabs en móvil
- Formularios en pasos
- Feedback inmediato en guardado