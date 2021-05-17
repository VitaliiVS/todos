import { Task } from './task'

interface authBody {
  username: string
  password: string
}

export class ApiCall {
  constructor() {}

  makeApiCall = async (
    url: string,
    method: string,
    body: authBody | Task | null,
    token?: string
  ) => {
    const response = await fetch(url, {
      method: method,
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      },
      body: body !== null ? JSON.stringify(body) : null
    })

    return response
  }
}
