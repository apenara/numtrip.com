# Supabase Data Import System

## Overview

NumTrip uses Supabase as its complete backend solution. This document explains how to import business data from Google Places API into the Supabase database.

## System Architecture

```
Google Places API → Import Script → Supabase PostgreSQL
                                ↘ Edge Functions (future)
                                ↘ Real-time Updates
```

## Import Methods

### Method 1: Direct Import Script (Recommended)

**File**: `/import-businesses-simple.ts`

This TypeScript script connects directly to Supabase and imports businesses in batches:

```bash
# Install dependencies
pnpm add -w @supabase/supabase-js tsx

# Run the import
npx tsx import-businesses-simple.ts
```

**Features:**
- ✅ Direct Supabase connection using service key
- ✅ Duplicate detection via Google Place ID
- ✅ Automatic contact creation (phone, website)
- ✅ Rate limiting (500ms between requests)
- ✅ Error handling and logging
- ✅ Progress tracking by category

### Method 2: Supabase Edge Functions

**Function**: `import-businesses-public`

Deployed as a Supabase Edge Function for remote execution:

```bash
# Call the Edge Function
curl -X POST 'https://xvauchcfkrbbpfoszlah.supabase.co/functions/v1/import-businesses-public' \
  -H 'Content-Type: application/json' \
  -d '{"category": "hotels", "limit": 50, "adminKey": "numtrip-import-2024"}'
```

## Configuration

### Environment Variables

Required in Supabase Edge Functions or local environment:

```bash
SUPABASE_URL="https://xvauchcfkrbbpfoszlah.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="sb_secret_8VPgI3gIlboHsJNaFQAh8w_96_GR-Lb"
GOOGLE_PLACES_API_KEY="AIzaSyA6dSZQqQEyTvzqjIeJv2bJ4hwCX7hCpT0"
```

### Google Places API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Places API
3. Create API Key with Places API access
4. Set API restrictions if needed

## Import Categories

The system imports businesses in these categories:

| Category | Google Query | Target Count | Business Category |
|----------|--------------|--------------|-------------------|
| Hotels | `hotels in Cartagena, Colombia` | 100 | HOTEL |
| Restaurants | `restaurants in Cartagena, Colombia` | 150 | RESTAURANT |
| Tours | `tourist attractions in Cartagena, Colombia` | 80 | TOUR |
| Transport | `transportation in Cartagena, Colombia` | 85 | TRANSPORT |
| Attractions | `tourist attractions in Cartagena, Colombia` | 85 | ATTRACTION |

**Total Target**: ~500 businesses

## Data Mapping

### Google Places → Supabase Business

| Google Places Field | Supabase Field | Notes |
|-------------------|---------------|--------|
| `place_id` | `google_place_id` | Used for duplicate detection |
| `name` | `name` | Business name |
| `formatted_address` | `address` | Full address |
| `geometry.location.lat` | `latitude` | GPS coordinates |
| `geometry.location.lng` | `longitude` | GPS coordinates |
| `types[]` | `category` | Mapped to enum values |
| `website` | `website` | Also creates WEBSITE contact |
| `formatted_phone_number` | N/A | Creates PHONE contact |

### Category Mapping Logic

```typescript
const mapToBusinessCategory = (types: string[] = []): string => {
  const typeSet = new Set(types);
  
  if (typeSet.has('lodging') || typeSet.has('rv_park')) return 'HOTEL';
  if (typeSet.has('restaurant') || typeSet.has('meal_takeaway') || 
      typeSet.has('food') || typeSet.has('bar') || typeSet.has('cafe')) return 'RESTAURANT';
  if (typeSet.has('travel_agency') || typeSet.has('tourist_attraction') || 
      typeSet.has('museum')) return 'TOUR';
  if (typeSet.has('taxi_stand') || typeSet.has('bus_station') || 
      typeSet.has('car_rental') || typeSet.has('airport')) return 'TRANSPORT';
  if (typeSet.has('park') || typeSet.has('amusement_park') || 
      typeSet.has('aquarium') || typeSet.has('zoo')) return 'ATTRACTION';
  
  return 'OTHER';
};
```

## Database Operations

### Duplicate Prevention

The system prevents duplicates using Google Place ID:

```sql
SELECT id FROM businesses 
WHERE google_place_id = $1 
LIMIT 1;
```

### City Management

Creates or reuses city records:

