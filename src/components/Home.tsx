import { sectionTests, type TestResult } from '../tests'

type Props = {
  results: Record<string, TestResult>
  onStart: (testId: string) => void
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
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </main>
  )
}

function level(percent: number | null) {
  if (percent === null) return ''
  if (percent >= 80) return 'good'
  if (percent >= 50) return 'mid'
  return 'bad'
}

export default Home
