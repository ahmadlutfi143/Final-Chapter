import { useState, useContext, useEffect } from 'react'
import { UserContext } from '../context/userContext'
import { Link } from 'react-router-dom'
import dateFormat from 'dateformat';
import { Button, Card, Row, Col } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import { API } from '../config/api';
import '../style/Profile.css';
import DumbMerch from '../assets/DumbMerch.png'
import Vector from '../assets/Vector.png'
import imgBlank from '../assets/blank-profile.png';
import imgEmpty from '../assets/empty.svg';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Dropdown, Container } from 'react-bootstrap';
import { faMarsAndVenus, faPhone, faLocationDot, faEnvelope, faUser, faMessage, faRightFromBracket, faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Axios } from 'axios';
import FileDownload from 'js-file-download'

function Profile() {

    let navigate = useNavigate()

    const title = 'Profile';
    document.title = 'DumbMerch | ' + title;
  
    const { id } = useParams()
    const [state, dispatch] = useContext(UserContext);
  
    let { data: profile } = useQuery('profileCache', async () => {
      const response = await API.get('/profile/' + id);
      return response.data.data;
    });
  
    let { data: transactions } = useQuery('transactionsCache', async () => {
      const response = await API.get('/transactions');
      return response.data.data;
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
                                    <FontAwesomeIcon icon={faEnvelope} style={{ color: '#8A8C90', fontSize: '45px' }} />
                                  </div>
                                  <div>
                                    <h5 style={{ color: '#050505', fontSize: '22px'}}>{state.user.email}</h5>   
                                    <h5 style={{ color: '#8A8C90', fontSize: '18px'}}>Email</h5>           
                                  </div>           
                                </div>

                                <div className='mb-4 d-flex'>
                                  <div className='pt-2 pe-3'>
                                    <FontAwesomeIcon icon={faMarsAndVenus} style={{ color: '#8A8C90', fontSize: '45px' }} />
                                  </div>
                                  <div>
                                    <h5 style={{ color: '#050505', fontSize: '22px'}}>{profile?.gender ? profile?.gender : '-'}</h5> 
                                    <h5 style={{ color: '#8A8C90', fontSize: '18px'}}>Gender</h5> 
                                  </div>
                                </div>

                                <div className='mb-4 d-flex'>
                                  <div className='pt-2 pe-3'>
                                    <FontAwesomeIcon icon={faPhone} style={{ color: '#8A8C90', fontSize: '45px' }} />
                                  </div>
                                  <div>
                                    <h5 style={{ color: '#050505', fontSize: '22px'}}>{profile?.phone ? profile?.phone : '-'}</h5>
                                    <h5 style={{ color: '#8A8C90', fontSize: '18px'}}>Mobile Phone</h5> 
                                  </div>
                                </div>

                                <div className='mb-4 d-flex'>
                                  <div className='pt-2 pe-4 me-1'>
                                    <FontAwesomeIcon icon={faLocationDot} style={{ color: '#8A8C90', fontSize: '45px' }} />
                                  </div>
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
                              <img src={profile?.image ? profile.image : imgBlank} className="rounded mb-4" alt="" style= {{ width: '275px', height: '275px', objectFit: 'cover' }}/>
                              <div>
                                <Button variant="success" as={Link} to='/user/profile/edit' className="button-login border-0 d-grid" style={{ backgroundColor: '#D60000' }}>Edit Profile</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>

                  
                    <div className=''>
                      <h1 className='user-text mt-5 pb-4' style={{ color: '#000000', fontFamily: 'Times New Roman', fontSize: '36px'}}>List Book</h1>

                            <Row>
                              {transactions?.map((item, index) => (
                                <Col sm="2" key={index}>
                                  <Card className="product-card mb-5" style={{ backgroundColor: 'transparent', border: 'transparent', borderRadius: '10px', width: '100%'}}>
                                    <Card.Img variant="top" src={item.products.image} style= {{ width: '100%', objectFit: 'cover' }} className='product-image' />
                                    <Card.Body>
                                      <Card.Title style={{ color: '#000000', fontSize: '18px', fontFamily: 'Times New Roman', fontWeight: '700' }}>{item.products.name}</Card.Title>
                                      <p className='product-card-text' style={{ color: '#929292', fontSize: '12px'}}><i>By. {item.products.author}</i></p>
                                    </Card.Body>
                                <Button variant="success" href={item.products.attach} download={item.products.attach} className="button-login border-0 d-grid" style={{ backgroundColor: '#393939' }}>Download</Button>
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                    </div>
                </div>
              </div>
            </div>
          </body>
        </div>
    );
}

export default Profile;


                    // <form className='col-4 wow fadeInUp border-0 bg-transparent mt-5' data-wow-delay='0.2s'>
                    //   <h1 className='title-profile mb-5' style={{ color: '#000000', fontFamily: 'Times New Roman', fontSize: '40px' }}>My Books</h1>
                    //   <div style={{ width: '600px' }}>
                    //     {transactions?.map((item, index) => (
                    //       <div className="card pt-3 ps-3 pe-3 mb-3 register-custom" style={{ backgroundColor: '#303030', borderRadius: '5px', width: '80%'}}>
                    //         <div className='card border-0 bg-transparent'>
                    //           <div className='card border-0 bg-transparent'>
                    //             <div className='row g-0'>

                    //               <div className='col-md-3' key={index}>
                    //                 <img src={item.products.image} className="rounded float-start" alt=""  width='90%'/>
                    //               </div>

                    //               <div className='col-md-6 border-0'>
                    //                 <div className='card-body'>
                    //                   <div className='data-transaction'>
                    //                     <li style={{ color: '#F74D4D', fontSize: '15px'}}>{item.products.name}</li> 
                    //                     <li style={{ color: '#F74D4D', fontSize: '11px'}}>{dateFormat(item.createdAt, 'dddd, d mmmm yyyy')}</li>
                    //                     <li style={{ color: 'white', fontSize: '11px'}}>Price : Rp.{item.price}</li> 
                    //                     <p style={{ color: 'white', fontSize: '13px', marginTop: '25px'}}>Sub Total : Rp.{item.price}</p>                             
                    //                   </div>                            
                    //                 </div>
                    //               </div>

                    //               <div className='col-md-3'>
                    //                 <img src={DumbMerch} className="rounded float-end mt-4" alt=""  width='65%'/>
                    //               </div>
                    //               <div
                    //                 className={`status-transaction-${item.status} rounded h-100 w-100 d-flex align-items-center justify-content-center`}>
                    //                 {item.status}
                    //               </div>                              
                    //             </div>
                    //           </div>
                    //         </div>
                    //       </div>
                    //     ))}
                    //   </div>
                    // </form>