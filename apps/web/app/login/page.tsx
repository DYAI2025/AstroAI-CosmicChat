/**
 * Login Page (Server Mode Only)
 *
 * This page is a placeholder for the authentication flow.
 * It is only available in server deployment mode.
 * In static export mode, this page will be rendered but
 * authentication functionality will not be available.
 */

const BUILD_MODE = process.env.NEXT_PUBLIC_BUILD_MODE || 'server';
const isStaticMode = BUILD_MODE === 'static';

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Login
      </h1>

      {isStaticMode ? (
        <div style={{
          padding: '2rem',
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          maxWidth: '400px'
        }}>
          <p style={{ margin: 0, color: '#92400e' }}>
            Authentication is not available in static export mode.
            Please use the server deployment for full functionality.
          </p>
        </div>
      ) : (
        <div style={{
          padding: '2rem',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          maxWidth: '400px'
        }}>
          <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
            Authentication functionality will be implemented here.
          </p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#888' }}>
            Server mode detected - auth features available when implemented.
          </p>
        </div>
      )}

      <a
        href="/"
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#6b7280',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px'
        }}
      >
        Back to Home
      </a>
    </div>
  );
}
