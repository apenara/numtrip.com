📐 Reglas de Desarrollo - Plataforma de Contactos Verificados
1. 🏗️ Arquitectura y Estructura
1.1 Estructura de Carpetas (Monorepo)
/contactos-turisticos
├── /apps
│   ├── /web                    # Frontend Next.js
│   │   ├── /app                # App Router
│   │   │   ├── /[locale]       # i18n routes
│   │   │   ├── /api           # API routes
│   │   │   └── /components    # Componentes de página
│   │   ├── /components        # Componentes compartidos
│   │   ├── /hooks             # Custom hooks
│   │   ├── /lib               # Utilidades
│   │   ├── /services          # API calls
│   │   └── /stores            # Zustand stores
│   │
│   └── /api                    # Backend NestJS
│       ├── /src
│       │   ├── /modules       # Módulos feature-based
│       │   │   ├── /auth
│       │   │   ├── /business
│       │   │   ├── /search
│       │   │   └── /validation
│       │   ├── /common        # Shared resources
│       │   ├── /config        # Configuraciones
│       │   └── /database      # Prisma schemas
│       └── /test
│
├── /packages                   # Código compartido
│   ├── /ui                    # Componentes UI
│   ├── /types                 # TypeScript types
│   ├── /utils                 # Utilidades compartidas
│   └── /config                # Configuraciones compartidas
│
└── /tools                     # Scripts y herramientas
1.2 Arquitectura Modular
typescript// Cada módulo es independiente y autocontenido
/modules/business
├── business.module.ts
├── business.controller.ts
├── business.service.ts
├── business.repository.ts
├── dto/
├── entities/
├── interfaces/
└── tests/
2. 🎯 Principios SOLID
2.1 Single Responsibility Principle (SRP)
typescript// ❌ MAL: Clase que hace demasiadas cosas
class BusinessService {
  async createBusiness() { }
  async sendEmail() { }
  async validatePhone() { }
  async generateReport() { }
}

// ✅ BIEN: Cada servicio con una responsabilidad
class BusinessService {
  constructor(
    private emailService: EmailService,
    private validationService: ValidationService,
    private reportService: ReportService
  ) {}
  
  async createBusiness(data: CreateBusinessDto) {
    const validated = await this.validationService.validateBusiness(data);
    // lógica de negocio
    await this.emailService.sendWelcome(business.email);
    return business;
  }
}
2.2 Open/Closed Principle (OCP)
typescript// Sistema de notificaciones extensible
interface NotificationChannel {
  send(message: string, recipient: string): Promise<void>;
}

class EmailChannel implements NotificationChannel {
  async send(message: string, recipient: string) {
    // implementación email
  }
}

class WhatsAppChannel implements NotificationChannel {
  async send(message: string, recipient: string) {
    // implementación WhatsApp
  }
}

// Fácil agregar nuevos canales sin modificar código existente
class SMSChannel implements NotificationChannel {
  async send(message: string, recipient: string) {
    // implementación SMS
  }
}
2.3 Liskov Substitution Principle (LSP)
typescript// Base abstracta para providers de búsqueda
abstract class SearchProvider {
  abstract search(query: string): Promise<SearchResult[]>;
  abstract filter(filters: FilterOptions): Promise<SearchResult[]>;
}

// Implementaciones intercambiables
class ElasticsearchProvider extends SearchProvider { }
class PostgresSearchProvider extends SearchProvider { }
class AlgoliaProvider extends SearchProvider { }
2.4 Interface Segregation Principle (ISP)
typescript// ❌ MAL: Interface muy grande
interface User {
  id: string;
  email: string;
  business?: Business;
  adminPermissions?: string[];
  lastLogin?: Date;
}

// ✅ BIEN: Interfaces específicas
interface BaseUser {
  id: string;
  email: string;
}

interface BusinessOwner extends BaseUser {
  business: Business;
}

interface AdminUser extends BaseUser {
  adminPermissions: string[];
  lastLogin: Date;
}
2.5 Dependency Inversion Principle (DIP)
typescript// Depender de abstracciones, no de implementaciones concretas
interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

// Implementación con Redis
@Injectable()
class RedisCacheService implements CacheService {
  constructor(@Inject('REDIS_CLIENT') private redis: Redis) {}
  // implementación
}

// Fácil cambiar a otra implementación
class MemoryCacheService implements CacheService { }
3. 🔄 Principio DRY (Don't Repeat Yourself)
3.1 Componentes Reutilizables
typescript// packages/ui/src/components/DataDisplay/ContactItem.tsx
interface ContactItemProps {
  type: 'phone' | 'email' | 'whatsapp';
  value: string;
  verified?: boolean;
  onCopy?: () => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({
  type,
  value,
  verified = false,
  onCopy
}) => {
  const icon = {
    phone: <Phone />,
    email: <Mail />,
    whatsapp: <MessageCircle />
  }[type];
  
  return (
    <div className="contact-item">
      {icon}
      <span>{value}</span>
      {verified && <VerifiedBadge />}
      <CopyButton onClick={onCopy} />
    </div>
  );
};
3.2 Custom Hooks Compartidos
typescript// packages/utils/src/hooks/useClipboard.ts
export const useClipboard = () => {
  const [copied, setCopied] = useState(false);
  
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      return false;
    }
  }, []);
  
  return { copy, copied };
};
3.3 Utilidades Compartidas
typescript// packages/utils/src/validation/phone.ts
export const phoneValidation = {
  isValid: (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  },
  
  format: (phone: string, countryCode = '+57'): string => {
    const cleaned = phone.replace(/\D/g, '');
    return `${countryCode} ${cleaned}`;
  },
  
  isWhatsApp: async (phone: string): Promise<boolean> => {
    // lógica de validación WhatsApp
  }
};
4. 🧪 Testing Strategy
4.1 Estructura de Tests
typescript// Cada componente/servicio con su test
BusinessService.ts
BusinessService.spec.ts
BusinessService.integration.spec.ts
4.2 Test Patterns
typescript// Unit Test
describe('BusinessService', () => {
  let service: BusinessService;
  let mockRepository: jest.Mocked<BusinessRepository>;
  
  beforeEach(() => {
    mockRepository = createMock<BusinessRepository>();
    service = new BusinessService(mockRepository);
  });
  
  describe('createBusiness', () => {
    it('should create a business with valid data', async () => {
      // Arrange
      const dto = createBusinessDtoMock();
      mockRepository.create.mockResolvedValue(businessMock);
      
      // Act
      const result = await service.createBusiness(dto);
      
      // Assert
      expect(result).toEqual(businessMock);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
    });
  });
});
5. 🎨 Código Limpio
5.1 Nomenclatura Clara
typescript// ❌ MAL
const d = new Date();
const u = await getUser();
const calc = (p: number) => p * 0.1;

