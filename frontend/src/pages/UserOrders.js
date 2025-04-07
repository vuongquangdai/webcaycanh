// frontend/src/pages/UserOrders.js

/**
 * @fileOverview Trang hiển thị danh sách đơn hàng của người dùng.
 * Lấy thông tin đơn hàng dựa trên idGoogle của người dùng.
 */

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../api';
import '../index.css';

const statusMapping = {
  paid: "Đã thanh toán",
  cancelled: "Đã bị hủy",
  pending: "Đang chờ thanh toán"
};

const UserOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      toast.error("Bạn chưa đăng nhập!");
      return;
    }
    if (!user) return;

    api.get(`/api/orders/user/${user.idGoogle}`)
      .then(res => {
        const data = res.data.reverse();
        setOrders(data)
      })
      .catch(err => {
        console.error(err);
        toast.error("Lỗi tải đơn hàng");
      });
  }, [user]);

  const toggleOrderDetail = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
    if (!orderDetails[orderId]) {
      api.get(`/api/orders/details/${orderId}`)
        .then(res => {
          const items = res.data;
          Promise.all(
            items.map(item =>
              api.get(`/api/products/${item.product_id}`)
                .then(productRes => ({
                  ...item,
                  ten_cay: productRes.data.ten_cay
                }))
            )
          ).then(updatedItems => {
            setOrderDetails(prev => ({
              ...prev,
              [orderId]: updatedItems
            }));
          });
        })
        .catch(err => {
          console.error(err);
          toast.error("Lỗi tải chi tiết đơn hàng");
        });
    }
  };

  return (
    <div className="order">
      <h1>Đơn hàng của bạn</h1>
      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <ul className="order-list">
          {orders.map(order => (
            <li key={order.id} className="order-item">
              <div 
                className="order-summary" 
                onClick={() => toggleOrderDetail(order.id)}
              >
                <div>
                  <strong>Order Code:</strong> {order.order_code}
                </div>
                <div>
                  <strong>Tổng tiền:</strong> {Number(order.total_amount).toLocaleString()}đ
                </div>
                <div>
                  <strong>Trạng thái thanh toán:</strong> {statusMapping[order.status] || order.status}
                </div>
                <div>
                  <strong>Trạng thái đơn hàng:</strong> {order.status_detail || "Chưa cập nhật"}
                </div>
                <div>
                  <strong>Ngày đặt:</strong> {new Date(order.created_at).toLocaleString()}
                </div>
              </div>
              <div className={`order-details ${expandedOrders[order.id] ? 'expanded' : ''}`}>
                {orderDetails[order.id] ? (
                  <table className="order-details-table">
                    <thead>
                      <tr>
                        <th>Tên cây</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails[order.id].map((item, index) => (
                        <tr key={index}>
                          <td>{item.ten_cay}</td>
                          <td>{Number(item.price).toLocaleString()}đ</td>
                          <td>{item.quantity}</td>
                          <td>{(item.price * item.quantity).toLocaleString()}đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  expandedOrders[order.id] && <p>Đang tải chi tiết...</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserOrders;