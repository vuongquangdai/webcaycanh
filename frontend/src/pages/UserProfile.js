// frontend/src/pages/UserProfile.js

/**
 * @fileOverview Trang hồ sơ người dùng.
 * Hiển thị thông tin cá nhân và cho phép cập nhật số điện thoại, địa chỉ và email.
 */

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import '../index.css';

function UserProfile() {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: '',
    role: ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    
    setProfile({
      displayName: user.displayName || '',
      email: user.email || '',
      phone: '',
      address: '',
      role: user.role || ''
    });
    
    api.get(`/api/users/${user.idGoogle}`)
      .then(res => {
        if (res.data) {
          setProfile(prev => ({
            ...prev,
            phone: res.data.phone || '',
            address: res.data.address || ''
          }));
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("Lỗi tải thông tin người dùng!");
      });
  }, [user, loading, navigate]);

  const handleUpdate = () => {
    if (!/^\d{10,11}$/.test(profile.phone)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }
    setUpdating(true);
    api.put(`/api/users/${user.idGoogle}`, {
      phone: profile.phone,
      address: profile.address,
      email: profile.email
    })
      .then(() => {
        toast.success("Cập nhật thông tin thành công!");
      })
      .catch(err => {
        console.error(err);
        toast.error("Lỗi cập nhật thông tin!");
      })
      .finally(() => setUpdating(false));
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Thông tin cá nhân</h2>
        <div className="profile-info">
          <div className="profile-field">
            <label>Tên:</label>
            <p>{profile.displayName}</p>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <p>{profile.email}</p>
          </div>
          <div className="profile-field">
            <label>Số điện thoại:</label>
            <input 
              type="text"
              value={profile.phone}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div className="profile-field">
            <label>Địa chỉ:</label>
            <input 
              type="text"
              value={profile.address}
              onChange={e => setProfile({ ...profile, address: e.target.value })}
              placeholder="Nhập địa chỉ"
            />
          </div>
        </div>
        <div className='profile-btn'>
          <button 
            className="profile-update-btn"
            onClick={handleUpdate}
            disabled={updating}
          >
            {updating ? "Đang cập nhật..." : "Cập nhật thông tin"}
          </button>
          {profile.role === 'admin' && (
            <Link to="/admin" className="admin-btn">
              Admin
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;