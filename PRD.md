# Product Requirements Document (PRD)
## NumTrip - Directorio de Contactos Turísticos Verificados

### 1. Resumen Ejecutivo

**Producto:** NumTrip
**Versión:** 1.0.0
**Fecha:** Septiembre 2025
**Estado:** En Desarrollo

NumTrip es una plataforma web que proporciona información de contacto verificada para servicios turísticos, comenzando con Cartagena, Colombia. La plataforma resuelve el problema crítico de información de contacto desactualizada o incorrecta en directorios turísticos tradicionales, ofreciendo datos verificados y actualizados por la comunidad.

### 2. Problema

#### 2.1 Declaración del Problema
Los viajeros enfrentan dificultades significativas al intentar contactar servicios turísticos en destinos internacionales:
- **Información desactualizada:** 40% de los números telefónicos en directorios tradicionales están desactualizados
- **Barreras de idioma:** Dificultad para comunicarse con proveedores locales
- **Falta de verificación:** No hay forma de saber si la información de contacto es correcta antes de necesitarla
- **Dispersión de información:** Los datos están fragmentados en múltiples plataformas

#### 2.2 Impacto
- Pérdida de tiempo valioso durante el viaje
- Experiencias frustrantes que afectan la satisfacción del viaje
- Pérdida de oportunidades de negocio para proveedores locales
- Desconfianza en servicios turísticos locales

### 3. Solución

#### 3.1 Propuesta de Valor
NumTrip ofrece un directorio confiable de contactos turísticos con:
- ✅ Información verificada por la comunidad y los propietarios
- 📱 Acceso directo a WhatsApp, teléfono y email
- 🌐 Interfaz multiidioma (Español/Inglés)
- 🔍 Búsqueda optimizada por categorías y ubicación
- 📊 Validación comunitaria continua

#### 3.2 Características Principales

##### Para Viajeros
- **Búsqueda Inteligente:** Filtros por categoría, ciudad y servicios
- **Contacto Directo:** Enlaces directos a WhatsApp, llamadas y email
- **Información Verificada:** Badges de verificación para negocios confirmados
- **Multiidioma:** Soporte completo en español e inglés
- **Mobile-First:** Diseño optimizado para uso móvil durante el viaje

##### Para Negocios
- **Reclamación de Perfil:** Proceso simple de verificación por email/SMS
- **Panel de Control:** Gestión de información y estadísticas
- **Sin Publicidad:** Perfiles verificados sin anuncios (primeros 6 meses gratis)
- **Códigos Promocionales:** Sistema de descuentos para atraer clientes
- **Análisis de Visitas:** Métricas detalladas de visualizaciones

##### Para la Comunidad
- **Validación Colaborativa:** Sistema de reportes y confirmaciones
- **Actualizaciones en Tiempo Real:** Cambios reflejados inmediatamente
- **Contribución Reconocida:** Sistema de reconocimiento para validadores activos

### 4. Usuarios

#### 4.1 Personas Objetivo

##### Viajero Internacional (Primario)
- **Demografía:** 25-45 años, poder adquisitivo medio-alto
- **Comportamiento:** Planifica viajes con anticipación, usa smartphone activamente
- **Necesidades:** Información confiable, comunicación rápida, sin barreras idiomáticas
- **Frustraciones:** Números incorrectos, pérdida de tiempo, experiencias negativas

##### Propietario de Negocio Turístico (Secundario)
- **Demografía:** Pequeños y medianos negocios en Cartagena
- **Comportamiento:** Busca visibilidad online, limitado presupuesto marketing
- **Necesidades:** Presencia digital, alcanzar turistas internacionales
- **Frustraciones:** Competencia con grandes plataformas, costos de publicidad

##### Validador Comunitario
- **Demografía:** Locales y viajeros frecuentes
- **Comportamiento:** Activos en redes sociales, disfrutan ayudar
- **Necesidades:** Contribuir a su comunidad, reconocimiento
- **Frustraciones:** Información incorrecta en otros sitios

#### 4.2 Casos de Uso

1. **Búsqueda Pre-Viaje**
   - Usuario busca hoteles en Cartagena
   - Filtra por categoría y ubicación
   - Guarda contactos importantes

