import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const NavbarNav = () => {

  const navigate = useNavigate()

  const [cookie, setCookie, removeCookie] = useCookies(['authToken', 'userId']);

  const handleLogout = () => {
    removeCookie('authToken')
    removeCookie('userId')
    navigate('/login')
  }

  return (
    <>
    <Navbar bg="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">E-commerce</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/create">Create Product</Nav.Link>
            <Nav.Link onClick={() => handleLogout()}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  )
}

export default NavbarNav