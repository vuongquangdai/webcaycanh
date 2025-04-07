// frontend/src/pages/Cart.js

/**
 * @fileOverview Trang Giỏ hàng hiển thị danh sách sản phẩm trong giỏ cùng tổng số tiền.
 * Cho phép người dùng cập nhật số lượng hoặc xóa sản phẩm khỏi giỏ.
 */

import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const handleCardClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const totalSum = cart.reduce((sum, item) => sum + (item.gia * item.quantity), 0);

  return (
    <div className="cart">
      <h1>Giỏ hàng của bạn</h1>
      {cart.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td 
                    key={item.id} 
                    onClick={() => handleCardClick(item)}
                  >
                    <img 
                      src={`${process.env.PUBLIC_URL}/images_tree/${item.ten_cay}_1.jpg`} 
                      alt={item.ten_cay} 
                      onError={(e) => e.target.src = "/images_tree/default.jpg"}
                    />
                    {item.ten_cay}
                  </td>
                  <td>{Number(item.gia).toLocaleString()}đ</td>
                  <td>
                    <input 
                      type="number" 
                      min="1"
                      value={item.quantity} 
                      onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                    />
                  </td>
                  <td>{(item.gia * item.quantity).toLocaleString()}đ</td>
                  <td>
                    <button onClick={() => removeFromCart(item.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng cộng:</td>
                <td colSpan="2" style={{ fontWeight: 'bold' }}>{totalSum.toLocaleString()}đ</td>
              </tr>
            </tbody>
          </table>
          <Link to="/payment">
            <button className="btn btn-checkout">Thanh toán</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;