import { ApiCall } from './api.js'
import { Task } from './task.js'
import { uuid } from './uuid.js'

export class Store {
    constructor() {
        this.tasks = []
    }

    getData = async (url, token) => {
        const response = await fetch(url, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })

        if (response.ok) {
            const content = await response.json()
            this.tasks = content
            this.tasks.forEach(x => x.editView = false)

            return this.tasks
        } else if (response.status === 401) {
            return 'Not authorized'
        } else {
            throw Error(response.status)
        }
    }

    postData = async (taskTitle, url, token) => {
        const taskId = uuid()
        const task = new Task(taskId, taskTitle)
        const response = await fetch(url, new ApiCall('POST', task, token))

        if (response.ok) {
            const content = await response.json()
            this.tasks = content
            this.tasks.forEach(x => x.editView = false)
            return this.tasks
        } else if (response.status === 401) {
            return 'Not authorized'
        } else {
            throw Error(response.status)
        }
    }

    putData = async (url, id, token, action, taskTitle) => {
        const data = {}

        if (action === 'delete-button') {
            const task = this.deleteTask(id)
            data.task = task.task
            data._id = task._id
        } else if (action === 'comp-button') {
            const task = this.completeTask(id)
            data.task = task.task
            data._id = task._id
        } else if (action === 'edit-button') {
            const tasks = this.editTask(id)

            return tasks
        } else if (action === 'save-button' || action === 'edit-view') {
            const task = this.editTask(id, taskTitle)
            data.task = task.task
            data._id = task._id
        } else if (action === 'cancel') {
            const tasks = this.cancelEdit()

            return tasks
        }

        const response = await fetch(`${url}/${data._id}`, new ApiCall('PUT', data.task, token))

        if (response.ok) {
            const content = await response.json()
            this.tasks = content
            this.tasks.forEach(x => x.editView = false)

            return this.tasks
        } else if (response.status === 401) {
            return 'Not authorized'
        } else {
            throw Error(response.status)
        }
    }

    deleteTask = (id) => {
        const data = {}
        const taskId = this.tasks.findIndex(x => x.taskId === id)

        data.task = this.tasks[taskId]
        data._id = data.task._id
        data.task.isDeleted = true
        delete data.task.editView
        delete data.task._id

        return data
    }

    completeTask = (id) => {
        const data = {}
        const taskId = this.tasks.findIndex(x => x.taskId === id)

        data.task = this.tasks[taskId]
        data._id = data.task._id
        delete data.task.editView
        delete data.task._id

        if (data.task.isCompleted == true) {
            data.task.isCompleted = false
            return data
        }
        else if (data.task.isCompleted == false) {
            data.task.isCompleted = true
            return data
        }
    }

    editTask = (id, taskTitle) => {
        const data = {}
        const taskId = this.tasks.findIndex(x => x.taskId === id)

        data.task = this.tasks[taskId]
        data._id = data.task._id

        if (data.task.editView == false) {
            this.tasks.forEach(task => task.editView = false)
            data.task.editView = true

            return this.tasks
        } else if (data.task.editView == true) {
            delete data.task.editView
            delete data.task._id
            data.task.taskLabel = taskTitle

            return data
        }
    }

    cancelEdit = () => {
        this.tasks.forEach(task => task.editView = false)

        return this.tasks
    }
}