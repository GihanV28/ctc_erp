# Settings Page Integration Documentation

## Overview
This document outlines the complete integration between the frontend settings page and backend API endpoints for the Ceylon Cargo Transport ERP system.

## Features Implemented

### 1. Security Settings

#### Password Change
- **Frontend**: Password change form with validation
- **Endpoint**: `PUT /api/settings/password`
- **Request Body**:
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string",
    "confirmPassword": "string"
  }
  ```
- **Validation**:
  - All fields required
  - New password minimum 6 characters
  - New password must match confirm password
  - Current password must be correct
- **Response**: Success message

#### Two-Factor Authentication Toggle
- **Frontend**: Toggle switch for 2FA
- **Endpoint**: `PUT /api/settings/2fa`
- **Request Body**:
  ```json
  {
    "enabled": boolean
  }
  ```
- **Response**:
  ```json
  {
    "twoFactorEnabled": boolean
  }
  ```
- **Note**: Generates secret when enabling for the first time

### 2. Notification Preferences

#### Get Notification Preferences
- **Frontend**: Auto-loads on page mount
- **Endpoint**: `GET /api/settings/notifications`
- **Response**:
  ```json
  {
    "notificationPreferences": {
      "emailNotifications": boolean,
      "pushNotifications": boolean,
      "smsNotifications": boolean,
      "shipmentUpdates": boolean,
      "invoiceAlerts": boolean,
      "systemUpdates": boolean,
      "newsletter": boolean
    }
  }
  ```

#### Update Notification Preferences
- **Frontend**: Auto-saves on toggle change
- **Endpoint**: `PUT /api/settings/notifications`
- **Request Body**: Same as response above
- **Behavior**: Auto-saves immediately when user toggles any notification preference

### 3. System Preferences

#### Get System Preferences
- **Frontend**: Auto-loads on page mount
- **Endpoint**: `GET /api/settings/preferences`
- **Response**:
  ```json
  {
    "systemPreferences": {
      "language": "string",
      "timezone": "string",
      "dateFormat": "string",
      "currency": "string"
    }
  }
  ```
- **Default Values**:
  - Language: "English"
  - Timezone: "Asia/Bangkok" (Indochina Time - UTC+7)
  - Date Format: "DD/MM/YYYY"
  - Currency: "USD"

#### Update System Preferences
- **Frontend**: Manual save via "Save Preferences" button
- **Endpoint**: `PUT /api/settings/preferences`
- **Request Body**: Same as response above
- **Available Options**:
  - **Languages**: English (only)
  - **Timezones**:
    - Asia/Bangkok (Indochina Time - ICT, UTC+7)
    - Asia/Kolkata (India Standard Time - IST, UTC+5:30)
  - **Date Formats**: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
  - **Currencies**: USD (only)

### 4. Data & Privacy

#### Activity Log
- **Frontend**: Modal popup showing user activity
- **Endpoint**: `GET /api/settings/activity-log`
- **Response**:
  ```json
  {
    "activityLog": {
      "lastLogin": "Date",
      "lastLoginIP": "string",
      "accountCreated": "Date",
      "lastUpdated": "Date"
    }
  }
  ```

#### Download User Data
- **Frontend**: Downloads JSON file with all user data
- **Endpoint**: `GET /api/settings/download-data`
- **Response**: Complete user data export
- **Behavior**:
  - Fetches user data from API
  - Generates JSON blob
  - Triggers browser download
  - Filename: `user-data-{timestamp}.json`

### 5. Danger Zone

#### Deactivate Account
- **Frontend**: Confirmation dialog before deactivation
- **Endpoint**: `PUT /api/settings/account/deactivate`
- **Request Body**: None
- **Effect**: Sets user status to 'inactive'
- **Behavior**:
  - Shows confirmation dialog
  - Requires explicit user confirmation
  - Redirects to login after deactivation

#### Delete Account
- **Frontend**: Password confirmation dialog
- **Endpoint**: `DELETE /api/settings/account`
- **Request Body**:
  ```json
  {
    "password": "string"
  }
  ```
- **Effect**:
  - Soft delete: Sets status to 'suspended'
  - Prefixes email with `deleted_{timestamp}_` to prevent conflicts
- **Security**: Requires password verification
- **Behavior**:
  - Shows confirmation dialog
  - Requires password input
  - Redirects to login after deletion

## Database Schema

### User Model Fields Used

```javascript
{
  notificationPreferences: {
    emailNotifications: Boolean (default: true),
    pushNotifications: Boolean (default: true),
    smsNotifications: Boolean (default: false),
    shipmentUpdates: Boolean (default: true),
    invoiceAlerts: Boolean (default: true),
    systemUpdates: Boolean (default: true),
    newsletter: Boolean (default: false),
    updatedAt: Date
  },
  systemPreferences: {
    language: String (default: 'English'),
    timezone: String (default: 'Asia/Bangkok'),
    dateFormat: String (default: 'DD/MM/YYYY'),
    currency: String (default: 'USD'),
    updatedAt: Date
  },
  twoFactorEnabled: Boolean (default: false),
  twoFactorSecret: String,
  status: String (enum: ['active', 'inactive', 'suspended']),
  lastLogin: Date,
  lastLoginIP: String,
  passwordChangedAt: Date
}
```

## API Route Structure

All settings routes are mounted at `/api/settings` and require authentication.

```
/api/settings
  ├── GET    /notifications          - Get notification preferences
  ├── PUT    /notifications          - Update notification preferences
  ├── GET    /preferences            - Get system preferences (user)
  ├── PUT    /preferences            - Update system preferences (user)
  ├── PUT    /password               - Change password
  ├── PUT    /2fa                    - Toggle two-factor authentication
  ├── GET    /activity-log           - Get activity log
  ├── GET    /download-data          - Download user data
  ├── PUT    /account/deactivate     - Deactivate account
  └── DELETE /account                - Delete account
