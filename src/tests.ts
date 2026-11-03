import { sections, type Question } from './data/questions'

export type Test = {
  id: string
  sectionTitle: string
  number: number
  from: number
  to: number
  questions: Question[]
}

export type SectionTests = { id: string; title: string; tests: Test[] }

const TEST_SIZE = 50

// Тести йдуть за номерами з файлу: 1–50, 51–100, ... (останній — до кінця розділу)
export const sectionTests: SectionTests[] = sections.map((section) => {
  const lastNumber = Math.max(...section.questions.map((q) => q.n))
  const tests = Array.from(
    { length: Math.ceil(lastNumber / TEST_SIZE) },
    (_, i): Test => {
      const from = i * TEST_SIZE + 1
      const to = Math.min(from + TEST_SIZE - 1, lastNumber)
      return {
        id: `${section.id}-${i + 1}`,
        sectionTitle: section.title,
        number: i + 1,
        from,
        to,
        questions: section.questions.filter((q) => q.n >= from && q.n <= to),
      }
    },
  ).filter((test) => test.questions.length > 0)
  return { id: section.id, title: section.title, tests }
})

export const testsById: Record<string, Test> = Object.fromEntries(
  sectionTests.flatMap((s) => s.tests).map((t) => [t.id, t]),
)

export type TestResult = { correct: number; total: number }

const STORAGE_KEY = 'bio-quiz-results-v2'

export function loadResults(): Record<string, TestResult> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function saveResult(testId: string, result: TestResult) {
  const all = loadResults()
  all[testId] = result
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // localStorage недоступний — результат просто не збережеться
  }
}
