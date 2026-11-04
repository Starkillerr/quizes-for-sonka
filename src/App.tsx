import { useState } from 'react'
import Home from './components/Home'
import Quiz from './components/Quiz'
import Results from './components/Results'
import { loadResults, mistakesTest, saveResult, testsById, type Test } from './tests'

// questions — питання саме цього проходження (весь тест або лише помилки)
type Run = { testId: string; mistakes: boolean; questions: Test['questions'] }

type View =
  | { name: 'home' }
  | ({ name: 'quiz' } & Run)
  | ({ name: 'results'; answers: number[] } & Run)

function App() {
  const [view, setView] = useState<View>({ name: 'home' })
  const [results, setResults] = useState(loadResults)

  const goHome = () => setView({ name: 'home' })
  const start = (testId: string, mistakes = false) => {
    const test = testsById[testId]
    const run = mistakes ? mistakesTest(test, results[testId]) : test
    if (run) setView({ name: 'quiz', testId, mistakes, questions: run.questions })
  }

  if (view.name === 'home') {
    return <Home results={results} onStart={start} />
  }

  const fullTest = testsById[view.testId]
  const runTest = { ...fullTest, questions: view.questions }

  if (view.name === 'quiz') {
    return (
      <Quiz
        test={runTest}
        mistakes={view.mistakes}
        onExit={goHome}
        onFinish={(answers) => {
          // У режимі помилок решта питань уже правильні, тож рахуємо від усього тесту
          const wrong = runTest.questions
            .filter((q, i) => answers[i] !== q.correct)
            .map((q) => q.n)
          const total = fullTest.questions.length
          saveResult(fullTest.id, { correct: total - wrong.length, total, wrong })
          setResults(loadResults())
          setView({ ...view, name: 'results', answers })
        }}
      />
    )
  }

  return (
    <Results
      test={runTest}
      mistakes={view.mistakes}
      answers={view.answers}
      overall={results[fullTest.id]}
      canRetryMistakes={mistakesTest(fullTest, results[fullTest.id]) !== null}
      onHome={goHome}
      onRetry={() => start(view.testId)}
      onRetryMistakes={() => start(view.testId, true)}
    />
  )
}

export default App
