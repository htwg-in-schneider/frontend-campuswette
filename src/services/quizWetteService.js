const API_BASE_URL = 'http://localhost:8081/api'

export async function fetchQuizWetten() {
  const response = await fetch(`${API_BASE_URL}/quizwetten`)

  if (!response.ok) {
    throw new Error('Quiz-Wetten konnten nicht geladen werden')
  }

  return await response.json()
}

export async function fetchQuizWetteById(id) {
  const response = await fetch(`${API_BASE_URL}/quizwetten/${id}`)

  if (!response.ok) {
    throw new Error('Quiz-Wette konnte nicht geladen werden')
  }

  return await response.json()
}