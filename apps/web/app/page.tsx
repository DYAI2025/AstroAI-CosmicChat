/**
 * QuizzMe Home Page
 * Landing page with links to main features.
 */

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          QuizzMe
        </h1>
        <p className="text-xl text-gray-600">
          Entdecke dein kosmisches Selbst
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl w-full mb-12">
        <a
          href="/verticals/quiz"
          className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-400"
        >
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">
            Quizzes
          </h2>
          <p className="text-gray-600">
            Beantworte Fragen und erfahre mehr über deine Persönlichkeit
          </p>
        </a>

        <a
          href="/astrosheet"
          className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-400"
        >
          <div className="text-4xl mb-4">✨</div>
          <h2 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
            AstroSheet
          </h2>
          <p className="text-gray-600">
            Dein persönliches Dashboard mit allen Ergebnissen
          </p>
        </a>
      </div>

      <p className="text-sm text-gray-400">
        KI-generiert • Keine Vorhersage • Nur zur Reflexion
      </p>
    </div>
  );
}
