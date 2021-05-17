import React, { useState } from 'react'
import { Session } from './session'
import { debounce } from '../common/helpers'
import { loginUrl, registerUrl } from '../common/config'

const session = new Session()

interface LoginProps {
  onTokenChange: (token: string) => void
}

const LoginForm = (props: LoginProps): JSX.Element => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (): Promise<void> => {
    const { onTokenChange } = props

    try {
      const login = await session.login(loginUrl, username, password)
      onTokenChange(login)
    } catch (e) {
      alert(e.message)
    }
  }

  const handleRegister = async (): Promise<void> => {
    const { onTokenChange } = props

    try {
      const register = await session.register(registerUrl, username, password)
      onTokenChange(register)
    } catch (e) {
      alert(e.message)
    }
  }

  const handleUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPassword(e.target.value)
  }

  const handleKeyUp = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleLoginDebounced()
    }
  }

  const handleLoginDebounced = debounce(handleLogin, 200)
  const handleRegisterDebounced = debounce(handleRegister, 200)
  const disabled = username.trim().length === 0 || password.trim().length === 0

  return (
    <div>
      <h1 className="header">Login or Register</h1>
      <div className="login-container">
        <input
          value={username}
          onChange={handleUsernameChange}
          onKeyUp={handleKeyUp}
          className="name-input"
          type="text"
          placeholder="Username"
        />
        <input
          value={password}
          onChange={handlePasswordChange}
          onKeyUp={handleKeyUp}
          className="pass-input"
          type="password"
          placeholder="Password"
        />
        <button
          onClick={handleLoginDebounced}
          className="login-button"
          disabled={disabled}
        >
          Login
        </button>
        <button
          onClick={handleRegisterDebounced}
          className="register-button"
          disabled={disabled}
        >
          Register
        </button>
      </div>
    </div>
  )
}

export default LoginForm
