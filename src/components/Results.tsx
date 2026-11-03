import type { Test } from '../tests'

type Props = {
  test: Test
  answers: number[]
  onHome: () => void
  onRetry: () => void
}

function Results({ test, answers, onHome, onRetry }: Props) {
  const total = test.questions.length
  const correct = test.questions.filter((q, i) => answers[i] === q.correct).length
  const percent = Math.round((correct / total) * 100)

  return (
    <main className="page">
      <header className="results-header">
        <h1>
          {test.sectionTitle} · Тест {test.number} завершено
        </h1>
        <p className="score">
          {correct} з {total} · <strong>{percent}%</strong>
        </p>
        <div className="results-actions">
          <button className="primary-button" onClick={onRetry}>
            Пройти ще раз
          </button>
          <button className="secondary-button" onClick={onHome}>
            На головну
          </button>
        </div>
      </header>

      <ol className="review-list">
        {test.questions.map((q, i) => {
          const isCorrect = answers[i] === q.correct
          return (
            <li key={q.n} className={`review-item ${isCorrect ? 'correct' : 'wrong'}`}>
              <div className="review-head">
                <span className="question-number">№ {q.n}</span>
                <span className={`badge ${isCorrect ? 'correct' : 'wrong'}`}>
                  {isCorrect ? '✓ правильно' : '✗ неправильно'}
                </span>
              </div>
              <p className="review-question">{q.question}</p>
              <p className="review-answer">
                <span className="muted">Ваша відповідь: </span>
                <span className={isCorrect ? 'text-correct' : 'text-wrong'}>
                  {q.options[answers[i]]}
                </span>
              </p>
              {!isCorrect && (
                <p className="review-answer">
                  <span className="muted">Правильна відповідь: </span>
                  <span className="text-correct">{q.options[q.correct]}</span>
                </p>
              )}
            </li>
          )
        })}
      </ol>
    </main>
  )
}

export default Results
