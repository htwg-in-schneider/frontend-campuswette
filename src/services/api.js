const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api'

let accessTokenGetter = null

export function setAccessTokenGetter(getter) {
  accessTokenGetter = getter
}

async function getAuthHeaders() {
  if (!accessTokenGetter) {
    return {}
  }

  try {
    const token = await accessTokenGetter()

    return {
      Authorization: `Bearer ${token}`
    }
  } catch (error) {
    console.warn('Kein Auth0 Access Token verfügbar.', error)
    return {}
  }
}

async function request(path, options = {}) {
  const authHeaders = await getAuthHeaders()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers || {})
    },
    ...options
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API-Fehler: ${response.status} ${errorText}`)
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

export const userApi = {
  getProfile() {
    return request('/profile')
  },

  updateProfile(userData) {
    return request('/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
  },

  getAll() {
    return request('/admin/users')
  },

  updateByAdmin(id, userData) {
    return request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
  }
}

export const teilnahmeApi = {
  create(teilnahme) {
    return request('/teilnahmen', {
      method: 'POST',
      body: JSON.stringify(teilnahme)
    })
  },

  getAll() {
    return request('/teilnahmen')
  },

  getByUser(userId) {
    return request(`/teilnahmen/user/${userId}`)
  },

  getByQuizWette(quizWetteId) {
    return request(`/teilnahmen/quizwette/${quizWetteId}`)
  }
}