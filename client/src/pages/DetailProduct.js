import { useEffect, useState } from 'react';
import { useContext } from 'react'
import { UserContext } from '../context/userContext'
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { Button } from "react-bootstrap"
import { Carousel } from 'react-bootstrap';
import { API } from '../config/api';
import '../style/Detail.css';
import DumbMerch from '../assets/DumbMerch.png'
import Vector from '../assets/Vector.png'
import imgBlank from '../assets/blank-profile.png';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Dropdown, Container } from 'react-bootstrap';
import { faMarsAndVenus, faPhone, faLocationDot, faEnvelope, faUser, faMessage, faRightFromBracket, faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DetailProduct() {

  let navigate = useNavigate();

  let { id } = useParams();
  const [state, dispatch] = useContext(UserContext);

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

  const logout = () => {
    console.log(state)
    dispatch({
        type: "LOGOUT"
    })
    navigate("/auth")
  }

  return (
    
      <body className='border-detail'>
        <Navbar className='navigasi'  expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/user"><img src={Vector} style={{ maxWidth: '100px' }} alt="" /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Navbar.Brand as={Link} to="/user"><FontAwesomeIcon icon={faBasketShopping} className='pt-1' style={{ color: '#8A8C90', fontSize: '30px' }} /></Navbar.Brand>
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

        <div className='container h-100'>
          <div className='container h-100'>
            <div className='row alin-items-center h-100 pb-5'>                  
              <form className='col-12 wow fadeInUp border-0 bg-transparent' data-wow-delay='0.2s'>
                <div className='card border-0 bg-transparent'>                  
                  <div className='card mb-3 border-0 bg-transparent'>
                    <div className='row g-0'>
                      
                      <div className='col-md-6'>
                        <img
                          className="d-block rounded ms-5"
                          src={product?.image}
                          alt="First slide"
                          style= {{ width: '450px', height: '600px', objectFit: 'cover' }}
                        />                              
                      </div>
                            
                      <div className='col-md-6 border-0'>
                        <div className='card-body'>
                          <div className='title-product'>
                            <h1  style={{ color: '#000000', fontFamily: 'Times New Roman', fontSize: '50px'}}>{product?.name}</h1>                              
                          </div>
                          <div className='stock mb-5 text-white'>
                            <p style={{ color: '#929292', fontFamily: '', fontSize: '26px'}}><i>By. {product?.author}</i></p>                              
                          </div>
                          <div className='description mt-4 text-white'>
                            <h1 style={{ color: '#000000', fontFamily: '', fontSize: '26px'}}>Publication date</h1>  
                            <p style={{ color: '#929292', fontFamily: 'Avenir', fontSize: '18px'}}>{product?.publication}</p>
                          </div>
                          <div className='description mt-4 text-white'>
                            <h1 style={{ color: '#000000', fontFamily: '', fontSize: '26px'}}>Pages</h1>  
                            <p style={{ color: '#929292', fontFamily: 'Avenir', fontSize: '18px'}}>{product?.pages}</p>
                          </div>
                          <div className='description mt-4 text-white'>
                            <h1 style={{ color: '#D60000', fontFamily: '', fontSize: '26px'}}>ISBN</h1>  
                            <p style={{ color: '#929292', fontFamily: 'Avenir', fontSize: '18px'}}>{product?.isbn}</p>
                          </div>
                          <div className='price mt-4 text-white'>
                            <h1 style={{ color: '#000000', fontFamily: '', fontSize: '26px'}}>Price</h1>  
                            <p style={{ color: '#44B200'}}>Rp.{product?.price}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              <div>
                <div className='description mt-5 ms-5 text-white'>
                  <h1 className='mb-3' style={{ color: '#000000', fontFamily: 'Times New Roman', fontSize: '36px'}}>Add This Book</h1>
                  <p style={{ color: '#929292'}}> {product?.desc}</p>
                </div>
                <div className='float-end'>
                  <Button onClick={(e) => handleBuy.mutate(e)} style={{ color: 'white', backgroundColor: '#393939'}} variant="danger" className="button-login-login">Add Cart <FontAwesomeIcon icon={faBasketShopping} className='pt-1 ps-2' style={{ color: '#8A8C90', fontSize: '20px' }} /></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
  );
}

export default DetailProduct;