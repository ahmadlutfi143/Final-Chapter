import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query';
import { API } from '../config/api';
import React, { Component } from "react";
import Slider from "react-slick";
import imgEmpty from '../assets/empty.svg';
import imgBlank from '../assets/blank-profile.png';
import '../style/Home.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useNavigate, useParams } from 'react-router-dom';
import DumbMerch from '../assets/DumbMerch.png'
import Vector from '../assets/Vector.png'
import { useContext } from 'react'
import { UserContext } from '../context/userContext'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Dropdown } from 'react-bootstrap';
import Login from '../components/modal/Login';
import Register from '../components/modal/Register';
import { useState, useEffect } from 'react'
import { faEnvelope, faUser, faMessage, faRightFromBracket, faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from 'react-query';

function Product() {

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

  const handleCart = (id) => {
    navigate(`/user/product/cart/${id}`);
  };

  const [state, dispatch] = useContext(UserContext)
  const logout = () => {
      console.log(state)
      dispatch({
          type: "LOGOUT"
      })
      navigate("/auth")
  }

  let { id } = useParams();

  let { data: product } = useQuery('productCache', async () => {
    const response = await API.get('/product/' + id);
    return response.data.data;
  });

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = "SB-Mid-client-OoS-Fpv-MJio-sJD";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, [])

  const handleBuy = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const data = {
        idProduct: product.id,
        idSeller: product.users.id,
        price: product.price,
      };

      const body = JSON.stringify(data);

      const response = await API.post('/transaction', body, config);
      const token = response.data.payment.token;

      window.snap.pay(token, {
        onSuccess: function (result) {
          console.log(result);
          navigate("/user/profile");
        },
        onPending: function (result) {
          console.log(result);
          navigate("/user/profile");
        },
        onError: function (result) {
          console.log(result);
        },
        onClose: function () {
          alert("you closed the popup without finishing the payment");
        },
      })
    } catch (error) {
      console.log(error);
    }
  });

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
                <Navbar.Brand as={Link} to="/user"><img src={Vector} style={{ maxWidth: '100px' }} alt="" /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                  <Navbar.Brand as={Link} to="/user/cart"><FontAwesomeIcon icon={faBasketShopping} className='pt-1' style={{ color: '#8A8C90', fontSize: '30px' }} /></Navbar.Brand>
                  <Dropdown>
                    <Dropdown.Toggle className='bg-transparent border-0'>
                      <img
                        src={imgBlank}
                        className="rounded-circle me-2 img-contact"
                        alt="user avatar"
                      />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className='me-5'>
                      <Dropdown.Item as={Link} to="/user/profile" style={{ color:'#000000', fontSize: '20px' }}><FontAwesomeIcon icon={faUser} style={{ color: '#8A8C90', fontSize: '25px' }} /> Profile</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/user/complain" style={{ color:'#000000', fontSize: '20px' }}><FontAwesomeIcon icon={faMessage} style={{ color: '#8A8C90', fontSize: '25px' }} /> Complain</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={logout} style={{ color:'#000000', fontSize: '20px' }}><FontAwesomeIcon icon={faRightFromBracket} style={{ color: 'red', fontSize: '25px' }} /> Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
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
                                      <Link style={{ textDecoration: 'none' }} to={`/user/product/detail/${item.id}`}>
                                        <Card.Title style={{ color: '#000000', fontSize: '18px', fontFamily: 'Times New Roman', fontWeight: '700' }}>{item.name}</Card.Title>
                                      </Link>
                                        <p className='product-card-text' style={{ color: '#929292', fontSize: '14px'}}><i>By. {item.author}</i></p>
                                        <p className='product-card-desc' style={{ color: '#000000', fontSize: '14px', textAlign: 'justify'}}>{item.desc}</p>
                                        <p className='product-card-text' style={{ color: '#44B200', fontFamily: 'Avenir'}}>Rp. {item.price}</p>
                                      <Button onClick={() => { handleCart(item.id); }} style={{ color: 'white', backgroundColor: '#393939', fontFamily: 'Avenir'}} variant="danger" className="button-login-login">Add to Cart</Button>
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
                      <div className="mt-3 text-danger">No Books</div>
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
                          <Link style={{ textDecoration: 'none' }} to={`/user/product/detail/${item.id}`}>
                            <Card.Title style={{ color: '#000000', fontSize: '18px', fontFamily: 'Times New Roman', fontWeight: '700' }}>{item.name}</Card.Title>
                          </Link>
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
                      <div className="mt-3 text-danger">No Books</div>
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

export default Product;