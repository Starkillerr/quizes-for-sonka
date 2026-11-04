import { useState } from 'react'
import type { Test } from '../tests'

type Props = {
  test: Test
  mistakes: boolean
  onExit: () => void
  onFinish: (answers: number[]) => void
}

function Quiz({ test, mistakes, onExit, onFinish }: Props) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  const question = test.questions[index]
  const selected = answers[index]
  const answered = selected !== undefined
  const isLast = index === test.questions.length - 1

  const choose = (option: number) => {
    if (answered) return
    const next = [...answers]
    next[index] = option
    setAnswers(next)
  }

  const goNext = () => {
    if (isLast) onFinish(answers)
    else setIndex(index + 1)
  }

  return (
    <main className="page">
      <div className="quiz-top">
        <button className="link-button" onClick={onExit}>
          ← На головну
        </button>
        <span className="muted">
          {test.sectionTitle} · Тест {test.number}
          {mistakes && ' · помилки'} · {index + 1} / {test.questions.length}
        </span>
      </div>
      <div className="progress thin">
        <div
          className="progress-fill"
          style={{ width: `${(index / test.questions.length) * 100}%` }}
        />
      </div>

      <section className="question-card">
        <span className="question-number">№ {question.n}</span>
        <h2 className="question-text">{question.question}</h2>

        <div className="options">
          {question.options.map((option, i) => {
            let state = ''
            if (answered) {
              if (i === question.correct) state = 'correct'
              else if (i === selected) state = 'wrong'
              else state = 'dim'
            }
            return (
              <button
                key={i}
                className={`option ${state}`}
                onClick={() => choose(i)}
                disabled={answered}
              >
                <span className="option-letter">{i + 1}</span>
                <span>{option}</span>
              </button>
            )
          })}
        </div>

        {answered && (
          <div className="feedback-row">
            <span
              className={`feedback ${selected === question.correct ? 'correct' : 'wrong'}`}
            >
              {selected === question.correct ? 'Правильно!' : 'Неправильно'}
            </span>
            <button className="primary-button" onClick={goNext}>
              {isLast ? 'Завершити' : 'Далі →'}
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default Quiz
