# Data Import System - Google Places Integration

## Overview

The Data Import System integrates with Google Places API to import real business data into NumTrip. This system supports batch processing, duplicate detection, and various business categories.

## Configuration

### 1. Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Places API
4. Create API credentials (API Key)
5. Add the API key to your `.env` file:

```bash
GOOGLE_PLACES_API_KEY="your-actual-api-key-here"
```

### 2. Rate Limits

Google Places API has the following limits:
- Free tier: 1,000 requests/day
- Standard pricing: $17 per 1,000 requests
- Rate limit: 10 requests/second

## Usage

### Option 1: Using the Import Script (Recommended)

The easiest way to import businesses is using the built-in script:

```bash
# Import all categories (100 businesses total, 20 per category)
cd apps/api
pnpm run script:import-cartagena

# Import specific category with custom limit
CATEGORY=hotels LIMIT=50 pnpm run script:import-cartagena

# Import restaurants only
CATEGORY=restaurants LIMIT=30 pnpm run script:import-cartagena
```

**Available Categories:**
- `hotels` - Hotels and accommodations
- `restaurants` - Restaurants and food places
- `tours` - Tour operators and tourist services
- `transport` - Transportation services
- `attractions` - Tourist attractions and museums
- `all` - All categories (default)

### Option 2: Using the API Endpoints

You can also use the REST API endpoints for more control:

```bash
# Get current import statistics
curl http://localhost:3001/api/v1/data-import/stats

# Import businesses (requires authentication)
curl -X POST http://localhost:3001/api/v1/data-import/businesses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "city": "Cartagena, Colombia",
    "category": "hotels",
    "limit": 50,
    "skipDuplicates": false
  }'
```

## Features

### 1. Duplicate Detection

The system automatically detects duplicates using:
- **Google Place ID** (most reliable - 100% confidence)
- **Name similarity** with address verification (80%+ confidence)
- **Levenshtein distance** algorithm for string matching

### 2. Data Mapping

Google Places data is automatically mapped to NumTrip format:

| Google Places Field | NumTrip Field | Notes |
|-------------------|---------------|-------|
| `place_id` | `googlePlaceId` | Used for duplicate detection |
| `name` | `name` | Business name |
| `formatted_address` | `address` | Full address |
| `geometry.location` | `latitude`, `longitude` | GPS coordinates |
| `types[]` | `category` | Mapped to our category enum |
| `formatted_phone_number` | `phone` | Cleaned and normalized |
| `website` | `website` | Website URL |

### 3. Category Mapping

Google Place types are intelligently mapped to our categories:

- **HOTEL**: `lodging`, `rv_park`
- **RESTAURANT**: `restaurant`, `meal_takeaway`, `food`, `bar`, `cafe`
- **TOUR**: `travel_agency`, `tourist_attraction`, `museum`
- **TRANSPORT**: `taxi_stand`, `bus_station`, `car_rental`, `airport`
- **ATTRACTION**: `park`, `amusement_park`, `aquarium`, `zoo`
- **OTHER**: Everything else

### 4. Data Quality

The system ensures high data quality by:
- ✅ Validating required fields (name, place_id)
- ✅ Normalizing phone numbers (removing formatting)
- ✅ Setting appropriate defaults for missing data
- ✅ Logging all operations for debugging
- ✅ Rate limiting to respect Google's API limits

## Example Import Results

```json
{
  "success": true,
  "imported": 45,
  "duplicates": 5,
  "errors": 0,
  "details": {
    "created": ["business-id-1", "business-id-2", "..."],
    "duplicateIds": ["existing-business-id-1", "..."],
    "errorMessages": []
  }
}
```

## Monitoring and Statistics

Check import statistics anytime:

```bash
curl http://localhost:3001/api/v1/data-import/stats
```

Response:
```json
{
  "totalBusinesses": 1250,
  "businessesByCategory": {
    "HOTEL": 300,
    "RESTAURANT": 450,
    "TOUR": 200,
    "TRANSPORT": 150,
    "ATTRACTION": 150
  },
  "businessesByCity": {
    "Cartagena, Colombia": 1250
  },
  "verifiedBusinesses": 50,
  "withGooglePlaceId": 1200
}
```

## Troubleshooting

### Common Issues

1. **"Google Places API key not configured"**
   - Make sure `GOOGLE_PLACES_API_KEY` is set in your .env file
   - Verify the API key is valid and Places API is enabled

2. **Rate Limit Exceeded**
   - The system includes automatic rate limiting
   - Reduce the batch size using the `LIMIT` environment variable
   - Wait for the daily quota to reset

3. **No Results Found**
   - Try different search terms
   - Check if the city name is correctly spelled
   - Some locations may have limited business data

4. **Database Connection Errors**
   - Ensure PostgreSQL is running: `docker-compose up -d`
   - Check DATABASE_URL in your .env file
   - Run database migrations: `pnpm prisma migrate dev`

### Debug Mode

Enable verbose logging by setting the LOG_LEVEL:

```bash
LOG_LEVEL=debug CATEGORY=hotels pnpm run script:import-cartagena
```

## Best Practices

1. **Start Small**: Test with `LIMIT=10` first
2. **Monitor Quotas**: Keep track of your Google API usage
3. **Regular Imports**: Run imports periodically to keep data fresh
4. **Quality Check**: Review imported data for accuracy
5. **Backup**: Always backup your database before large imports

## API Documentation

The import endpoints are documented in Swagger:
- Start the API: `pnpm run dev`
- Visit: http://localhost:3001/api/docs
- Look for the "Data Import" section

## Next Steps

After importing data:

1. **Verify Data Quality**: Review imported businesses in the database
2. **Test Search**: Verify search functionality works with real data
3. **Update Frontend**: Ensure the web app displays imported businesses correctly
4. **Monitor Performance**: Check if search performance is acceptable with larger datasets
5. **Plan Expansion**: Consider importing other cities or countries