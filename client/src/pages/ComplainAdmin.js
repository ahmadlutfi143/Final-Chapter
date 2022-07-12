import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { UserContext } from '../context/userContext'
import {io} from 'socket.io-client'
import Contact from '../components/complain/Contact'
import Chat from '../components/complain/Chat'
import '../style/ComplainAdmin.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Dropdown } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom'
import DumbMerch from '../assets/DumbMerch.png'
import Vector from '../assets/Vector.png'
import imgBlank from '../assets/blank-profile.png';
import { faEnvelope, faBook, faMessage, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

let socket

export default function ComplainAdmin() {

    let navigate = useNavigate()

    const [contact, setContact] = useState(null)
    const [contacts, setContacts] = useState([])
    const [messages, setMessages] = useState([])

    const title = "Complain admin"
    document.title = 'DumbMerch | ' + title

    const [state, dispatch] = useContext(UserContext)

    useEffect(() =>{
        socket = io('http://localhost:5000', {
            auth: {
                token: localStorage.getItem('token')
            }
        })

        socket.on("new message", () => {
            socket.emit('load messages', contact?.id)
        })

        loadContacts()
        loadMessages()

        return () => {
            socket.disconnect()
        }
    }, [messages]) 

    const loadContacts = () => {
        socket.emit("load customer contacts")
        socket.on("customer contacts", (data) => {

            let dataContacts = data.map((item) => ({
                ...item,
                message: item.senderMessage.length > 0 ? item.senderMessage[item.senderMessage.length - 1].message : 'Click here to start message'
            }))

            setContacts(dataContacts)
        })
    }

    const onClickContact = (data) => {
        setContact(data)
        socket.emit('load messages', data.id)
    }

    const loadMessages = () => {
        socket.on('messages', async (data) => {
            if(data.length > 0){
                const dataMessages = data.map((item) => ({
                    idSender: item.sender.id,
                    message: item.message
                }))
                setMessages(dataMessages)

                loadContacts()
            }else{
                setMessages([])
                loadContacts()
            }
        })
    }

    const onSendMessage = (e) => {
        if(e.key == "Enter"){
            const data = {
                idRecipient: contact.id,
                message: e.target.value
            }

            socket.emit('send message', data)
            e.target.value = ''
        }
    }

    const logout = () => {
        console.log(state)
        dispatch({
            type: "LOGOUT"
        })
        navigate("/auth")
    }

    return (
        <>
            <div>
                <body className='border-complainAdmin'>
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

                    <div className='container h-100'>
                        <div className='container h-100'>
                            <div className='row alin-items-center h-100'>
                                <h1 style={{ color: '#000000', fontFamily: 'Times New Roman', fontSize: '28px' }}>Customer Complain</h1>
                                <form className='col-12 wow fadeInUp border-0 bg-transparent' data-wow-delay='0.2s'>
                                    <div className='card border-0 bg-transparent'>                  
                                        <div className='card mb-3 border-0 bg-transparent'>
                                            <div className='row g-0'>

                                                <div className='col-md-4 mt-3'>
                                                    <Container fluid style={{height: 'auto', backgroundColor:'#DFDFDF', borderRadius: '10px', padding: '5px', paddingBottom: '8px' }}>
                                                        <Contact dataContact={contacts}  clickContact={onClickContact} contact={contact} />
                                                    </Container>
                                                </div>
                                                
                                                <div className='col-md-8 border-0'>
                                                    <div className='card-body'>
                                                        <Container fluid style={{height: '70vh', backgroundColor:'#DFDFDF', borderRadius: '10px' }}>
                                                            <Row>
                                                                <Col  style={{height: '70vh', color: '#000000'}} className="px-4 border-dark overflow-auto">
                                                                    <Chat contact={contact} messages={messages} user={state.user} sendMessage={onSendMessage}  />
                                                                </Col>
                                                            </Row>
                                                        </Container>
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
        </>
    )
}