```

## Frontend Service Layer

Location: `apps/client/src/services/settingsService.ts`

All API calls are abstracted through the `settingsService` which provides:
- Type-safe interfaces
- Error handling
- Consistent response parsing
- Centralized API communication

## Error Handling

All endpoints implement comprehensive error handling:
- **400**: Validation errors (missing fields, invalid data)
- **401**: Authentication errors (incorrect password, unauthorized)
- **403**: Permission errors (restricted operations)
- **404**: Resource not found
- **500**: Server errors

Frontend displays user-friendly error messages via browser alerts.

## Security Features

1. **Authentication**: All routes require JWT bearer token
2. **Password Verification**: Required for account deletion
3. **Password Validation**: Minimum 6 characters, match confirmation
4. **Soft Delete**: Accounts are suspended rather than deleted
5. **Email Conflict Prevention**: Deleted accounts have emails prefixed with timestamp

## Testing Checklist

- [ ] Password change with valid credentials
- [ ] Password change with invalid current password
- [ ] Password change with mismatched new passwords
- [ ] Notification preferences toggle and auto-save
- [ ] System preferences update via save button
- [ ] 2FA toggle enable
- [ ] 2FA toggle disable
- [ ] Activity log display
- [ ] User data download
- [ ] Account deactivation with confirmation
- [ ] Account deletion with correct password
- [ ] Account deletion with incorrect password

## Known Limitations

1. **2FA Implementation**: Currently simplified - generates random secret but doesn't implement full TOTP verification
2. **Activity Log**: Limited to login tracking - could be expanded to track more user actions
3. **Data Export**: JSON format only - could add CSV or other formats
4. **Profile Photo**: Managed separately through profile settings, not in main settings page

## Future Enhancements

1. Implement full TOTP-based 2FA with QR code
2. Add more granular activity logging
3. Support multiple export formats (CSV, PDF)
4. Add data retention policies
5. Implement account recovery for soft-deleted accounts
6. Add email confirmation for sensitive operations
7. Session management (view and revoke active sessions)
8. API key management for integrations
