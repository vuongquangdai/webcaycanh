// frontend/src/pages/AdminEditProduct.js

/**
 * @fileOverview Trang chỉnh sửa sản phẩm của admin.
 * Cho phép hiển thị và chỉnh sửa thông tin sản phẩm từ bảng data.
 */

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../api';
import '../index.css';

function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (loading) return;

    api.get(`/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => {
        console.error(err);
        toast.error("Lỗi tải sản phẩm!");
      });
  }, [id, user, loading, navigate]);

  const handleUpdate = () => {
    setUpdating(true);
    api.put(`/api/admin/products/${id}`, product) // Giả sử bạn tạo API sửa sản phẩm admin
      .then(() => {
        toast.success("Cập nhật sản phẩm thành công!");

        api.get('/api/products')
        .then(res => {
          localStorage.setItem("products", JSON.stringify(res.data));
        })
        .catch(err => {
          console.error(err);
          toast.error("Lỗi cập nhật cache sản phẩm!");
        });

        navigate('/admin?tab=products');
      })
      .catch(err => {
        console.error(err);
        toast.error("Lỗi cập nhật sản phẩm!");
      })
      .finally(() => setUpdating(false));
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="admin-edit-product-container">
      <h2>Chỉnh sửa sản phẩm</h2>
      <div className="admin-edit-product-card">
        <div className="form-group">
          <label>Tên cây:</label>
          <input 
            readOnly
            type="text"
            value={product.ten_cay}
            // onChange={e => setProduct({ ...product, ten_cay: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Tên khoa học:</label>
          <input 
            type="text"
            value={product.ten_khoa_hoc}
            onChange={e => setProduct({ ...product, ten_khoa_hoc: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Đặc điểm:</label>
          <textarea
            value={product.dac_diem}
            onChange={e => setProduct({ ...product, dac_diem: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Ý nghĩa phong thủy:</label>
          <textarea
            value={product.y_nghia_phong_thuy}
            onChange={e => setProduct({ ...product, y_nghia_phong_thuy: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Lợi ích:</label>
          <textarea
            value={product.loi_ich}
            onChange={e => setProduct({ ...product, loi_ich: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Giá:</label>
          <input 
            type="number"
            value={product.gia}
            onChange={e => setProduct({ ...product, gia: e.target.value })}
          />
        </div>
        <button className="btn admin-submit-btn" onClick={handleUpdate} disabled={updating}>
          {updating ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
        </button>
      </div>
    </div>
  );
}

export default AdminEditProduct;
