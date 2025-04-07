// frontend/src/pages/AdminDashboard.js

/**
 * @fileOverview Trang quản trị cho admin
 * Bao gồm hai chức năng chính: kiểm soát đơn hàng và quản lý sản phẩm
 */

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../api';
import '../index.css';

const statusMapping = {
  paid: "Đã thanh toán",
  cancelled: "Đã bị hủy",
  pending: "Đang chờ thanh toán"
};

function AdminDashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [orderDetails, setOrderDetails] = useState({});

  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    ten_cay: "",
    ten_khoa_hoc: "",
    dac_diem: "",
    y_nghia_phong_thuy: "",
    loi_ich: "",
    gia: ""
  });
  const [imageFiles, setImageFiles] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      toast.error("Bạn chưa đăng nhập!");
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      toast.error("Bạn không có quyền truy cập trang admin!");
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/admin?tab=${tab}`);
  };

  const fetchOrders = () => {
    api.get('/api/admin/orders')
      .then(res => {
        const data = res.data.reverse();
        setOrders(data)
      })
      .catch(err => {
        console.error(err);
        toast.error("Lỗi tải đơn hàng!");
      });
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success("Cập nhật trạng thái thành công");
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi cập nhật trạng thái đơn hàng!");
    }
  };

  const fetchProducts = () => {
    api.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error(err);
        toast.error("Lỗi tải sản phẩm!");
      });
  };

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
    try {
      await api.delete(`/api/admin/products/${productId}`);
      toast.success("Xóa sản phẩm thành công!");
      const res = await api.get('/api/products');
      setProducts(res.data);
      localStorage.setItem("products", JSON.stringify(res.data));
    } catch (error) {
      console.error(error);
      toast.error("Lỗi xóa sản phẩm!");
    }
  };
  

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('ten_cay', productForm.ten_cay);
    formData.append('ten_khoa_hoc', productForm.ten_khoa_hoc);
    formData.append('dac_diem', productForm.dac_diem);
    formData.append('y_nghia_phong_thuy', productForm.y_nghia_phong_thuy);
    formData.append('loi_ich', productForm.loi_ich);
    formData.append('gia', productForm.gia);
    if (imageFiles) {
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
      }
    }
    try {
      await api.post('/api/admin/products', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Thêm sản phẩm thành công!");
      setProductForm({
        ten_cay: "",
        ten_khoa_hoc: "",
        dac_diem: "",
        y_nghia_phong_thuy: "",
        loi_ich: "",
        gia: ""
      });
      setImageFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchProducts();
      const res = await api.get('/api/products');
      setProducts(res.data);
      localStorage.setItem("products", JSON.stringify(res.data));
    } catch (error) {
      console.error(error);
      toast.error("Lỗi thêm sản phẩm!");
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => handleTabChange('orders')}
        >
          Kiểm soát đơn hàng
        </button>
        <button
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => handleTabChange('products')}
        >
          Quản lý sản phẩm
        </button>
        <button
          className={`admin-tab ${activeTab === 'addproducts' ? 'active' : ''}`}
          onClick={() => handleTabChange('addproducts')}
        >
          Thêm sản phẩm
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="admin-order-control">
          <h2>Kiểm soát đơn hàng</h2>
          {orders.length === 0 ? (
            <p>Không có đơn hàng nào.</p>
          ) : (
            <ul className="order-list">
              {orders.map(order => (
                <li key={order.id} className="order-item">
                  <div 
                    className="order-summary-details" 
                    onClick={() => toggleOrderDetail(order.id)}
                  >
                    <div className="order-summary">
                      <div>
                        <strong>Order Code:</strong> {order.order_code}
                      </div>
                      <div>
                        <strong>Tổng tiền:</strong> {Number(order.total_amount).toLocaleString()}đ
                      </div>
                      <div>
                        <strong>Trạng thái:</strong> {statusMapping[order.status] || order.status}
                      </div>
                      <div>
                        <strong>Ngày đặt:</strong> {new Date(order.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="order-status-update">
                      <select
                        defaultValue={order.status_detail || order.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={e => handleUpdateStatus(order.id, e.target.value)}
                      >
                        <option value="Chưa được xác nhận">Chưa được xác nhận</option>
                        <option value="Xác nhận">Xác nhận</option>
                        <option value="Đã bàn giao cho vận chuyển">Đã bàn giao cho vận chuyển</option>
                        <option value="Đã giao">Đã giao</option>
                      </select>
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
      )}

      {activeTab === 'addproducts' && (
        <div className="admin-product-management">
          <div className="admin-add-product">
            <h3>Thêm sản phẩm mới</h3>
            <form onSubmit={handleAddProduct} encType="multipart/form-data">
              <div className="form-group">
                <label>Tên cây:</label>
                <input
                  type="text"
                  value={productForm.ten_cay}
                  onChange={e => setProductForm({ ...productForm, ten_cay: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tên khoa học:</label>
                <input
                  type="text"
                  value={productForm.ten_khoa_hoc}
                  onChange={e => setProductForm({ ...productForm, ten_khoa_hoc: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Đặc điểm:</label>
                <textarea
                  value={productForm.dac_diem}
                  onChange={e => setProductForm({ ...productForm, dac_diem: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Ý nghĩa phong thủy:</label>
                <textarea
                  value={productForm.y_nghia_phong_thuy}
                  onChange={e => setProductForm({ ...productForm, y_nghia_phong_thuy: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Lợi ích:</label>
                <textarea
                  value={productForm.loi_ich}
                  onChange={e => setProductForm({ ...productForm, loi_ich: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Giá:</label>
                <input
                  type="number"
                  value={productForm.gia}
                  onChange={e => setProductForm({ ...productForm, gia: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tải ảnh sản phẩm:</label>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  onChange={e => setImageFiles(e.target.files)}
                  required
                />
              </div>
              <button type="submit" className="btn admin-submit-btn">
                Thêm sản phẩm
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="admin-product-management">
          <div className="admin-product-list">
            <h3>Danh sách sản phẩm</h3>
            {products.length === 0 ? (
              <p>Không có sản phẩm nào.</p>
            ) : (
              <table className="admin-products-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên cây</th>
                    <th>Tên khoa học</th>
                    <th>Giá</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.ten_cay}</td>
                      <td>{product.ten_khoa_hoc}</td>
                      <td>{Number(product.gia).toLocaleString()}đ</td>
                      <td className='admin-btn-td'>
                        <Link to={`/admin/edit-product/${product.id}?tab=products`} className="btn admin-edit-btn">
                          Chỉnh sửa
                        </Link>
                        <button onClick={() => handleDeleteProduct(product.id)} className="btn admin-delete-btn">
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;