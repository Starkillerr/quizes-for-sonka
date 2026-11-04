import { mistakesTest, sectionTests, type TestResult } from '../tests'

type Props = {
  results: Record<string, TestResult>
  onStart: (testId: string, mistakes?: boolean) => void
}

function Home({ results, onStart }: Props) {
  return (
    <main className="page">
      <header className="page-header">
        <h1>Тести з біології спеціально для Софійки</h1>
        <p className="muted">Оберіть тест, щоб почати</p>
      </header>

      {sectionTests.map((section) => (
        <section key={section.id} className="section">
          <h2 className="section-title">{section.title}</h2>
          <ul className="test-list">
            {section.tests.map((test) => {
              const result = results[test.id]
              const percent = result
                ? Math.round((result.correct / result.total) * 100)
                : null
              const mistakes = mistakesTest(test, result)
              return (
                <li key={test.id}>
                  <button className="test-card" onClick={() => onStart(test.id)}>
                    <div className="test-card-top">
                      <span className="test-title">Тест {test.number}</span>
                      <span className="muted">
                        Питання {test.from}–{test.to} · {test.questions.length} шт.
                      </span>
                    </div>
                    <div className="progress-row">
                      <div className="progress">
                        <div
                          className={`progress-fill ${level(percent)}`}
                          style={{ width: `${percent ?? 0}%` }}
                        />
                      </div>
                      <span className="progress-label">
                        {percent === null ? 'не пройдено' : `${percent}%`}
                      </span>
                    </div>
                  </button>
                  {mistakes && (
                    <button
                      className="mistakes-link"
                      onClick={() => onStart(test.id, true)}
                    >
                      ↳ Перепройти неправильні · {mistakes.questions.length}{' '}
                      {questionsWord(mistakes.questions.length)}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </main>
  )
}

function questionsWord(n: number) {
  const last = n % 10
  const teen = n % 100 >= 11 && n % 100 <= 14
  return !teen && last >= 1 && last <= 4 ? 'питання' : 'питань'
}

function level(percent: number | null) {
  if (percent === null) return ''
  if (percent >= 80) return 'good'
  if (percent >= 50) return 'mid'
  return 'bad'
}

export default Home
