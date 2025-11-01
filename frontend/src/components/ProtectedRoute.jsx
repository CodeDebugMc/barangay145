import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requiredRoles = null, 
  requiredPermission = null,
  fallbackPath = '/login' 
}) => {
  const { user, hasRole, hasPermission, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#0D4715'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  if (requiredRoles && !hasRole(requiredRoles)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '2rem',
          borderRadius: '12px',
          maxWidth: '500px',
          border: '1px solid #fcc'
        }}>
          <h2 style={{ margin: '0 0 1rem 0', color: '#c33' }}>
            Access Denied
          </h2>
          <p style={{ margin: '0 0 1rem 0' }}>
            You don't have permission to access this page.
          </p>
          <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>
            Required role: {Array.isArray(requiredRoles) ? requiredRoles.join(' or ') : requiredRoles}
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              marginTop: '1rem',
              backgroundColor: '#0D4715',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '2rem',
          borderRadius: '12px',
          maxWidth: '500px',
          border: '1px solid #fcc'
        }}>
          <h2 style={{ margin: '0 0 1rem 0', color: '#c33' }}>
            Permission Denied
          </h2>
          <p style={{ margin: '0 0 1rem 0' }}>
            You don't have the required permission to access this page.
          </p>
          <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>
            Required permission: {requiredPermission}
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              marginTop: '1rem',
              backgroundColor: '#0D4715',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
