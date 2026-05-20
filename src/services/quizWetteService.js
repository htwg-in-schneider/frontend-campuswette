const API_BASE_URL = 'http://localhost:8081/api'

export async function fetchQuizWetten(params = {}) {
  const searchParams = new URLSearchParams()

  if (params.search) {
    searchParams.append('search', params.search)
  }

  if (params.status) {
    searchParams.append('status', params.status)
  }

  if (params.schwierigkeit) {
    searchParams.append('schwierigkeit', params.schwierigkeit)
  }
  if (params.professorId) {
    searchParams.append('professorId', params.professorId)
  }

  const queryString = searchParams.toString()

  const url = queryString
    ? `${API_BASE_URL}/quizwetten?${queryString}`
    : `${API_BASE_URL}/quizwetten`

  console.log('Lade Quiz-Wetten von:', url)

  const response = await fetch(url)

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

export async function createQuizWette(quizWette) {
  const response = await fetch(`${API_BASE_URL}/quizwetten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quizWette)
  })

  if (!response.ok) {
    throw new Error('Quiz-Wette konnte nicht erstellt werden')
  }

  return await response.json()
}

export async function updateQuizWette(id, quizWette) {
  const response = await fetch(`${API_BASE_URL}/quizwetten/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quizWette)
  })

  if (!response.ok) {
    throw new Error('Quiz-Wette konnte nicht aktualisiert werden')
  }

  return await response.json()
}

export async function deleteQuizWette(id) {
  const response = await fetch(`${API_BASE_URL}/quizwetten/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Quiz-Wette konnte nicht gelöscht werden')
  }
}

export async function fetchProfessors() {
  const response = await fetch(`${API_BASE_URL}/professors`)

  if (!response.ok) {
    throw new Error('Professoren konnten nicht geladen werden')
  }

  return await response.json()
}