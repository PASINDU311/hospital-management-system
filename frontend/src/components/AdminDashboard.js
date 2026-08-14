import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Your Axios instance

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // New User Form State
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    role: 'DOCTOR',
    phone: '',
    password: ''
  });

  // Users List State (Fetched from Real DB)
  const [users, setUsers] = useState([]);

  // Fetch Real Users on Component Mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Create User directly to Backend Database
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/users', {
        fullName: newUser.fullName,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        phone: newUser.phone,
        active: true
      });

      setUsers([res.data, ...users]); // Append new DB record
      setShowAddModal(false);
      setNewUser({ fullName: '', email: '', role: 'DOCTOR', phone: '', password: '' });
      alert('User successfully created!');
    } catch (err) {
      alert('Failed to create user: ' + (err.response?.data?.message || err.message));
    }
  };

  // Helper Avatar Generator
  const getAvatar = (role) => {
    if (role === 'DOCTOR') return '👨‍⚕️';
    if (role === 'PHARMACIST') return '👩‍🔬';
    if (role === 'ADMIN') return '👨‍💼';
    return '👤';
  };

  const filteredUsers = users.filter(u => {
    const nameMatch = u.fullName ? u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const emailMatch = u.email ? u.email.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const matchesSearch = nameMatch || emailMatch;
    const matchesRole = roleFilter === 'All Roles' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.brand}>
            <div style={styles.brandLogo}>✚</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>MediAdmin Pro</h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>General Hospital Central</p>
            </div>
          </div>

          <nav style={styles.nav}>
            <button
              style={{ ...styles.navBtn, ...(activeTab === 'dashboard' ? styles.navBtnActive : {}) }}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 <span>Dashboard</span>
            </button>
            <button
              style={{ ...styles.navBtn, ...(activeTab === 'users' ? styles.navBtnActive : {}) }}
              onClick={() => setActiveTab('users')}
            >
              👥 <span>User Management</span>
            </button>
            <button style={styles.navBtn}>🏢 <span>Departments</span></button>
            <button style={styles.navBtn} onClick={() => navigate('/appointments')}>📅 <span>Appointments</span></button>
            <button style={styles.navBtn}>🛏️ <span>Wards & Beds</span></button>
            <button style={styles.navBtn}>🏥 <span>Admissions</span></button>
            <button style={styles.navBtn} onClick={() => navigate('/pharmacy')}>💊 <span>Pharmacy</span></button>
            <button style={styles.navBtn}>🔬 <span>Laboratory</span></button>
            <button style={styles.navBtn}>💵 <span>Billing</span></button>
            <button style={styles.navBtn}>📈 <span>Reports</span></button>
          </nav>
        </div>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '15px' }}>
          <button style={styles.navBtn}>🔔 <span>Notifications</span></button>
          <button style={styles.navBtn}>⚙️ <span>Settings</span></button>
          <div style={styles.profile} onClick={() => { localStorage.clear(); navigate('/login'); }}>
            <div style={{ fontSize: '24px' }}>👨‍💼</div>
            <div>
              <strong style={{ fontSize: '13px', color: '#fff' }}>Admin Avatar</strong>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Logout</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.searchGlobal}>
            🔍 <input type="text" placeholder="Search patients, staff, or records..." style={styles.searchInput} />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button style={styles.iconCircle}>❓</button>
            <button style={styles.iconCircle}>🌐</button>
            <button style={styles.iconCircle}>🌙</button>
            <div style={styles.topAvatar}>👨‍💼</div>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <div>
            <div style={styles.pageTitleRow}>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Hospital Management System</h2>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Real-time operational metrics for General Hospital Central.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={styles.btnSecondary}>📅 Today</button>
                <button style={styles.btnPrimaryHead}>📥 Export Report</button>
              </div>
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div>
                  <span style={styles.cardLabel}>TOTAL USERS IN SYSTEM</span>
                  <h1 style={styles.cardVal}>{users.length}</h1>
                  <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: 'bold' }}>Live DB Data</span>
                </div>
                <div style={{ ...styles.cardIconBox, background: '#eff6ff', color: '#2563eb' }}>👥</div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= USER MANAGEMENT VIEW ================= */
          <div>
            <div style={styles.pageTitleRow}>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>All Users (Database)</h2>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Manage real system accounts from MySQL DB.</p>
              </div>
              <button style={styles.btnAddUserBlue} onClick={() => setShowAddModal(true)}>
                👤+ Add New User
              </button>
            </div>

            {/* Filter Bar */}
            <div style={styles.filterCard}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={styles.filterSearch}>
                  🔍 <input
                    type="text"
                    placeholder="Search name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '180px' }}
                  />
                </div>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={styles.selectInput}>
                  <option value="All Roles">All Roles</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="PHARMACIST">Pharmacist</option>
                  <option value="PATIENT">Patient</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <button style={styles.btnClearFilters} onClick={() => { setSearchTerm(''); setRoleFilter('All Roles'); }}>Clear Filters</button>
              </div>

              <div style={styles.activeStaffBadge}>
                <div>
                  <span style={{ fontSize: '10px', color: '#bfdbfe', fontWeight: 'bold' }}>TOTAL ACTIVE USERS</span>
                  <h2 style={{ margin: 0, color: 'white', fontSize: '22px' }}>{filteredUsers.length}</h2>
                </div>
                <div style={{ fontSize: '24px' }}>👥</div>
              </div>
            </div>

            {/* Users Table */}
            <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
              {loading ? (
                <div style={{ padding: '30px', textAlign: 'center' }}>Loading Database Users...</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                      <th style={styles.th}>User ID</th>
                      <th style={styles.th}>Full Name</th>
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Contact Info</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={styles.td}>#USR-{u.id}</td>
                          <td style={styles.td}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <span style={{ fontSize: '20px', background: '#f1f5f9', padding: '6px', borderRadius: '50%' }}>{getAvatar(u.role)}</span>
                              <div>
                                <strong style={{ color: '#0f172a' }}>{u.fullName}</strong>
                              </div>
                            </div>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.rolePill}>{u.role}</span>
                          </td>
                          <td style={styles.td}>
                            <div>{u.email}</div>
                            <small style={{ color: '#64748b' }}>{u.phone || 'No phone'}</small>
                          </td>
                          <td style={styles.td}>
                            <span style={{
                              padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                              background: u.active ? '#dcfce7' : '#fee2e2',
                              color: u.active ? '#15803d' : '#991b1b'
                            }}>
                              {u.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No users found in Database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Add User Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Add New User to DB</h3>
            <form onSubmit={handleAddUser}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input type="text" required value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} placeholder="e.g. Dr. Nimal Perera" style={styles.inputModal} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input type="email" required value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="doctor@hospital.com" style={styles.inputModal} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>System Role</label>
                  <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} style={styles.inputModal}>
                    <option value="DOCTOR">Doctor</option>
                    <option value="PHARMACIST">Pharmacist</option>
                    <option value="PATIENT">Patient</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input type="text" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} placeholder="0771234567" style={styles.inputModal} />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <input type="password" required value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="******" style={styles.inputModal} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={styles.btnCancel}>Cancel</button>
                <button type="submit" style={styles.btnSave}>Save to Database</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles remain identical