```sql
-- Check existing
SELECT * FROM cities WHERE name = 'Cartagena, Colombia';

-- Create if not exists
INSERT INTO cities (name, country) 
VALUES ('Cartagena, Colombia', 'Colombia')
RETURNING *;
```

### Business Creation

```sql
INSERT INTO businesses (
  name, description, category, address, city_id,
  latitude, longitude, google_place_id, website, 
  verified, claimed
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, false, false)
RETURNING *;
```

### Contact Creation

Automatically creates contacts for phone and website:

```sql
-- Phone contact
INSERT INTO contacts (business_id, type, value, verified, primary_contact)
VALUES ($1, 'PHONE', $2, false, true);

-- Website contact  
INSERT INTO contacts (business_id, type, value, verified, primary_contact)
VALUES ($1, 'WEBSITE', $2, false, false);
```

## Monitoring & Analytics

### Database Queries for Monitoring

```sql
-- Total businesses by category
SELECT category, COUNT(*) as count 
FROM businesses 
GROUP BY category 
ORDER BY count DESC;

-- Businesses with Google Place ID (imported)
SELECT COUNT(*) as imported_count
FROM businesses 
WHERE google_place_id IS NOT NULL;

-- Recent imports (last 24 hours)
SELECT name, category, created_at
FROM businesses 
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Contact statistics
SELECT type, COUNT(*) as count
FROM contacts
GROUP BY type
ORDER BY count DESC;
```

### Supabase Dashboard Access

- **URL**: https://supabase.com/dashboard/project/xvauchcfkrbbpfoszlah
- **Table Editor**: View and edit data directly
- **SQL Editor**: Run custom queries
- **Real-time**: Monitor live changes
- **Logs**: View Edge Function logs

## Rate Limiting & API Limits

### Google Places API Limits

- **Free Tier**: 1,000 requests/day
- **Paid**: $17 per 1,000 requests
- **Rate Limit**: 10 requests/second

### Import Script Rate Limiting

- **Delay**: 500ms between requests
- **Batch Size**: 20 places per search
- **Category Delay**: 2 seconds between categories

### Cost Estimation

For 500 businesses:
- Text Search: ~25 requests (20 results each)
- Place Details: ~500 requests
- **Total**: ~525 requests ≈ $9 USD

## Troubleshooting

### Common Issues

1. **"ZERO_RESULTS" from Google Places**
   - Try different search terms
   - Some categories may have limited results in specific cities

2. **Duplicate Key Errors**
   - Duplicate detection should prevent this
   - Check if Google Place ID already exists

3. **Rate Limit Exceeded**
   - Increase delay between requests
   - Reduce batch sizes

4. **Supabase Connection Errors**
   - Verify service role key
   - Check network connectivity
   - Ensure RLS policies allow service role access

### Debug Mode

Enable verbose logging:

```typescript
console.log('🔄 Processing:', place.name);
console.log('📍 Address:', place.formatted_address);
console.log('🏷️ Types:', place.types);
console.log('📞 Phone:', place.formatted_phone_number);
```

## Security Considerations

### API Key Protection

- ✅ Google Places API key stored in environment variables
- ✅ Supabase keys not exposed to client
- ✅ Edge Functions use secure environment

### Database Security

- ✅ Row Level Security (RLS) policies enabled
- ✅ Service role bypasses RLS for imports
- ✅ No user data exposed during import

### Access Control

- ✅ Import scripts require admin key
- ✅ Edge Functions have JWT verification
- ✅ Database operations use service role

## Future Enhancements

### Planned Features

1. **Multi-city Support**
   - Expand beyond Cartagena
   - Country-specific configurations

2. **Enhanced Data Validation**
   - Address geocoding verification
   - Phone number format validation
   - Website accessibility checks

3. **Automated Scheduling**
   - Cron jobs for regular updates
   - Delta imports for changed data

4. **Data Quality Metrics**
   - Completion percentage tracking
   - Contact verification rates
   - User engagement analytics

### Performance Optimizations

1. **Batch Operations**
   - Bulk insert optimizations
   - Parallel processing

2. **Caching Strategy**
   - Redis cache for frequent queries
   - CDN for static data

3. **Search Optimization**
   - Full-text search indexes
   - Geographic search improvements

## Support

### Resources

- **Supabase Docs**: https://supabase.com/docs
- **Google Places API**: https://developers.google.com/maps/documentation/places
- **Project Repository**: Private GitHub repository

### Contact

For technical issues or questions about the import system, contact the development team.