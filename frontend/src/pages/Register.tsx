import axios from 'axios';
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom'
import { headers } from '../services/headers'

const Register = () => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: ""
  })

  const navigate = useNavigate()

  const handleChange = (e: any) => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if(!inputs.name)
    alert('Enter a name')

    else if(!inputs.email)
    alert('Please enter an e-mail')

    else if(!inputs.password)
    alert('Please enter a password')

    await axios.post('/register-user', inputs, {headers: headers}).then(data => {
      alert(data.request.response)
      navigate('/login')
    }).catch(err => {
      alert(err.response.data)
    })
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="nameRegister">
          <Form.Label>Your username</Form.Label>
          <Form.Control type="text" name="name" placeholder="Choose your username" onChange={handleChange} required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="emailRegister">
          <Form.Label>Your e-mail</Form.Label>
          <Form.Control type="text" name="email" placeholder="example@example.com" onChange={handleChange} required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="passwordRegister">
          <Form.Label>Your password</Form.Label>
          <Form.Control type="password" name="password" placeholder="Choose your password" onChange={handleChange} required/>
        </Form.Group>
        <Button variant="primary" type='submit'>
          Register
        </Button>
      </Form>
      <h6>Do you have an account? <Link to="/login">Login</Link></h6>
    </>
  )
}

export default Register