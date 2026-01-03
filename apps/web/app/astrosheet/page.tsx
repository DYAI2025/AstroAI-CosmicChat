/**
 * AstroSheet Dashboard Page
 *
 * This page displays the user's personalized AstroSheet - their
 * cosmic character profile based on quiz results and birth chart data.
 * Currently a skeleton placeholder.
 */

const BUILD_MODE = process.env.NEXT_PUBLIC_BUILD_MODE || 'server';

export default function AstroSheetPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          AstroSheet Dashboard
        </h1>
        <p style={{ color: '#666' }}>
          Your personalized cosmic character profile
        </p>
      </header>

      <div style={{
        display: 'grid',
        gap: '1.5rem',
        maxWidth: '900px',
        width: '100%'
      }}>
        {/* Placeholder sections for AstroSheet */}
        <section style={{
          padding: '2rem',
          backgroundColor: '#faf5ff',
          border: '1px solid #e9d5ff',
          borderRadius: '12px'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#7c3aed' }}>
            Sigil Portrait
          </h2>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Your unique cosmic sigil will appear here once your profile is complete.
          </p>
        </section>

        <section style={{
          padding: '2rem',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '12px'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0284c7' }}>
            Identity Badges
          </h2>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Earned badges and achievements will be displayed here.
          </p>
        </section>

        <section style={{
          padding: '2rem',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#16a34a' }}>
            Quiz Progress
          </h2>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Your quiz completion stats and learning journey.
          </p>
        </section>

        <section style={{
          padding: '2rem',
          backgroundColor: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '12px'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#d97706' }}>
            Daily Quest
          </h2>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Your daily cosmic challenge awaits.
          </p>
        </section>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px'
      }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#888' }}>
          Build Mode: <strong>{BUILD_MODE}</strong>
        </p>
      </div>

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
