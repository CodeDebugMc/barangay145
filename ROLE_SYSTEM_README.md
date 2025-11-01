# Role-Based Access Control System

This document describes the role-based access control (RBAC) system implemented for the Barangay 145 Management System.

## Overview

The system implements three distinct user roles with different levels of access and permissions:

### Roles

1. **Admin** - Full system access
2. **Chairman** - Limited administrative access
3. **Staff** - Basic operational access

## User Roles and Permissions

### Admin Role
- **Full system access**
- Can manage all users (create, edit, delete)
- Can manage residents
- Can manage certificates
- Can view reports
- Can manage system settings
- Can approve certificates
- Can delete data

### Chairman Role
- **Limited administrative access**
- Can manage residents
- Can manage certificates
- Can view reports
- Can approve certificates
- **Cannot** manage users
- **Cannot** manage system settings
- **Cannot** delete data

### Staff Role
- **Basic operational access**
- Can manage residents
- Can manage certificates
- Can view reports
- **Cannot** manage users
- **Cannot** approve certificates
- **Cannot** manage system settings
- **Cannot** delete data

## Database Schema

The user table structure:

```sql
CREATE TABLE `users` (
 `user_id` int(11) NOT NULL AUTO_INCREMENT,
 `username` varchar(50) NOT NULL,
 `name` varchar(255) NOT NULL,
 `password` varchar(255) NOT NULL,
 `role` enum('admin','staff','chairman') DEFAULT 'staff',
 `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
 PRIMARY KEY (`user_id`),
 UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
```

## Default Login Credentials

After running the database setup script, you can use these default credentials:

| Username | Password    | Role        | Access Level |
|----------|-------------|-------------|--------------|
| admin    | admin123    | admin       | Full Access  |
| chairman | chairman123 | chairman    | Limited      |
| staff    | staff123    | staff       | Basic        |

## Setup Instructions

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Database Setup

Run the database setup script to create the users table and default users:

```bash
cd backend
node setup-db.js
```

### 3. Start the Application

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Security Features

### Password Hashing
- All passwords are hashed using bcryptjs before storage
- Salt rounds: 10

### Authentication
- JWT-based authentication (can be implemented)
- Session management through localStorage
- Automatic logout on token expiration

### Authorization
- Role-based route protection
- Permission-based component rendering
- API endpoint protection

## File Structure

```
frontend/src/
├── contexts/
│   └── AuthContext.jsx          # Authentication context
├── components/
│   ├── ProtectedRoute.jsx       # Route protection wrapper
│   ├── Dashboard.jsx            # Role-based dashboard
│   ├── UserManagement.jsx       # User management (admin only)
│   └── Login.jsx                # Updated login component
└── App.jsx                      # Main app with role-based navigation

backend/
├── server.js                    # Updated with auth middleware
├── setup-db.js                  # Database setup script
└── package.json                 # Updated with bcryptjs dependency
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login

### User Management (Admin only)
- `GET /users` - Get all users
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Usage Examples

### Checking User Role
```javascript
const { user, hasRole } = useAuth();

if (hasRole('admin')) {
  // Show admin-only content
}
```

### Checking Permissions
```javascript
const { hasPermission } = useAuth();

if (hasPermission('manage_users')) {
  // Show user management features
}
```

### Protected Routes
```javascript
<Route 
  path="/admin-only" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminComponent />
    </ProtectedRoute>
  } 
/>
```

## Customization

### Adding New Roles
1. Update the database enum: `ALTER TABLE users MODIFY role ENUM('admin','staff','chairman','newrole')`
2. Add role permissions in `AuthContext.jsx`
3. Update role-based navigation in `App.jsx`

### Adding New Permissions
1. Add permission to role permissions object in `AuthContext.jsx`
2. Use `hasPermission('new_permission')` in components
3. Add permission checks to API endpoints

## Security Considerations

1. **Change default passwords** immediately after setup
2. **Implement proper session management** for production
3. **Add rate limiting** to prevent brute force attacks
4. **Use HTTPS** in production
5. **Regular security audits** of user permissions
6. **Log all administrative actions** for audit trails

## Troubleshooting

### Common Issues

1. **Login not working**: Check if bcryptjs is installed and database is set up
2. **Permission denied**: Verify user role and permissions in database
3. **Database connection**: Ensure MySQL is running and credentials are correct

### Debug Mode

Enable debug logging by setting `console.log` statements in:
- `AuthContext.jsx` for authentication flow
- `ProtectedRoute.jsx` for route protection
- Backend middleware for API authentication

## Future Enhancements

1. **JWT Token Authentication** for better security
2. **Role Hierarchy** system
3. **Permission Groups** for easier management
4. **Audit Logging** for all user actions
5. **Two-Factor Authentication** for admin accounts
6. **Password Policy Enforcement**
7. **Account Lockout** after failed attempts
