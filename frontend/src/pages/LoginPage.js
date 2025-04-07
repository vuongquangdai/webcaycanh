// frontend/src/pages/LoginPage.js

/**
 * @fileOverview Trang đăng nhập.
 * Nếu có token từ Google (query param), tiến hành đăng nhập và chuyển hướng đến trang hồ sơ.
 * Nếu chưa đăng nhập, cung cấp nút đăng nhập với Google.
 */

import { useSearchParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import '../index.css';

function LoginPage() {
  const { user, login } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token);
      navigate('/user', { replace: true });
    }
  }, [searchParams, login, navigate]);

  if (user) {
    navigate('/user');
    return null;
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/background/logo.jpg" alt="logo" className="image" />
        <p>Đăng nhập để trải nghiệm các tính năng <br></br> tuyệt vời của chúng tôi.</p>
        <button className="google-login-button" onClick={handleGoogleLogin}>
          <img src="/background/icon_gg.png" alt="Google" className="google-icon" />
          Đăng nhập với Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;