import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import barangayImage from '../assets/brgy145.png'; // Import your image from assets
import CaloocanLogo from '../assets/CaloocanLogo.png';
import Logo145 from '../assets/Logo145.png';


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setSuccess(`Welcome back, ${data.user.name}! (${data.user.role})`);
      
      // Use the auth context to handle login
      login(data.user);
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      boxSizing: 'border-box',
      position: 'fixed',
      top: 0,
      left: 0,
      margin: 0,
      backgroundImage: `url(${barangayImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(135, 120, 107, 0.7)',
        zIndex: 1
      }}></div>
      <div style={{
        backgroundColor: '#fff7e8ff',
        backdropFilter: 'blur(10px)',
        border: 'solid 2px #d7c195ff',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        padding: '3rem',
        marginLeft: '50rem',
        height: '100vh',
        maxHeight: '500px',
        width: '100%',
        maxWidth: '450px',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          position: 'relative'
        }}>

          <div style={{
            position: 'absolute',
            left: '0',
            top: '0',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            overflow: 'hidden'
          }}>
            <img 
              src={CaloocanLogo} 
              alt="Caloocan Logo" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          
          <div style={{
            position: 'absolute',
            right: '0',
            top: '0',
            width: '65px',
            height: '65px',
            borderRadius: '50%',
            overflow: 'hidden'
          }}>
            <img 
              src={Logo145} 
              alt="Logo 145" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          
          <h1 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#0D4715',
          }}>
            LOGIN
          </h1>
          <p style={{
            margin: 0,
            color: '#666',
            fontSize: '1rem',
            marginBottom: '4rem'
          }}>
            Login your account
          </p>
        </div>

        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #f3dbaaff',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
                outline: 'none',
                backgroundColor: 'rgba(255, 240, 230, 0.9)',
                color: '#445C3C'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0D4715'}
              onBlur={(e) => e.target.style.borderColor = '#445C3C'}
              placeholder="Username"
            />
          </div>

          <div style={{ marginBottom: '3%' }}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #f3dbaaff',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
                outline: 'none',
                backgroundColor: 'rgba(255, 240, 230, 0.9)',
                color: '#445C3C'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0D4715'}
              onBlur={(e) => e.target.style.borderColor = '#445C3C'}
              placeholder="Password"
            />
          </div>

          <div style={{ 
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <button
              type="button"
              onClick={() => alert('Please contact the administrator for password recovery')}
              style={{
                background: 'none',
                border: 'none',
                color: '#0D4715',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: '0',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.7'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'rgba(255, 238, 238, 0.9)',
              color: '#c33',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: 'rgba(238, 255, 238, 0.9)',
              color: '#0D4715',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              border: '1px solid #0D4715'
            }}>
              {success}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#ccc' : '#0D4715',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
              boxSizing: 'border-box'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#0a3a10';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#0D4715';
              }
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        {/* <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 218, 185, 0.7)'
        }}>
          <p style={{
            margin: '0 0 0.5rem 0',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            Don't have an account?
          </p>
          <button
            onClick={() => {
              alert('Contact administrator to create an account');
            }}
            style={{
              backgroundColor: 'transparent',
              color: '#0D4715',
              border: '2px solid #0D4715',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#0D4715';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#0D4715';
            }}
          >
            Request Account
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Login;