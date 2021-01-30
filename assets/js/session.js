import { ApiCall } from './api.js'

export class Session {
    constructor() { }

    login = async (url, username, password) => {
        const data = {
            "username": username,
            "password": password
        }
        const response = await fetch(url, new ApiCall('POST', data))

        if (response.ok) {
            const content = await response.json()
            document.cookie = `token=${content.token}`
            return true
        } else {
            return
        }
    }

    register = async (registerUrl, username, password) => {
        const data = {
            "username": username,
            "password": password
        }
        const response = await fetch(registerUrl, new ApiCall('POST', data))

        if (response.ok) {
            const content = await response.json()
            document.cookie = `token=${content.token}`
            return true
        } else {
            return 
        }
    }
}