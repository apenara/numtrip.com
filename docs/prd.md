📄 Product Requirements Document (PRD)

Producto: Plataforma de Contactos Verificados para Turismo
Versión: 1.2
Fecha: 2025-08-21
Autor: Alfonso Peñaranda

1. Visión del Producto

Crear una plataforma global donde los viajeros puedan encontrar números de contacto, correos y WhatsApp verificados de hoteles, agencias de tours y transporte. La información será colaborativa, verificada y SEO friendly para ser la fuente confiable de contacto directo en turismo a nivel mundial.

2. Objetivos

Captar tráfico orgánico en búsquedas relacionadas a “teléfonos y contactos de hoteles/tours”.

Generar un directorio vivo y actualizado por la comunidad y las empresas.

Monetizar vía planes Premium, publicidad y listados destacados.

Iniciar en Cartagena como ciudad piloto, expandiendo después globalmente.

👉 Expandir el alcance orgánico a mercados internacionales (ej: viajeros de habla inglesa) en fases posteriores.

3. Alcance (MVP)
Funcionalidades principales

Directorio básico por ciudad (carga inicial con Google Places API).

Buscador por nombre, ciudad y tipo de servicio.

Perfil de empresa con datos de contacto (Teléfono, correo, WhatsApp).

Botones de validación comunitaria (“Reportar incorrecto”, “Confirmar que funciona”).

Sistema de verificación empresarial (reclamar perfil).

Códigos promocionales (para empresas Premium).

Ads de Google AdSense en perfiles no verificados.

👉 Idioma inicial (MVP): Español, enfocado en el mercado local y latinoamericano para la prueba piloto.

👉 Arquitectura Multi-idioma: La plataforma se construirá desde el inicio con una arquitectura que soporte múltiples idiomas para facilitar la expansión futura.

Funcionalidades futuras (fase 2)

Estadísticas avanzadas para empresas.

Listados Premium en resultados de búsqueda.

Chat directo en WhatsApp con mensaje predefinido.

👉 Soporte para nuevos idiomas: Expansión a inglés, portugués, etc., con contenido completamente localizado.

4. Modelos de Monetización

Adsense / Ads directos.

Planes Premium para empresas (Sello ✅, códigos, estadísticas, chat directo, etc.).

Leads calificados y Marketplace futuro.

5. Stack Tecnológico
Frontend: Next.js (React), TailwindCSS.
Backend: Node.js + NestJS / Express.
Base de datos: PostgreSQL, Redis.
Infraestructura: Vercel, AWS/GCP, Cloudflare CDN.
Carga de datos: Google Places API.
Autenticación y Pagos: Supabase/Auth0, Stripe/PayU.

👉 Estrategia SEO Internacional y Localización

Estructura de URL: Se utilizará una estrategia de subdirectorios (ej: dominio.com/es/, dominio.com/en/). Esta configuración consolida toda la autoridad del dominio (link juice) en una sola entidad, maximizando el impacto SEO y siendo la práctica recomendada por Google.

Implementación Técnica: Se implementarán etiquetas hreflang en todas las páginas para indicar a los buscadores las versiones alternativas de cada URL por idioma. Esto previene problemas de contenido duplicado y asegura que Google muestre la versión correcta al usuario en cada región.

Soporte del Framework: Next.js ofrece soporte nativo para internacionalización (i18n routing), lo que simplificará la gestión de rutas, la detección de idioma y la entrega de contenido localizado de manera eficiente.

6. Incentivos para Usuarios

Gamificación (puntos, insignias), beneficios exclusivos y sorteos mensuales para fomentar la validación de datos.

7. Proceso de Reclamar Perfil (Verificación Empresarial)

Flujo de verificación a través de correo corporativo, llamada telefónica/SMS o, en casos excepcionales, documentación.

8. Flujo del Usuario (MVP)

Un visitante llega desde Google, encuentra un perfil, puede usar/validar los datos o aprovechar un código promocional. El propietario puede reclamar su perfil para acceder a beneficios Premium.

9. Estrategia Go-To-Market (Cartagena Piloto)

Carga masiva de datos iniciales vía API. Campaña de contacto a negocios clave con oferta de 6 meses de plan Premium gratuito para generar tracción y confianza desde el lanzamiento.

10. Métricas de Éxito (KPIs)

Tráfico orgánico mensual.

Número de perfiles reclamados/verificados.

Cantidad de validaciones de la comunidad.

Conversión de códigos promocionales.

Ingresos recurrentes mensuales (MRR).

👉 Tráfico orgánico segmentado por idioma/país (KPI futuro clave).

11. Riesgos y Consideraciones

Legales: Mitigado al usar APIs oficiales en lugar de scraping no autorizado.

Engagement de usuarios: Mitigado con sistema de incentivos y gamificación.

Competencia (Google Maps/TripAdvisor): Diferenciador claro en contacto directo + descuentos exclusivos.

Problema del "Huevo y la gallina": Mitigado con carga inicial de datos + campaña de adopción empresarial.

👉 Mala calidad en la localización: El riesgo de usar traducciones automáticas que dañen la experiencia y el SEO. Se mitigará invirtiendo en localización profesional (realizada por hablantes nativos) para cada nuevo mercado, comenzando con el inglés.

Resumen de la Actualización (Versión 1.2)