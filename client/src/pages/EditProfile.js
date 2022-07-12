import { Form, Button } from "react-bootstrap";
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router';
import { useQuery, useMutation } from 'react-query';
import { UserContext } from '../context/userContext'
import { API } from '../config/api';
import { Link } from 'react-router-dom'
import '../style/EditProfile.css';
import DumbMerch from '../assets/DumbMerch.png'
import Vector from '../assets/Vector.png'
import imgBlank from '../assets/blank-profile.png';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Dropdown, Container } from 'react-bootstrap';
import { faMarsAndVenus, faPhone, faLocationDot, faEnvelope, faUser, faMessage, faRightFromBracket, faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function EditProfile() {
    const title = 'Profile User';
    document.title = 'DumbMerch | ' + title;

    let navigate = useNavigate();

    const [state, dispatch] = useContext(UserContext);

    const [preview, setPreview] = useState(null); //For image preview
    const [profile, setProfile] = useState({}); //Store profile data
    const [form, setForm] = useState({
        image: '',
        phone: '',
        gender: '',
        address: '',
    }); //Store profile data


    // Fetching detail profile data by id from database
    let { data: profiles, refetch } = useQuery('profileCache', async () => {
        const response = await API.get('/profile');
        return response.data.data;
      });
    
      useEffect(() => {
        if (profiles) {
          setPreview(profiles.image);
          setForm({
            ...form,
            name: profiles.users.name,
            phone: profiles.phone,
            gender: profiles.gender,
            address: profiles.address,
          });
          setProfile(profiles);
        }
      }, [profiles]);

    // Handle change data on form
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === 'file' ? e.target.files : e.target.value,
        });

        // Create image url for preview
        if (e.target.type === 'file') {
            let url = URL.createObjectURL(e.target.files[0]);
            setPreview(url);
        }
    };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            // Configuration
            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                },
            };

            // Store data with FormData as object
            const formData = new FormData();
            if (form.image) {
                formData.set('image', form?.image[0], form?.image[0]?.name);
            }
            formData.set('name', form.name);
            formData.set('phone', form.phone);
            formData.set('gender', form.gender);
            formData.set('address', form.address);

            // Insert profile data
            const response = await API.patch('/profile', formData, config);

            console.log(response.data);

            navigate('/user/profile');
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
        <div className="user-container">
            <div className="edit-profile">
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
                <p className="table-title">Edit Profile</p>
                <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                    {preview && (
                        <div>
                            <img
                                src={preview}
                                style={{
                                    maxWidth: '150px',
                                    maxHeight: '150px',
                                    objectFit: 'cover',
                                }}
                                alt="preview"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        id="upload"
                        name="image"
                        hidden
                        onChange={handleChange}
                    />
                    <label for="upload" className="label-file-add-product" style={{ color: '#4f4f4f', backgroundColor: '#D2D2D2', fontFamily: ''}}>
                        Upload Photo
                    </label>
                    <Form.Group>
                        <Form.Control type="text" onChange={handleChange} value={form?.name} name="name" placeholder="Name" className='mt-3'></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="text" onChange={handleChange} value={form?.phone} name="phone" placeholder="Phone" className='mt-3'></Form.Control>
                    </Form.Group>
                    <Form.Select aria-label="Default select example" onChange={handleChange} value={form?.gender} name="gender" className="mt-3">
                        <option>Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </Form.Select>
                    <Form.Group>
                        <Form.Control as="textarea" rows={3} onChange={handleChange} value={form?.address} name="address" placeholder="Address" className='mt-3'></Form.Control>
                    </Form.Group>
                    <Button variant="success" type="submit" className="button-login-login border-0 mt-5 float-end" style={{ color: '#4f4f4f', backgroundColor: '#D2D2D2', fontFamily: ''}}>Save Profile</Button>
                </Form>
            </div>
        </div>
    );
}

export default EditProfile;