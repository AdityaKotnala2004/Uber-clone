import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'



const UserSignup = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ userData, setUserData ] = useState({})
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const navigate = useNavigate()



  const { user, setUser } = useContext(UserDataContext)




  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')

    if (!firstName || firstName.trim().length < 3) {
      setError('First name must be at least 3 characters long')
      return
    }
    if (!lastName || lastName.trim().length < 3) {
      setError('Last name must be at least 3 characters long')
      return
    }
    if (!email) {
      setError('Email is required')
      return
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password
    }

    try {
      setLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)
      if (response.status === 201) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }
      setEmail('')
      setFirstName('')
      setLastName('')
      setPassword('')
    } catch (err) {
      const backendErrors = err?.response?.data?.errors
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        setError(backendErrors[0]?.msg || 'Validation error')
      } else if (typeof err?.response?.data?.message === 'string') {
        setError(err.response.data.message)
      } else if (typeof err?.message === 'string') {
        setError(err.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }

  }
  return (
    <div>
      <div className='p-7 h-screen flex flex-col justify-between'>
        <div>
          <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />

          <form onSubmit={(e) => {
            submitHandler(e)
          }}>

            {error && (
              <div className='bg-red-100 text-red-700 border border-red-300 rounded-md px-3 py-2 mb-4 text-sm'>
                {error}
              </div>
            )}

            <h3 className='text-lg w-1/2  font-medium mb-2'>What's your name</h3>
            <div className='flex gap-4 mb-7'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='First name'
                value={firstName}
                minLength={3}
                onChange={(e) => {
                  setFirstName(e.target.value)
                }}
              />
              <input
                required
                className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='Last name'
                value={lastName}
                minLength={3}
                onChange={(e) => {
                  setLastName(e.target.value)
                }}
              />  
            </div>

            <h3 className='text-lg font-medium mb-2'>What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              type="email"
              placeholder='email@example.com'
            />

            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

            <input
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              required type="password"
              minLength={6}
              placeholder='password'
            />

            <button
              disabled={loading}
              className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base disabled:opacity-60 disabled:cursor-not-allowed'
            >Create account</button>

          </form>
          <p className='text-center'>Already have a account? <Link to='/login' className='text-blue-600'>Login here</Link></p>
        </div>
        <div>
          <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
            Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
        </div>
      </div>
    </div >
  )
}

export default UserSignup