2. **Contacto de Emergencia**
   - Turista necesita transporte urgente
   - Abre NumTrip, busca "taxi"
   - Contacta directamente por WhatsApp

3. **Verificación de Negocio**
   - Propietario reclama su perfil
   - Completa verificación por SMS
   - Actualiza información y añade promociones

4. **Validación Comunitaria**
   - Usuario detecta número incorrecto
   - Reporta el problema
   - Comunidad valida la corrección

### 5. Requerimientos Funcionales

#### 5.1 Búsqueda y Navegación
- **REQ-001:** Sistema de búsqueda con filtros por categoría, ciudad y palabra clave
- **REQ-002:** Resultados ordenados por relevancia y verificación
- **REQ-003:** Paginación de resultados (20 por página)
- **REQ-004:** Búsqueda predictiva con sugerencias

#### 5.2 Gestión de Perfiles
- **REQ-005:** Visualización de información completa del negocio
- **REQ-006:** Badges de verificación visibles
- **REQ-007:** Integración con Google Maps para ubicación
- **REQ-008:** Galería de imágenes (máximo 10)

#### 5.3 Sistema de Contacto
- **REQ-009:** Enlaces directos a WhatsApp con mensaje pre-formateado
- **REQ-010:** Click-to-call para números telefónicos
- **REQ-011:** Formulario de contacto por email
- **REQ-012:** Copiar información al portapapeles

#### 5.4 Verificación y Reclamación
- **REQ-013:** Proceso de reclamación en 3 pasos
- **REQ-014:** Verificación por email, SMS o llamada
- **REQ-015:** Panel de administración post-verificación
- **REQ-016:** Gestión de información del negocio

#### 5.5 Sistema de Validación
- **REQ-017:** Botones de validación (correcto/incorrecto)
- **REQ-018:** Contador de validaciones públicas
- **REQ-019:** Sistema de reportes con categorización
- **REQ-020:** Moderación de cambios sugeridos

#### 5.6 Internacionalización
- **REQ-021:** Interfaz completa en español e inglés
- **REQ-022:** Detección automática de idioma
- **REQ-023:** Selector manual de idioma
- **REQ-024:** URLs localizadas para SEO

### 6. Requerimientos No Funcionales

#### 6.1 Rendimiento
- **Tiempo de carga inicial:** < 3 segundos
- **Navegación entre páginas:** < 1 segundo
- **Tiempo de respuesta API:** < 500ms
- **Disponibilidad:** 99.9% uptime

#### 6.2 Escalabilidad
- **Usuarios concurrentes:** 10,000+
- **Registros en base de datos:** 1,000,000+ negocios
- **Expansión geográfica:** Arquitectura multi-ciudad

#### 6.3 Seguridad
- **Autenticación:** Supabase Auth con JWT
- **Encriptación:** HTTPS en toda la plataforma
- **Protección de datos:** Cumplimiento GDPR
- **Rate limiting:** Prevención de spam y abuso

#### 6.4 SEO y Accesibilidad
- **Core Web Vitals:** Puntuación > 90
- **Schema markup:** Datos estructurados para negocios
- **Sitemap dinámico:** Actualización automática
- **WCAG 2.1:** Nivel AA de accesibilidad
- **IndexNow:** Indexación inmediata en buscadores

#### 6.5 Compatibilidad
- **Navegadores:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dispositivos:** Responsive design para móvil, tablet y desktop
- **Resoluciones:** 320px hasta 4K

### 7. Arquitectura Técnica

#### 7.1 Stack Tecnológico

##### Frontend
- **Framework:** Next.js 14.2 con App Router
- **Lenguaje:** TypeScript 5.4
- **Estilos:** Tailwind CSS 3.4
- **Componentes:** Shadcn/ui
- **Estado:** TanStack Query + Zustand

##### Backend
- **Plataforma:** Supabase (BaaS)
- **Base de Datos:** PostgreSQL
- **Autenticación:** Supabase Auth
- **Storage:** Supabase Storage
- **Edge Functions:** Deno runtime

