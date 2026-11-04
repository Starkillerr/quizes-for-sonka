import type { Test, TestResult } from '../tests'

type Props = {
  test: Test
  mistakes: boolean
  answers: number[]
  overall?: TestResult
  canRetryMistakes: boolean
  onHome: () => void
  onRetry: () => void
  onRetryMistakes: () => void
}

function Results({
  test,
  mistakes,
  answers,
  overall,
  canRetryMistakes,
  onHome,
  onRetry,
  onRetryMistakes,
}: Props) {
  const total = test.questions.length
  const correct = test.questions.filter((q, i) => answers[i] === q.correct).length
  const percent = Math.round((correct / total) * 100)
  const mistakesLeft = overall?.wrong?.length ?? 0

  return (
    <main className="page">
      <header className="results-header">
        <h1>
          {test.sectionTitle} · Тест {test.number}
          {mistakes ? ' · помилки виправлено' : ' завершено'}
        </h1>
        <p className="score">
          {correct} з {total} · <strong>{percent}%</strong>
        </p>
        {mistakes && overall && (
          <p className="muted">
            Весь тест: {overall.correct} з {overall.total} ·{' '}
            {Math.round((overall.correct / overall.total) * 100)}%
          </p>
        )}
        <div className="results-actions">
          {canRetryMistakes && (
            <button className="primary-button" onClick={onRetryMistakes}>
              Перепройти неправильні ({mistakesLeft})
            </button>
          )}
          <button
            className={canRetryMistakes ? 'secondary-button' : 'primary-button'}
            onClick={onRetry}
          >
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
