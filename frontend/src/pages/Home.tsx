import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button, Card, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import NavbarNav from '../components/Navbar'
import { cookieUserId } from '../services/checkCookie'
import { headers } from '../services/headers'

const Home = () => {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    await axios.get(`/my-products/${cookieUserId}`).then((res) => {
      setProducts(res.data)
    }).catch(err => {
      console.log(err)
      if(err.response.status == 401){
        navigate('/login')
      }
    })
  }

  const deleteProduct = async (productId: any) => {
    await axios.put(`/remove-products/${productId}`, {headers: headers}).then(data => {
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
    <Container>
      <NavbarNav></NavbarNav>
      {products.map((product: any) => (
        <Card className="mb-3 mt-4" key={product.id}>
          <Card.Body>
            <Card.Title>{product.name}</Card.Title>
            <Card.Text>
              <p>{product.description}</p>
              <p><strong>Price: </strong>{product.price}</p>
              <Button 
                variant="success"
                onClick={() => navigate(`/edit/${product.id}`)}>Edit</Button>{'  '}
              <Button 
                variant="primary"
                onClick={() => navigate(`/images/${product.id}`)}>Images</Button>{'  '}
              <Button 
                variant="danger"
                onClick={() => deleteProduct(product.id)}>Delete</Button>
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </Container>
  )
}

export default Home
