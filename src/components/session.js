import { ApiCall } from './api.js'
import { uuid } from './uuid.js'

export class Session {
    constructor() { }

    login = async (url, username, password) => {
        const data = {
            'username': username.toLowerCase(),
            'password': password
        }
        const response = await fetch(url, new ApiCall('POST', data))

        if (response.ok) {
            const content = await response.json()
            document.cookie = `token=${content.token}`

            return content.token
        } else {
            return
        }
    }

    register = async (registerUrl, username, password) => {
        const data = {
            'username': username.toLowerCase(),
            'password': password,
            'userId': uuid()
        }
        const response = await fetch(registerUrl, new ApiCall('POST', data))

        if (response.ok) {
            const content = await response.json()
            document.cookie = `token=${content.token}`

            return content.token
        } else {
            return
        }
    }
}