import { Table, Button, Modal, Row, Col, Container } from 'react-bootstrap'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { API } from '../config/api';
import DeleteData from '../components/modal/DeleteData';
import imgEmpty from '../assets/empty.svg';
import imgBlank from '../assets/blank-profile.png';
import '../style/Product.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import DumbMerch from '../assets/DumbMerch.png'
import Vector from '../assets/Vector.png'
import { faEnvelope, faBook, faMessage, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from '../context/userContext'

function ListProduct() {

  let navigate = useNavigate();

  const title = 'Product Admin';
  document.title = 'DumbMerch | ' + title;

  const [state, dispatch] = useContext(UserContext)

  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let { data: products, refetch } = useQuery('productsCache', async () => {
    const response = await API.get('/products');
    return response.data.data;
  });

  const addProduct = () => {
    navigate('/admin/add-product');
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  const deleteById = useMutation(async (id) => {
    try {
      await API.delete(`/product/${id}`);
      refetch();
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    if (confirmDelete) {
      handleClose();
      deleteById.mutate(idDelete);
      setConfirmDelete(null);
    }
  }, [confirmDelete]);

  const logout = () => {
    console.log(state)
    dispatch({
        type: "LOGOUT"
    })
    navigate("/auth")
  }

  return (

    <div className='table-container'>
      <body className='border-product'>
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

        <Row>
          <Col>
            <h3 className="table-title mb-5">List Product</h3>
          </Col>
          <Col className="text-end">
            <Button
              onClick={addProduct}
              className="btn-danger border-0"
              style={{ width: '100px', backgroundColor: '#393939' }}
            >
              Add
            </Button>
          </Col>
          <Col xs="12">
            {products?.length !== 0 ? (
              <Table striped>
                <thead className=''>
                  <tr>
                    <th>No&emsp;</th>
                    <th>Photo&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</th>
                    <th>Product Name&emsp;&emsp;</th>
                    <th style={{ width: '15%' }}>Product Desc</th>
                    <th>Price</th>
                    <th style={{ width: '30%' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((item, index) => (
                    <tr key={index}>
                      <td className='pt-4'>{index + 1}</td>
                      <td className='pt-2'><img src={item.image} style={{ width: '70px', height: '70px', objectFit: 'cover' }} alt={item.name} /></td>
                      <td className='pt-4'>{item.name}</td>
                      <td className='product-desc pt-4'>{item.desc}</td>
                      <td className='pt-4'>{item.price}</td>
                      <td><Button variant="success ps-5 pe-5 mt-2 me-2 w-40" onClick={() => { handleEdit(item.id); }}  className="button-table">Edit</Button>
                          <Button variant="danger ps-5 pe-5 mt-2 w-40" onClick={() => { handleDelete(item.id); }} className="ms-2 button-table">Delete</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              ) : (
                <div className="text-center pt-5">
                  <img
                    src={imgEmpty}
                    className="img-fluid"
                    style={{ width: '40%' }}
                    alt="empty"
                  />
                  <div className="mt-3 text-danger">No Books</div>
                </div>
            )}
          </Col>
        </Row>
        <DeleteData
          setConfirmDelete={setConfirmDelete}
          show={show}
          handleClose={handleClose}
        />
      </body>
    </div>
  );
}

export default ListProduct;