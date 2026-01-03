/**
 * Quiz Verticals Index Page
 *
 * This page displays the available quiz verticals/categories.
 * Currently a skeleton placeholder - actual quiz functionality
 * will be implemented when the quiz engine is ready.
 */

export default function QuizIndexPage() {
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
          Quiz Verticals
        </h1>
        <p style={{ color: '#666' }}>
          Explore different quiz categories and test your cosmic knowledge
        </p>
      </header>

      <div style={{
        display: 'grid',
        gap: '1.5rem',
        maxWidth: '800px',
        width: '100%'
      }}>
        {/* Placeholder cards for quiz verticals */}
        <div style={{
          padding: '2rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Astrology Basics
          </h2>
          <p style={{ color: '#64748b', margin: 0 }}>
            Coming soon - Learn the fundamentals of astrological concepts
          </p>
        </div>

        <div style={{
          padding: '2rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Zodiac Signs
          </h2>
          <p style={{ color: '#64748b', margin: 0 }}>
            Coming soon - Discover the characteristics of each zodiac sign
          </p>
        </div>

        <div style={{
          padding: '2rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Planetary Influences
          </h2>
          <p style={{ color: '#64748b', margin: 0 }}>
            Coming soon - Understand how planets affect your chart
          </p>
        </div>
      </div>

      <a
        href="/"
        style={{
          marginTop: '3rem',
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
