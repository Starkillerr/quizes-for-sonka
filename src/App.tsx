import { useState } from 'react'
import Home from './components/Home'
import Quiz from './components/Quiz'
import Results from './components/Results'
import { loadResults, saveResult, testsById } from './tests'

type View =
  | { name: 'home' }
  | { name: 'quiz'; testId: string }
  | { name: 'results'; testId: string; answers: number[] }

function App() {
  const [view, setView] = useState<View>({ name: 'home' })
  const [results, setResults] = useState(loadResults)

  const goHome = () => setView({ name: 'home' })

  if (view.name === 'quiz') {
    const test = testsById[view.testId]
    return (
      <Quiz
        key={view.testId}
        test={test}
        onExit={goHome}
        onFinish={(answers) => {
          const correct = answers.filter(
            (a, i) => a === test.questions[i].correct,
          ).length
          saveResult(test.id, { correct, total: test.questions.length })
          setResults(loadResults())
          setView({ name: 'results', testId: test.id, answers })
        }}
      />
    )
  }

  if (view.name === 'results') {
    return (
      <Results
        test={testsById[view.testId]}
        answers={view.answers}
        onHome={goHome}
        onRetry={() => setView({ name: 'quiz', testId: view.testId })}
      />
    )
  }

  return (
    <Home
      results={results}
      onStart={(testId) => setView({ name: 'quiz', testId })}
    />
  )
}

export default App