// ✅ BIEN
const createdAt = new Date();
const currentUser = await getUser();
const calculateDiscount = (price: number) => price * DISCOUNT_RATE;
5.2 Funciones Pequeñas y Enfocadas
typescript// ❌ MAL: Función que hace demasiado
async function processBusinessRegistration(data: any) {
  // validación
  // creación
  // envío de email
  // logging
  // analytics
}

// ✅ BIEN: Funciones específicas
async function validateBusinessData(data: CreateBusinessDto): Promise<ValidationResult> {
  return businessValidator.validate(data);
}

async function createBusinessRecord(data: ValidatedBusinessData): Promise<Business> {
  return businessRepository.create(data);
}

async function notifyBusinessCreation(business: Business): Promise<void> {
  await Promise.all([
    emailService.sendWelcome(business.email),
    analyticsService.track('business_created', business.id)
  ]);
}
6. 🔒 Manejo de Errores
6.1 Error Classes Personalizadas
typescript// packages/utils/src/errors/index.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}
6.2 Global Error Handler
typescript// apps/api/src/common/filters/global-error.filter.ts
@Catch()
export class GlobalErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    if (exception instanceof AppError) {
      return response.status(exception.statusCode).json({
        error: {
          code: exception.code,
          message: exception.message,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Log unexpected errors
    console.error('Unexpected error:', exception);
    
    return response.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
}
7. 🚀 Performance & Optimization
7.1 Lazy Loading
typescript// Componentes pesados cargados bajo demanda
const BusinessStats = lazy(() => import('./BusinessStats'));
const MapView = lazy(() => import('./MapView'));
7.2 Memoización
typescript// Memorizar cálculos costosos
const expensiveCalculation = useMemo(() => {
  return businesses.reduce((acc, business) => {
    // cálculo complejo
  }, initialValue);
}, [businesses]);

// Memorizar componentes
const BusinessCard = memo(({ business }: Props) => {
  return <div>{/* render */}</div>;
}, (prevProps, nextProps) => {
  return prevProps.business.id === nextProps.business.id;
});
8. 📝 Documentación
8.1 JSDoc para Funciones Públicas
typescript/**
 * Validates and formats a phone number for WhatsApp
 * @param phone - The phone number to validate
 * @param countryCode - The country code (default: +57 for Colombia)
 * @returns Formatted phone number or null if invalid
 * @example
 * formatWhatsAppNumber('3001234567') // returns '+573001234567'
 */
export function formatWhatsAppNumber(
  phone: string, 
  countryCode = '+57'
): string | null {
  // implementation
}
9. 🔧 Git & Version Control
9.1 Conventional Commits
bash# Formato: <type>(<scope>): <subject>
feat(business): add WhatsApp validation
fix(search): correct typo in filter logic
docs(readme): update installation steps
refactor(auth): extract validation logic
test(business): add integration tests
chore(deps): update Next.js to 14.2.5
9.2 Branch Strategy
bashmain            # Producción
├── develop     # Development
    ├── feature/add-whatsapp-chat
    ├── fix/search-pagination
    └── refactor/business-module
10. 🛡️ Seguridad
10.1 Validación de Inputs
typescript// Siempre validar con Zod
const createBusinessSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[\d\s-()]+$/),
  category: z.enum(['hotel', 'tour', 'transport'])
});
10.2 Rate Limiting
typescript// Configurar rate limits por endpoint
@UseGuards(RateLimitGuard)
@RateLimit({ points: 10, duration: 60 }) // 10 requests per minute
@Post('validate-phone')
async validatePhone(@Body() dto: ValidatePhoneDto) {
  // implementation
}
11. 📊 Logging & Monitoring
typescript// Usar structured logging
logger.info('Business created', {
  businessId: business.id,
  userId: user.id,
  timestamp: new Date().toISOString(),
  metadata: {
    source: 'api',
    version: '1.0.0'
  }
});
12. 🎯 Code Review Checklist

 ¿El código sigue los principios SOLID?
 ¿Hay código duplicado que se pueda extraer?
 ¿Los nombres son descriptivos y claros?
 ¿Hay tests unitarios?
 ¿Se manejan todos los casos de error?
 ¿La documentación está actualizada?
 ¿Se siguieron las convenciones del proyecto?
 ¿El código es performante?
 ¿Se validaron todos los inputs?
 ¿Los logs son útiles para debugging?