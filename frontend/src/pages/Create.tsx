import axios from 'axios';
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom'
import { headers } from '../services/headers'

const Create = () => {
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    price: 0
  })

  const navigate = useNavigate()

  const handleChange = (e: any) => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if(!inputs.name)
    alert('Enter a valid name')

    else if(!inputs.description)
    alert('Enter a valid description')

    else if(!inputs.price)
    alert('Enter a valid price')

    await axios.post('/create-product', inputs, {headers: headers}).then(data => {
      alert(data.request.response)
      navigate('/')
    }).catch(err => {
      alert(err.response.data)
      if(err.response.status == 401){
        navigate('/login')
      }
    })
  }

  return (
    <>
      <h4>Create Product</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="nameCreate">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" placeholder="e.g. Playstation 5" onChange={handleChange} required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="descriptionCreate">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" name="description" placeholder="Enter a description" onChange={handleChange} required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="priceCreate">
          <Form.Label>Price</Form.Label>
          <Form.Control 
            type="number" 
            name="price" 
            step="0.01"
            placeholder="Enter a price" 
            onChange={handleChange} 
            required
          />
        </Form.Group>
        <Button variant="primary" type='submit'>
          Create
        </Button>
      </Form>
    </>
  )
}

export default Create