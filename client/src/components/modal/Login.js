import { Modal, Button } from 'react-bootstrap'
import { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { useMutation } from 'react-query';
import { API } from '../../config/api';

export default function Login({ show, handleClose, setConfirmDelete }) {

  let navigate = useNavigate();

  const title = 'Login';
  document.title = 'DumbMerch | ' + title;

  const [state, dispatch] = useContext(UserContext);

  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const { email, password } = form;

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

      const response = await API.post('/login', body, config);

      if (response?.status === 200) {

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: response.data.data,
        });

        if (response.data.data.status === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }

        const alert = (
          <Alert variant="success" className="py-1">
            Login success
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Login failed
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
            Login
          </div>
          {message && message}
            <form onSubmit={(e) => handleSubmit.mutate(e)}>
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
              </div>
              <div className="d-grid gap-2 mt-4">
                <Button variant="success" type="submit" className="button-login-login" style={{ color: 'white', backgroundColor: '#393939' }}>Login</Button>
                <div className='mt-2 mb-2' style={{ textAlign: 'center' }}>
                  <p>Don't have an account ? Klik <b>Here</b></p>
                </div>
              </div>
            </form>
        </Modal.Body>
      </Modal>
    )
}