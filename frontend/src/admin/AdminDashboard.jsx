import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/analytics', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          if (res.status === 401) {
            navigate('/login');
          }
          setStats({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [user, navigate]);

  const cardStyle = {
    padding: '25px',
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(12px)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    boxShadow: 'var(--glow-shadow)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '10px',
    transition: 'var(--transition-smooth)'
  };

  const numberStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'var(--accent-cyan)',
    textShadow: '0 0 10px var(--accent-cyan-glow)'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '5px' }}>
        <img src="/AuraMartLogo.svg" alt="Logo" style={{ height: '40px', width: '40px', borderRadius: '8px', objectFit: 'cover', filter: 'drop-shadow(0 0px 10px rgba(168, 85, 247, 0.3))' }} />
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
      </div>
      <p style={{ color: '#a1a1aa', marginBottom: '30px', fontSize: '1.1rem' }}>Welcome back, <span style={{color: '#fff'}}>{user?.name}</span></p>
      
      {stats ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={cardStyle}>
            <h4 style={{ color: '#a1a1aa', fontSize: '1rem' }}>Total Orders</h4>
            <div style={numberStyle}>{stats.totalOrders}</div>
          </div>
          <div style={cardStyle}>
            <h4 style={{ color: '#a1a1aa', fontSize: '1rem' }}>Total Products</h4>
            <div style={numberStyle}>{stats.totalProducts}</div>
          </div>
          <div style={cardStyle}>
            <h4 style={{ color: '#a1a1aa', fontSize: '1rem' }}>Total Users</h4>
            <div style={numberStyle}>{stats.totalUsers}</div>
          </div>
          <div style={cardStyle}>
            <h4 style={{ color: '#a1a1aa', fontSize: '1rem' }}>Total Revenue</h4>
            <div style={numberStyle}>₹{stats.totalRevenue.toFixed(2)}</div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', margin: '50px 0', color: 'var(--accent-purple)' }}>Loading metrics...</div>
      )}

      <div style={{ marginTop: '40px', padding: '30px', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--glow-shadow)' }}>
        <h3 style={{ marginBottom: '25px', color: 'var(--accent-purple)', textShadow: '0 0 10px var(--accent-purple-glow)' }}>Administrative Controls</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => navigate('/admin/add-product')}>+ Add Product</button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/products')}>📦 Manage Products</button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/orders')}>🚚 Manage Orders</button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/users')}>👥 Users Directory</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
