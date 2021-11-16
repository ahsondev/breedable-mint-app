import React from 'react'
import { useState } from 'react'
import './Login.scoped.scss'

const Login = () => {
  const [login, setLogin] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e: any) => {
    setLogin(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e: any) => {
  }
  
  return (
    <div className='login-page'>
      <form className='login-form' onSubmit={handleSubmit} autoComplete="off">
        <h1>Admin Login to Brain Dance</h1>
        <div className="content">
          <div className="d-flex w-100">
            <input type="email" className="w-50" name='email' value={login.email} onChange={handleChange} required placeholder="Email" />
            <input type="password" className="w-50" name='password' value={login.password} onChange={handleChange} required placeholder="Password" />
          </div>
          <div className="d-flex w-100">
            <button type='submit'>Sign In</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login
