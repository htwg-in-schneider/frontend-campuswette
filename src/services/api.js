const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })

  if (!response.ok) {
    throw new Error(`API-Fehler: ${response.status}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const quizWetteApi = {
  getAll() {
    return request('/quizwetten')
  },

  getById(id) {
    return request(`/quizwetten/${id}`)
  },

  create(quizWette) {
    return request('/quizwetten', {
      method: 'POST',
      body: JSON.stringify(quizWette)
    })
  },

  update(id, quizWette) {
    return request(`/quizwetten/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quizWette)
    })
  },

  delete(id) {
    return request(`/quizwetten/${id}`, {
      method: 'DELETE'
    })
  }
}

export const professorApi = {
  getAll() {
    return request('/professors')
  },

  getById(id) {
    return request(`/professors/${id}`)
  },

  create(professor) {
    return request('/professors', {
      method: 'POST',
      body: JSON.stringify(professor)
    })
  },

  update(id, professor) {
    return request(`/professors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(professor)
    })
  },

  delete(id) {
    return request(`/professors/${id}`, {
      method: 'DELETE'
    })
  }
}