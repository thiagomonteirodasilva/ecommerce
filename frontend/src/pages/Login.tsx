import axios from 'axios';
import { useState } from 'react';
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import { headers } from '../services/headers'

const Login = () => {
  const [inputs, setInputs] = useState({
    name: "",
    password: ""
  })

  const navigate = useNavigate()
  
  const handleChange = (e: any) => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if(!inputs.name)
    alert('Please enter a name')

    else if(!inputs.password)
    alert('Please enter a password')

    await axios.post('/login', inputs, {headers: headers}).then(data => {
      navigate('/')
    }).catch(err => {
      alert(err.response.data)
    })
  }
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="nameLogin">
          <Form.Label>Your username</Form.Label>
          <Form.Control type="text" name="name" placeholder="Insert your username" required onChange={handleChange}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="passwordLogin">
          <Form.Label>Your password</Form.Label>
          <Form.Control type="password" name="password" placeholder="Type your password" required onChange={handleChange}/>
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <h6>Don't you have an account? <Link to="/register">Register</Link></h6>
    </>
  )
}

export default Login