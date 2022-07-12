import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { UserContext } from '../context/userContext'
import {io} from 'socket.io-client'
import Contact from '../components/complain/Contact'
import Chat from '../components/complain/Chat'
import '../style/ComplainUser.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Dropdown } from 'react-bootstrap';
import { faEnvelope, faUser, faMessage, faRightFromBracket, faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom'
import DumbMerch from '../assets/DumbMerch.png'
import Vector from '../assets/Vector.png'
import imgBlank from '../assets/blank-profile.png';

let socket

export default function ComplainUser() {

    let navigate = useNavigate()

    const [contact, setContact] = useState(null)
    const [contacts, setContacts] = useState([])
    const [messages, setMessages] = useState([])

    const title = "Complain Admin"
    document.title = 'DumbMerch | ' + title

    const [state, dispatch] = useContext(UserContext)

    useEffect(() =>{
        socket = io('http://localhost:5000', {
            auth: {
                token: localStorage.getItem("token")
            }
        })
        socket.on("new message", () => {
            socket.emit('load messages', contact?.id)
        })
        socket.on("connect_error", (err) => {
            console.error(err.message); 
        });

        loadContact()
        loadMessages()

        return () => {
            socket.disconnect()
        }
    }, [messages]) 

    const loadContact = () => {
        socket.emit("load admin contact")
        socket.on("admin contact", (data) => {

            const dataContact = {
                ...data,
                message: messages.length > 0 ? messages[messages.length - 1].message : 'Online'
            }
            setContacts([dataContact])
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
            }else{
                setMessages([])
                loadContact()
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
                <body className='border-complainUser'>
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

                    <Container fluid style={{height: '80vh', backgroundColor:'#DFDFDF', borderRadius: '10px' }}>
                        <Row>
                            <Col  style={{height: '10vh', backgroundColor: '#C4C4C4', borderTopLeftRadius: '10px', borderTopRightRadius: '10px'}} className="px-4 border-dark overflow-auto">
                                <Contact dataContact={contacts}  clickContact={onClickContact} contact={contact} />
                            </Col>
                        </Row>
                        <Row>
                            <Col  style={{height: '70vh', color: '#000000'}} className="px-4 border-dark overflow-auto">
                                <Chat contact={contact} messages={messages} user={state.user} sendMessage={onSendMessage}  />
                            </Col>
                        </Row>
                    </Container>
                </body>
            </div>
        </>
    )
}
