import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router';
import { useMutation } from 'react-query';
import { API } from '../config/api';
import '../style/AddProduct.css';
import DumbMerch from '../assets/DumbMerch.png'
import Vector from '../assets/Vector.png'
import imgBlank from '../assets/blank-profile.png';
import { faEnvelope, faBook, faMessage, faRightFromBracket, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Dropdown } from 'react-bootstrap';
import { UserContext } from '../context/userContext'

function AddProductAdmin() {
  
  const title = 'Product Admin';
  document.title = 'DumbMerch | ' + title;

  let navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext)

  const [categories, setCategories] = useState([]); 
  const [categoryId, setCategoryId] = useState([]); 
  const [preview, setPreview] = useState(null); 
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    image: '',
    attach: '',
    name: '',
    desc: '',
    price: '',
    pages: '',
    isbn: '',
    author: '',
    publication: '',
  }); 

  const getCategories = async () => {
    try {
      const response = await API.get('/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeCategoryId = (e) => {
    const id = e.target.value;
    const checked = e.target.checked;

    if (checked) {
      setCategoryId([...categoryId, parseInt(id)]);
    } else {
      let newCategoryId = categoryId.filter((categoryIdItem) => {
        return categoryIdItem != id;
      });
      setCategoryId(newCategoryId);
    }
  };

  const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.name]:
            e.target.type === 'file' ? e.target.files : e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      };

      const formData = new FormData();
      formData.set('image', form.image[0], form.image[0].name);
      formData.set('attach', form.attach[0], form.attach[0].name);
      formData.set('name', form.name);
      formData.set('desc', form.desc);
      formData.set('price', form.price);
      formData.set('pages', form.pages);
      formData.set('isbn', form.isbn);
      formData.set('author', form.author);
      formData.set('publication', form.publication);
      formData.set('categoryId', categoryId);

      console.log(form);

      const response = await API.post('/product', formData, config);
      console.log(response);

      navigate('/admin/product');
    } catch (error) {
      console.log(error);
    }
  });

  const logout = () => {
    console.log(state)
    dispatch({
        type: "LOGOUT"
    })
    navigate("/auth")
  }

  useEffect(() => {
    getCategories();
  }, []);

    return (
      
            <div className="edit-container">
              <body className='border-addProduct'>
                <Navbar className='navigasi'  expand="lg">
                  <Container>
                    <Navbar.Brand as={Link} to="/admin"><img src={Vector} style={{ maxWidth: '100px' }} alt="" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                      <Dropdown>
                        <Dropdown.Toggle className='bg-transparent border-0'>
                          <img
                            src={imgBlank}
                            className="rounded-circle me-2 img-contact"
                            alt="user avatar"
                          />
                        </Dropdown.Toggle>

                        <Dropdown.Menu className='me-5'>
                          <Dropdown.Item as={Link} to="/admin/product" style={{ color:'#000000', fontSize: '20px' }}><FontAwesomeIcon icon={faBook} style={{ color: '#8A8C90', fontSize: '25px' }} /> Add Book</Dropdown.Item>
                          <Dropdown.Item as={Link} to="/admin/complain" style={{ color:'#000000', fontSize: '20px' }}><FontAwesomeIcon icon={faMessage} style={{ color: '#8A8C90', fontSize: '25px' }} /> Complain</Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item onClick={logout} style={{ color:'#000000', fontSize: '20px' }}><FontAwesomeIcon icon={faRightFromBracket} style={{ color: 'red', fontSize: '25px' }} /> Logout</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Navbar.Collapse>
                  </Container>
                </Navbar>

                <h1 className="table-title mb-5" style={{ color: '#000000', fontFamily: 'Times New Roman', fontSize: '36px'}}>Add Book</h1>
                <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                <Form.Group>
                    <Form.Control type="text" onChange={handleChange} style={{ color: '#000000', backgroundColor: '#D2D2D2', fontFamily: ''}} name="name" placeholder="Title" className='mt-3'></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Control type="text" onChange={handleChange} style={{ color: '#000000', backgroundColor: '#D2D2D2', fontFamily: ''}} name="author" placeholder="Author" className='mt-3'></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Control type="date" onChange={handleChange} style={{ color: '#000000', backgroundColor: '#D2D2D2', fontFamily: ''}} name="publication" placeholder="Publication Date" className='mt-3'></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Control type="text" onChange={handleChange} style={{ color: '#000000', backgroundColor: '#D2D2D2', fontFamily: ''}} name="pages" placeholder="Pages" className='mt-3'></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Control type="text" onChange={handleChange} style={{ color: '#000000', backgroundColor: '#D2D2D2', fontFamily: ''}} name="isbn" placeholder="ISBN" className='mt-3'></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Control type="text" onChange={handleChange} style={{ color: '#000000', backgroundColor: '#D2D2D2', fontFamily: ''}} name="price" placeholder="Price" className='mt-3'></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Control as="textarea" onChange={handleChange} style={{ color: '#000000', backgroundColor: '#D2D2D2', fontFamily: ''}} name="desc" rows={5} placeholder="About This Book" className='mt-3'></Form.Control>
                </Form.Group>
                <Form.Group>
                {/* {preview && (
                <div className='mt-4'>
                  <img
                    
                    style={{
                      maxWidth: '150px',
                      maxHeight: '150px',
                      objectFit: 'cover',
                      color: '#000000'
                    }}
                    alt={preview}
                  />
                </div>
                )} */}
                <input
                  type="file"
                  id="image"
                  name="image"
                  hidden
                  onChange={handleChange}
                />
                  <label for="image" className="label-file-add-product" style={{ color: '#4f4f4f', backgroundColor: '#D2D2D2', fontFamily: ''}}>
                    Image Book File <FontAwesomeIcon icon={faPaperclip} style={{ color: '#4f4f4f', fontSize: '20px' }} />
                  </label>
                </Form.Group>

                <Form.Group>
                {/* {preview && (
                <div className='mt-4'>
                  <img
                    
                    style={{
                      maxWidth: '150px',
                      maxHeight: '150px',
                      objectFit: 'cover',
                      color: '#000000'
                    }}
                    alt={preview}
                  />
                </div>
                )} */}
                <input
                  type="file"
                  id="attach"
                  name="attach"
                  hidden
                  onChange={handleChange}
                />
                  <label for="attach" className="label-file-add-product" style={{ color: '#4f4f4f', backgroundColor: '#D2D2D2', fontFamily: ''}}>
                    Attach Book File <FontAwesomeIcon icon={faPaperclip} style={{ color: '#4f4f4f', fontSize: '20px' }} />
                  </label>
                </Form.Group>

                <Button variant="success" type="submit" className="button-login-login mt-3 float-end border-0" style={{ color: 'white', backgroundColor: '#393939' }}>Add Book <FontAwesomeIcon icon={faBook} className='ps-2' style={{ color: '#8A8C90', fontSize: '20px' }} /></Button>
                </Form>
              </body>
            </div>
    );
}

export default AddProductAdmin;