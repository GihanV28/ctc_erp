# Tracking Update Location Field Fix

## Problem
The TrackingUpdate API was returning a 500 error when creating tracking updates:
```
TrackingUpdate validation failed: location.country: Country is required, location.name: Location name is required
```

## Root Cause
The TrackingUpdate model expects `location` to be an **object** with the following structure:
```javascript
location: {
  name: String (required),
  city: String (optional),
  country: String (required),
  coordinates: { lat: Number, lng: Number } (optional)
}
```

But the frontend was sending `location` as a **concatenated string**:
```javascript
location: "Port Name, City Name, Country Name"
```

## Fix Applied

### 1. Updated Frontend Tracking Page
**File**: `apps/admin/src/app/dashboard/tracking/page.tsx`

Changed from:
```javascript
location: `${data.locationName}, ${data.locationCity}, ${data.locationCountry}`
```

To:
```javascript
location: {
  name: data.locationName,
  city: data.locationCity,
  country: data.locationCountry
}
```

### 2. Updated TypeScript Types
**File**: `apps/admin/src/services/trackingService.ts`

Updated `CreateTrackingUpdateData` interface:
```typescript
location: {
  name: string;
  city?: string;
  country: string;
}
```

Updated `TrackingUpdate` interface to support both object and string (for backwards compatibility):
```typescript
location: {
  name: string;
  city?: string;
  country: string;
} | string;
```

Updated `ActiveShipment.lastUpdate` to use object structure:
```typescript
lastUpdate?: {
  status: string;
  timestamp: Date;
  location: {
    name: string;
    city?: string;
    country: string;
  };
} | null;
```

### 3. Updated Display Logic
**File**: `apps/admin/src/app/dashboard/tracking/page.tsx`

Added logic to handle both string and object location formats:
```typescript
const locationText = typeof update.location === 'string'
  ? update.location
  : `${update.location.name}, ${update.location.city ? update.location.city + ', ' : ''}${update.location.country}`;
```

## Testing

To test the fix:
1. Restart the API server (if not already running)
2. Go to the Tracking Update page in the admin panel
3. Click "Add Update" on any shipment
4. Fill in the tracking update form:
   - Status: Select any status (e.g., "In Transit")
   - Location Name: e.g., "Port of Los Angeles"
   - Location City: e.g., "Los Angeles"
   - Location Country: e.g., "USA"
   - Description: Any description
5. Click "Add Update"
6. The update should be created successfully and the page should refresh with the new update

## Valid Tracking Statuses

The TrackingUpdate model accepts these status values:
- `order_confirmed`
- `picked_up`
- `in_transit`
- `at_origin_port`
- `departed_origin`
- `at_sea`
- `arrived_destination_port`
- `customs_clearance`
- `out_for_delivery`
- `delivered`
- `delayed`
- `exception`

Each tracking status maps to a shipment status via the post-save hook:
- `order_confirmed` → `confirmed`
- `picked_up`, `in_transit`, `at_origin_port`, `departed_origin`, `at_sea`, `delayed` → `in_transit`
- `arrived_destination_port`, `customs_clearance` → `customs`
- `out_for_delivery` → `out_for_delivery`
- `delivered` → `delivered`
- `exception` → `on_hold`

## Files Modified
1. `apps/admin/src/app/dashboard/tracking/page.tsx`
2. `apps/admin/src/services/trackingService.ts`

## Files Already Correct
1. `apps/admin/src/components/tracking/TrackingHistory.tsx` - Already expecting location object
2. `apps/admin/src/components/tracking/types.ts` - Already has correct type definitions
3. `apps/api/src/models/TrackingUpdate.js` - Model was correct all along
4. `apps/api/src/controllers/trackingController.js` - Controller was correct all along