##### Infraestructura
- **Hosting Frontend:** Vercel
- **CDN:** Cloudflare
- **Monitoreo:** Google Analytics
- **Monetización:** Google AdSense

#### 7.2 Modelo de Datos

##### Tablas Principales
- **businesses:** Información de negocios
- **contacts:** Detalles de contacto
- **validations:** Validaciones comunitarias
- **business_claims:** Reclamaciones y verificaciones
- **profiles:** Perfiles de usuarios
- **promo_codes:** Códigos promocionales

### 8. Modelo de Negocio

#### 8.1 Fuentes de Ingresos

##### Corto Plazo (0-6 meses)
- **Google AdSense:** En perfiles no verificados
- **Sin costo:** Para negocios verificados (go-to-market)

##### Mediano Plazo (6-12 meses)
- **Planes Premium:** $9.99/mes por negocio
  - Sin publicidad
  - Estadísticas avanzadas
  - Destacado en búsquedas
  - Códigos promocionales ilimitados

##### Largo Plazo (12+ meses)
- **API de Datos:** Acceso para agregadores
- **Publicidad Nativa:** Promociones destacadas
- **Servicios Adicionales:** Gestión de reseñas, reservas

#### 8.2 Estrategia Go-to-Market

##### Fase 1: Lanzamiento en Cartagena
- Importación inicial de 5,000+ negocios
- Verificación manual de top 100 negocios
- Campaña de awareness local
- Partnership con oficina de turismo

##### Fase 2: Crecimiento y Validación
- Gamificación de validaciones comunitarias
- Programa de embajadores locales
- Integración con influencers de viaje
- Optimización SEO para búsquedas turísticas

##### Fase 3: Expansión
- Nuevas ciudades: Santa Marta, Bogotá, Medellín
- Expansión internacional: México, Perú
- Desarrollo de app móvil nativa
- Integraciones con OTAs

### 9. Métricas de Éxito

#### 9.1 KPIs Principales
- **MAU (Monthly Active Users):** Target 50,000 en 6 meses
- **Negocios Verificados:** 500+ en 3 meses
- **Tasa de Validación:** 70% de negocios con validación comunitaria
- **Conversión a Premium:** 10% de negocios verificados

#### 9.2 Métricas de Engagement
- **Sesiones por Usuario:** > 3 por mes
- **Páginas por Sesión:** > 5
- **Tasa de Rebote:** < 40%
- **Clicks en Contacto:** > 30% de visitas

#### 9.3 Métricas de Calidad
- **Precisión de Datos:** > 95% contactos correctos
- **Tiempo de Verificación:** < 48 horas
- **Satisfacción de Usuario:** NPS > 50

### 10. Riesgos y Mitigación

#### 10.1 Riesgos Técnicos
- **Riesgo:** Escalabilidad de base de datos
- **Mitigación:** Arquitectura serverless con Supabase

#### 10.2 Riesgos de Mercado
- **Riesgo:** Competencia de Google My Business
- **Mitigación:** Enfoque en verificación y comunidad local

#### 10.3 Riesgos Operacionales
- **Riesgo:** Calidad de datos inicial
- **Mitigación:** Validación comunitaria y verificación dual

### 11. Roadmap

#### Q4 2024
- ✅ MVP con funcionalidad básica
- ✅ Importación inicial de datos
- ✅ Sistema de verificación
- ✅ Integración IndexNow

#### Q1 2025
- [ ] App móvil PWA
- [ ] Sistema de reseñas
- [ ] API pública
- [ ] Expansión a 3 ciudades

#### Q2 2025
- [ ] Integración con booking
- [ ] Sistema de reservas
- [ ] Programa de afiliados
- [ ] Expansión internacional

### 12. Conclusión

NumTrip está posicionado para convertirse en la fuente definitiva de información de contacto verificada para servicios turísticos en América Latina. Con un enfoque en la verificación comunitaria y la experiencia del usuario, la plataforma resuelve un problema real y tangible para millones de viajeros mientras proporciona valor significativo a los negocios locales.

---

*Documento preparado por: Equipo NumTrip*
*Última actualización: Septiembre 2025*