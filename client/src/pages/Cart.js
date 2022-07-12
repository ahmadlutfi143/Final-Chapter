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
import { faMarsAndVenus, faPhone, faLocationDot, faEnvelope, faUser, faMessage, faRightFromBracket, faBasketShopping, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Cart() {

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
      
        <div className='user-container'>
            <body className='border-profile'>
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

              <div className='container h-100'>
                <div className='container h-100'>
                  <div className='row alin-items-center h-100'>   
                    <h1 style={{ color: '#000000', fontFamily: 'Times New Roman', fontSize: '40px' }}>My Cart</h1>
                    <h1 className='pt-4' style={{ color: '#000000', fontSize: '24px' }}>Review Your Order</h1>               
                    <form className='col-12 wow fadeInUp border-0 bg-transparents' data-wow-delay='0.2s'>
                      <div className='card border-0 bg-transparent'>                  
                        <div className='card mb-5 border-0' style={{ backgroundColor: 'transparent', borderRadius: '15px' }}>
                          <div className='row g-0'>

                            <div className='col-md-6'>
                              <div className='card-body border-top border-bottom'>
                                <div className='d-flex'>
                                  <div className='pt-3 pe-3'>
                                      <img src={product?.image ? product.image : imgBlank} className="rounded mb-3" alt=""  width='130px' height='220px'/>
                                  </div>
                                  <div className='pt-3'>
                                      <h5 style={{ color: '#050505', fontSize: '24px'}}>{product?.name}</h5>   
                                      <h5 className='pt-3'style={{ color: '#8A8C90', fontSize: '20px'}}><i>By. {product?.author}</i></h5>
                                      <h5 className='pt-5' style={{ color: '#44B200', fontSize: '20px'}}>Rp.{product?.price}</h5>       
                                  </div>           
                                </div>
                              </div>                           
                            </div>

                            <div className='col-md-1 pt-4 mb-2 border-top border-bottom ps-5'>
                              <FontAwesomeIcon icon={faTrashCan} style={{ color: '#8A8C90', fontSize: '25px', paddingTop: '5px' }} />
                            </div>

                            <div className='col-md-1 pt-4'>
                            </div>

                            <div className='col-md-4 border-0 pt-4 border-top'>
                              <div>
                                <div className='card-body float-end'>
                                  <div className='mb-4 d-flex'>
                                    <div className='pe-3'>
                                      <h5 style={{ color: '#050505', fontSize: '20px'}}>Subtotal &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</h5>   
                                      <h5 className='pt-3'style={{ color: '#8A8C90', fontSize: '20px'}}>Qty</h5>
                                    </div>
                                    <div>
                                      <h5 style={{ color: '#050505', fontSize: '20px'}}>Rp.{product?.price}</h5>   
                                      <h5 className='pt-3'style={{ color: '#8A8C90', fontSize: '18px'}}>1</h5>  
                                    </div>           
                                  </div>

                                  <div className='mb-4 d-flex pt-3 border-top'>
                                    <div className='pe-3'>
                                      <h5 style={{ color: '#44B200', fontSize: '20px'}}>Total&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</h5>
                                    </div>
                                    <div>
                                      <h5 style={{ color: '#44B200', fontSize: '20px'}}>Rp.{product?.price}</h5>   
                                    </div>  
                                  </div>
                                    <Button variant="success" className="button-login mt-5 border-0 d-grid" onClick={(e) => handleBuy.mutate(e)} style={{ backgroundColor: '#393939', paddingRight: '48%', textAlign: 'center' }}>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Pay</Button>
                                </div>
                              </div> 
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
          </body>
        </div>
    );
}

export default Cart;


{/* <div className='container h-100'>
                <div className='container h-100'>
                  <div className='row alin-items-center h-100'>   
                  <h1 style={{ color: '#000000', fontFamily: 'Times New Roman', fontSize: '40px' }}>Profile</h1>               
                    <form className='col-12 wow fadeInUp border-0 bg-transparent pt-4' data-wow-delay='0.2s'>
                      <div className='card border-0 bg-transparent'>                  
                        <div className='card mb-5 border-0' style={{ backgroundColor: '#FFD9D9', borderRadius: '15px' }}>
                          <div className='row g-0'>
                            <div className='col-md-6 pt-4'>
                            
                           
                            <div>
                                  <div className='card-body'>
                                    
                                    <div className='mb-4 d-flex'>
                                      <div className='pt-2 pe-3'>
                                      <FontAwesomeIcon icon={faEnvelope} style={{ color: '#8A8C90', fontSize: '45px' }} /></div>
                                      <div>
                                      <h5 style={{ color: '#050505', fontSize: '22px'}}>{state.user.email}</h5>   
                                      <h5 style={{ color: '#8A8C90', fontSize: '18px'}}>Email</h5>           
                                      </div>           
                                    </div>

                                    <div className='mb-4 d-flex'>
                                    <div className='pt-2 pe-3'>
                                    <FontAwesomeIcon icon={faMarsAndVenus} style={{ color: '#8A8C90', fontSize: '45px' }} /></div>
                                      <div>
                                      <h5 style={{ color: '#050505', fontSize: '22px'}}>{profile?.gender ? profile?.gender : '-'}</h5> 
                                      <h5 style={{ color: '#8A8C90', fontSize: '18px'}}>Gender</h5> 
                                      </div>
                                    </div>

                                    <div className='mb-4 d-flex'>
                                    <div className='pt-2 pe-3'>
                                    <FontAwesomeIcon icon={faPhone} style={{ color: '#8A8C90', fontSize: '45px' }} /></div>
                                      <div>
                                      <h5 style={{ color: '#050505', fontSize: '22px'}}>{profile?.phone ? profile?.phone : '-'}</h5>
                                      <h5 style={{ color: '#8A8C90', fontSize: '18px'}}>Mobile Phone</h5> 
                                      </div>
                                    </div>

                                    <div className='mb-4 d-flex'>
                                    <div className='pt-2 pe-4 me-1'>
                                    <FontAwesomeIcon icon={faLocationDot} style={{ color: '#8A8C90', fontSize: '45px' }} /></div>
                                      <div>
                                      <h5 style={{ color: '#050505', fontSize: '22px'}}>{profile?.address ? profile?.address : '-'}</h5>
                                      <h5 style={{ color: '#8A8C90', fontSize: '18px'}}>Address</h5> 
                                      </div>
                                    </div>
                                  </div>
                                </div>                             
                            
                            </div>
                            
                            <div className='col-md-6 border-0 pt-4'>
                              <div className='card-body float-end'>
                              <img src={profile?.image ? profile.image : imgBlank} className="rounded mb-4" alt=""  width='275px'/>
                              <div>
                              <Button variant="success" as={Link} to='/user/profile/edit' className="button-login border-0 d-grid" style={{ backgroundColor: '#D60000' }}>Edit Profile</Button>
                              </div>
                              </div>
                              
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                    <div>
                    
                    </div>
                  </div>
                </div>
              </div> */}