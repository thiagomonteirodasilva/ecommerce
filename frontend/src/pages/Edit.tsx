import axios from 'axios';
import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import { useNavigate, useLocation } from 'react-router-dom'
import { headers } from '../services/headers'

interface Product {
  name: string,
  description: string,
  price: number
}

const Edit = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const productId = location.pathname.split('/')[2]

  const [product, setProduct] = useState({} as any)

  const [inputs, setInputs] = useState({
    name: product.name,
    description: product.description,
    price: product.name
  })

  useEffect(() => {
    getProduct()
  }, [productId])

  const getProduct = async () => {
    await axios.get(`/product-detail/${productId}`).then((res) => {
      setProduct(res.data)
    }).catch(err => {
      console.log(err)
      if(err.response.status == 401){
        navigate('/login')
      }
    })
  }
  
  const handleChange = (e: any) => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
  }
  
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    await axios.put(`/products/${productId}`, inputs, {headers: headers}).then(data => {
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
      <h4>Edit Product</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="nameCreate">
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type="text" 
            name="name" 
            placeholder="e.g. Playstation 5" 
            defaultValue={product.name}
            onChange={handleChange} 
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="descriptionCreate">
          <Form.Label>Description</Form.Label>
          <Form.Control 
            type="text" 
            name="description" 
            defaultValue={product.description}
            placeholder="Enter a description" 
            onChange={handleChange} 
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="priceCreate">
          <Form.Label>Price</Form.Label>
          <Form.Control 
            type="number" 
            name="price" 
            defaultValue={product.price}
            step="0.01"
            placeholder="Enter a price" 
            onChange={handleChange} 
            required
          />
        </Form.Group>
        <Button variant="primary" type='submit'>
          Edit
        </Button>
      </Form>
    </>
  )
}

export default Edit