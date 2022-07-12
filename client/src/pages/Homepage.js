import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query';
import { API } from '../config/api';
import React, { Component } from "react";
import Slider from "react-slick";
import imgEmpty from '../assets/empty.svg';
import '../style/Home.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import DumbMerch from '../assets/DumbMerch.png'
import Vector from '../assets/Vector.png';
import Besar from '../assets/Besar.png';
import { useContext } from 'react'
import { UserContext } from '../context/userContext'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Dropdown } from 'react-bootstrap';
import Login from '../components/modal/Login';
import Register from '../components/modal/Register';
import { useState, useEffect } from 'react'
import { faEnvelope, faUser, faMessage, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Homepage() {

  let navigate = useNavigate()

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showi, setShowi] = useState(false);
  const handleClosei = () => setShowi(false);
  const handleShowi = () => setShowi(true);

  const [idRegister, setIdRegister] = useState(null);
  const [idLogin, setIdLogin] = useState(null);
  const [confirmRegister, setConfirmRegister] = useState(null);
  const [confirmLogin, setConfirmLogin] = useState(null);

  const handleRegister = (id) => {
    setIdRegister(id);
    handleShow();
  };

  const handleLogin = (id) => {
    setIdLogin(id);
    handleShowi();
  };

  const [state, dispatch] = useContext(UserContext)
  const logout = () => {
      console.log(state)
      dispatch({
          type: "LOGOUT"
      })
      navigate("/auth")
  }

  const checkAuth = () => {
    if (state.isLogin === true) {
      if(state.user.status == 'Customer'){
        navigate('/user')
      }else{
        navigate('/admin')
      }
    }
  };

  checkAuth();

  const [isRegister, setIsRegister] = useState(false);

  const switchLogin = () => {
    setIsRegister(false);
  };

  const switchRegister = () => {
    setIsRegister(true);
  };

  const settings = {
    className: "center",
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    swipeToSlide: true,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 2000,
    afterChange: function(index) {
      console.log(
        `Slider Changed to: ${index + 1}, background: #222; color: #bada55`
      );
    }
  };

  const title = 'Shop';
  document.title = 'DumbMerch | ' + title;
  
  let { data: products } = useQuery('productsCache', async () => {
    const response = await API.get('/products');
    return response.data.data;
  });
  
  console.log(products);

  return (

        <div className='user-container'>
          <body className='border-home'>
            <Navbar className='navigasi'  expand="lg">
              <Container>
                <Navbar.Brand as={Link} to="#"><img src={Vector} style={{ maxWidth: '100px' }} alt="" /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                  <Nav>
                    <Button variant="outline-dark ps-5 pe-5 mt-2 me-2 w-40" onClick={() => { handleLogin(); }}>Login</Button>
                    <Button variant="outline-dark ps-5 pe-5 mt-2 ms-2 w-40" onClick={() => { handleRegister(); }}>Register</Button>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>

            <h1 className='user-text ms-2' style={{ color: '#000000', textAlign: 'center', fontFamily: 'Vollkorn', fontSize: '33px'}}>With us, you can shoop online & help</h1>
            <h1 className='user-text ms-2 mb-5' style={{ color: '#000000', textAlign: 'center', fontFamily: 'Sabon RomanOsF', fontSize: '38px'}}>save your high street at the same time</h1>

            <Container className='ms-0'>
              {products?.length !== 0 ? (
                <Row>
                  <Slider {...settings}>
                    {products?.map((item, index) => (
                      <Col sm="2" key={index}>
                        <form className='col-12 wow fadeInUp border-0 bg-transparent' data-wow-delay='0.2s'>
                          <div className='card border-0 bg-transparent'>                  
                            <div className='card mb-3 border-0 bg-transparent'>
                              <div className='row g-0'>

                                <div className='col-md-6'>
                                  <Card className="product-card mb-2" style={{ backgroundColor: '#212121', border: 'transparent', width: '100%'}}>
                                    <Card.Img variant="top" src={item.image} style= {{ width: '100%', height: '300px', objectFit: 'cover' }} className='product-image' />
                                  </Card>
                                </div>

                                <div className='col-md-6 border-0'>
                                  <Card className="product-card mb-2" style={{ backgroundColor: '#ffffff', width: '90%'}}>
                                    <Card.Body>
                                      <Card.Title style={{ color: '#000000', fontSize: '18px', fontFamily: 'Times New Roman', fontWeight: '700' }}>{item.name}</Card.Title>
                                        <p className='product-card-text' style={{ color: '#929292', fontSize: '14px'}}><i>By. {item.author}</i></p>
                                        <p className='product-card-desc' style={{ color: '#000000', fontSize: '14px', textAlign: 'justify'}}>{item.desc}</p>
                                        <p className='product-card-text' style={{ color: '#44B200', fontFamily: 'Avenir'}}>Rp. {item.price}</p>
                                      <Button  style={{ color: 'white', backgroundColor: '#393939', fontFamily: 'Avenir'}} variant="danger" onClick={() => { handleLogin(); }} className="button-login-login">Add to Cart</Button>
                                    </Card.Body>
                                  </Card>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </Col>
                    ))}
                  </Slider>
                </Row>
                ) : (
                <Col>
                  <div className="text-center pt-5">
                    <img
                      src={imgEmpty}
                      className="img-fluid"
                      style={{ width: '40%' }}
                      alt="empty"
                    />
                    <div className="mt-3 text-danger">No data product</div>
                  </div>
                </Col>
              )}
            </Container>
          </body>

          <div className='border-home2'>
            <h1 className='user-text ms-2 mt-5 mb-4' style={{ color: '#000000', fontFamily: 'Times New Roman', fontSize: '36px'}}>List Book</h1>
              <Container className='ms-0'>
                {products?.length !== 0 ? (
                  <Row>
                    {products?.map((item, index) => (
                      <Col sm="2" key={index}>
                        <Card className="product-card mb-5" style={{ backgroundColor: 'transparent', border: 'transparent', borderRadius: '10px', width: '100%'}}>
                          <Card.Img variant="top" src={item.image} style= {{ width: '100%', objectFit: 'cover' }} className='product-image' />
                          <Card.Body>
                            <Card.Title style={{ color: '#000000', fontSize: '18px', fontFamily: 'Times New Roman', fontWeight: '700' }}>{item.name}</Card.Title>
                            <p className='product-card-text' style={{ color: '#929292', fontSize: '14px'}}><i>By. {item.author}</i></p>
                              <p className='product-card-text' style={{ color: '#44B200', fontFamily: 'Avenir',}}>Rp. {item.price}</p>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  ) : (
                  <Col>
                    <div className="text-center pt-5">
                      <img
                        src={imgEmpty}
                        className="img-fluid"
                        style={{ width: '40%' }}
                        alt="empty"
                      />
                      <div className="mt-3 text-danger">No data product</div>
                    </div>
                  </Col>
                )}
              </Container>
          </div>
          <Register
            setConfirmRegister={setConfirmRegister}
            show={show}
            handleClose={handleClose}
          />
          <Login
            setConfirmLogin={setConfirmLogin}
            show={showi}
            handleClose={handleClosei}
          />
        </div>
  );
}

export default Homepage;