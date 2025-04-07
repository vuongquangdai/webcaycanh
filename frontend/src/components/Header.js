// frontend/src/components/Header.js

/**
 * @fileOverview Component Header chứa logo và thanh navigation.
 * Hiển thị thông tin người dùng và giỏ hàng, cho phép đăng nhập/đăng xuất.
 */

import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import '../index.css';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <Link to="/">
            <img src="/background/logo.jpg" alt="logo" className="image" />
          </Link>
        </div>
        <ul className="nav-items">
          <li>
            <Link to="/">Trang chủ</Link>
          </li>
          <li>
            <Link to="/product">Sản phẩm</Link>
          </li>
          <li>
            <Link to="/contact">Liên hệ</Link>
          </li>
        </ul>
      </div>

      <div className="header-right">
        <ul className="nav-items">
          <li>
            <Link to="/cart" className="cart-link">
              <FaShoppingCart size={20} />
              <span>Giỏ hàng</span>
              {cart && cart.length > 0 && (
                <span className="cart-count">{cart.length}</span>
              )}
            </Link>
          </li>
          <li className="user-menu" onMouseEnter={() => setDropdownVisible(true)} onMouseLeave={() => setDropdownVisible(false)}>
            {user ? (
              <div className="user-info">
                <FaUser size={20} />
                <span>{user.displayName}</span>
                {dropdownVisible && (
                  <div className="dropdown-menu">
                    <Link to="/user" className="link">Tài khoản</Link>
                    <Link to="/user/orders" className="link">Đơn hàng</Link>
                    <button onClick={handleLogout}>Đăng xuất</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-link">
                <FaUser size={20} />
                <span>Đăng nhập</span>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;