const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" },
  sidebar: { width: '260px', backgroundColor: '#1e293b', color: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 15px' },
  brand: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' },
  brandLogo: { background: '#2563eb', color: 'white', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' },
  nav: { display: 'flex', flexDirection: 'column', gap: '6px' },
  navBtn: { background: 'transparent', border: 'none', color: '#cbd5e1', padding: '10px 14px', textAlign: 'left', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', cursor: 'pointer' },
  navBtnActive: { backgroundColor: '#334155', color: '#38bdf8', fontWeight: 'bold' },
  profile: { display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 0', cursor: 'pointer' },
  main: { flex: 1, overflowY: 'auto', padding: '25px 35px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  searchGlobal: { background: 'white', border: '1px solid #e2e8f0', padding: '8px 15px', borderRadius: '20px' },
  searchInput: { border: 'none', outline: 'none', width: '320px', marginLeft: '8px' },
  iconCircle: { background: 'white', border: '1px solid #e2e8f0', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' },
  topAvatar: { fontSize: '20px', background: '#e2e8f0', padding: '6px', borderRadius: '50%' },
  pageTitleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  btnSecondary: { background: 'white', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  btnPrimaryHead: { background: '#2563eb', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' },
  statCard: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLabel: { fontSize: '11px', fontWeight: 'bold', color: '#64748b', letterSpacing: '0.5px' },
  cardVal: { fontSize: '30px', margin: '6px 0', color: '#0f172a' },
  cardIconBox: { padding: '12px', borderRadius: '10px', fontSize: '20px' },
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' },
  btnAddUserBlue: { background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  filterCard: { background: 'white', padding: '15px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  filterSearch: { background: '#f8fafc', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px' },
  selectInput: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' },
  btnClearFilters: { background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' },
  activeStaffBadge: { background: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '10px', display: 'flex', gap: '15px', alignItems: 'center' },
  th: { textAlign: 'left', padding: '12px 20px', color: '#64748b', fontSize: '12px' },
  td: { padding: '16px 20px', fontSize: '14px' },
  rolePill: { background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalBox: { background: 'white', padding: '30px', borderRadius: '12px', width: '450px' },
  formGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '12px', fontWeight: 'bold', color: '#475569' },
  inputModal: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' },
  btnSave: { background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  btnCancel: { background: '#e2e8f0', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }
};

export default AdminDashboard;