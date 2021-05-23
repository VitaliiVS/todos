import React, { useContext, useEffect, useState } from 'react'
import TaskCard from './TaskCard/TaskCard'
import TasksContext, { Context } from './TasksContext'
import { Task } from '../common/task'
import { debounce } from '../common/helpers'

interface TasksFormProps {
  token: string
  onTokenChange: (token: string) => void
}

const TasksForm = (props: TasksFormProps): JSX.Element => {
  const [taskTitle, setTaskTitle] = useState('')
  const [disabled, setDisabled] = useState(true)
  const { tasks, getTasks, postTask } = useContext(TasksContext) as Context

  useEffect(() => {
    const fetch = async () => {
      try {
        await getTasks(props.token)
      } catch (e) {
        if (e.message === 'Unauthorized') {
          alert(e)
          handleLogout()
        } else {
          alert(e)
        }
      }
    }
    fetch()
  }, [])

  const handleLogout = () => {
    const { onTokenChange } = props
    const token = ''
    document.cookie = 'token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT'
    onTokenChange(token)
  }

  const handleAddTask = async (): Promise<void> => {
    const { token } = props

    if (taskTitle.trim() !== '') {
      try {
        await postTask(taskTitle, token)
        setTaskTitle('')
        setDisabled(true)
      } catch (e) {
        if (e.message === 'Unauthorized') {
          alert(e)
          handleLogout()
        } else {
          alert(e)
        }
      }
    }
  }

  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value)
    setDisabled(taskTitle.trim().length === 0)
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTaskDebounced()
    }
  }

  const handleAddTaskDebounced = debounce(handleAddTask, 200)

  return (
    <div>
      <h1 className="header">Tasks</h1>
      <button onClick={handleLogout} className={'logout-button button'}>
        Log out
      </button>
      <div className="container">
        <input
          value={taskTitle}
          onChange={handleTaskNameChange}
          onKeyUp={handleKeyUp}
          className="task-input"
          placeholder="What you want to do?"
        />
        <button
          onClick={handleAddTaskDebounced}
          className="create-button far fa-plus-square button"
          disabled={disabled}
        />
        <ul className="tasks-list">
          {tasks.map((task: Task) => (
            <TaskCard
              token={props.token}
              onLogout={handleLogout}
              isCompleted={task.isCompleted}
              key={task.taskId}
              taskId={task.taskId}
              taskTitle={task.taskLabel}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TasksForm
