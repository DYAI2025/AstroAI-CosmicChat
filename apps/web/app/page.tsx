/**
 * QuizzMe Home Page
 *
 * This is a skeleton placeholder for the main landing page.
 * Full functionality will be implemented when features are ready.
 */

const BUILD_MODE = process.env.NEXT_PUBLIC_BUILD_MODE || 'server';

export default function HomePage() {
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
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        QuizzMe
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2rem' }}>
        Your Cosmic Learning Journey Awaits
      </p>

      <div style={{
        padding: '1rem 2rem',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#888' }}>
          Build Mode: <strong>{BUILD_MODE}</strong>
        </p>
      </div>

      <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a
          href="/verticals/quiz"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px'
          }}
        >
          Quiz Verticals
        </a>
        <a
          href="/astrosheet"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#7c3aed',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px'
          }}
        >
          AstroSheet Dashboard
        </a>
      </nav>
    </div>
  );
}
