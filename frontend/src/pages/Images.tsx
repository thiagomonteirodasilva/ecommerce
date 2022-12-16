import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { fileUploadHeaders } from '../services/headers'

const Images = () => {
  const [files, setFile] = useState([]);
  const location = useLocation()

  const saveFile = (e: any) => {
    setFile(e.target.files);
  };

  const productId = location.pathname.split('/')[2]

  const uploadFile = async (e: any) => {
    e.preventDefault()
    const formData = new FormData();
    
    Object.values(files).forEach(file => {
      formData.append("uploadImages", file);
    })
    
    await axios.post(`/upload/${productId}`, formData, { headers: fileUploadHeaders }).then(res => {
      alert(res.data)
    }).catch(err => {
      console.log(err)
      if(err.response.status == 401){
        navigate('/login')
      }
    })
  };

  //uploaded files
  const [images, setImages] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    await axios.get(`/get-images/${productId}`).then((res) => {
      setImages(res.data)
    }).catch(err => {
      console.log(err)
      if(err.response.status == 401){
        navigate('/login')
      }
    })
  }
  
  return (
    <>
    <h4>Upload one or more images</h4>
    <Form onSubmit={uploadFile} className="mb-3">
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Choose an image</Form.Label>
        <Form.Control 
          type="file" 
          multiple 
          onChange={saveFile} 
          accept=".png,.jpg,.jpeg"
        />
      </Form.Group>
      <Button variant="primary" type='submit'>
        Upload
      </Button>
    </Form>
    {images.map((img: any) => {
      const urlImg = img.filename.split('uploads')
      return <img src={'http://localhost:8800/' + urlImg[1]} key={img.id}></img>
    })}
    </>
  )
}

export default Images