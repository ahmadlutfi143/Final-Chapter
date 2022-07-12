import { Modal, Button } from 'react-bootstrap'
import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import { Alert } from 'react-bootstrap';
import { useMutation } from 'react-query';
import { API } from '../../config/api';

export default function Register({ show, handleClose, setConfirmDelete }) {

  const title = 'Register';
  document.title = 'DumbMerch | ' + title;

  const [state, dispatch] = useContext(UserContext);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = form;
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const body = JSON.stringify(form);
      const response = await API.post('/register', body, config);

      if (response.data.status === 'success...') {
        const alert = (
          <Alert variant="success" className="py-1">
            Success
          </Alert>
        );
        setMessage(alert);
        setForm({
          name: '',
          email: '',
          password: '',
        });
      } else {
        const alert = (
          <Alert variant="danger" className="py-1">
            Failed
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Failed
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  });

  const handleDelete = () => {
    setConfirmDelete(true)
  }

  return (

    <Modal show={show} onHide={handleClose} centered style={{ width: '20%', marginLeft: '40%' }}>
      <Modal.Body className="text-dark">
        <div
          style={{ fontSize: '36px', lineHeight: '49px', fontWeight: '700', fontFamily: 'Times New Roman' }}
          className="mt-3 mb-4"
        >
          Register
        </div>
          {message && message}
            <form  onSubmit={(e) => handleSubmit.mutate(e)}>
              <div className="mt-3 form">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  name="email"
                  onChange={handleChange}
                  className="px-3 py-2"
                  style={{ color: '#505050', backgroundColor: '#D2D2D2' }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  name="password"
                  onChange={handleChange}
                  className="px-3 py-2 mt-3"
                  style={{ color: '#505050', backgroundColor: '#D2D2D2' }}
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  name="name"
                  onChange={handleChange}
                  className="px-3 py-2 mt-3"
                  style={{ color: '#505050', backgroundColor: '#D2D2D2' }}
                />
              </div>
                <div className="d-grid gap-2 mt-4">
                  <Button variant="success" type="submit" className="button-login-login" style={{ color: 'white', backgroundColor: '#393939' }}>Register</Button>
                  <div className='mt-2 mb-2' style={{ textAlign: 'center' }}>
                    <p>Already have an account ? Klik <b>Here</b></p>
                  </div>
                </div>
            </form>
      </Modal.Body>
    </Modal>
  )
}