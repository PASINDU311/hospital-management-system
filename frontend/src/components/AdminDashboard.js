import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'users'
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'DOCTOR',
    department: 'Cardiology',
    contact: '',
    password: ''
  });

  // Users List State
  const [users, setUsers] = useState([
    {
      id: 'UID-948271',
      name: 'Dr. Sarah Jenkins',
      role: 'Senior Attending',
      roleCategory: 'DOCTOR',
      department: 'Cardiology',
      contact: 'ext. 4022',
      email: 's.jenkins@omni.health',
      status: 'Active',
      avatar: '👩‍⚕️'
    },
    {
      id: 'UID-883210',
      name: 'Marcus Rodriguez',
      role: 'Charge Nurse',
      roleCategory: 'NURSE',
      department: 'Emergency (ER)',
      contact: 'ext. 1190',
      email: 'm.rodriguez@omni.health',
      status: 'On Leave',
      avatar: '👨‍⚕️'
    },
    {
      id: 'UID-761102',
      name: 'Elena Rostova',
      role: 'Lab Technician II',
      roleCategory: 'PHARMACIST',
      department: 'Pathology',
      contact: 'ext. 3314',
      email: 'e.rostova@omni.health',
      status: 'Active',
      avatar: '👩‍🔬'
    }
  ]);

  const handleAddUser = (e) => {
    e.preventDefault();
    const createdUser = {
      id: `UID-${Math.floor(100000 + Math.random() * 900000)}`,
      name: newUser.name,
      role: newUser.role === 'DOCTOR' ? 'Specialist Consultant' : newUser.role,
      roleCategory: newUser.role,
      department: newUser.department,
      contact: newUser.contact || 'ext. 2210',
      email: newUser.email,
      status: 'Active',
      avatar: newUser.role === 'DOCTOR' ? '👨‍⚕️' : '👤'
    };

    setUsers([createdUser, ...users]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'DOCTOR', department: 'Cardiology', contact: '', password: '' });
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || u.roleCategory === roleFilter;
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
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={styles.main}>
        {/* Top Header Bar */}
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
          /* ================= DASHBOARD VIEW ================= */
          <div>
            <div style={styles.pageTitleRow}>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Hospital Management System</h2>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Real-time operational metrics for General Hospital Central.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={styles.btnSecondary}>📅 Today, Oct 24</button>
                <button style={styles.btnPrimaryHead}>📥 Export Report</button>
              </div>
            </div>

            {/* Top Stat Cards */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div>
                  <span style={styles.cardLabel}>TOTAL PATIENTS</span>
                  <h1 style={styles.cardVal}>1,248</h1>
                  <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: 'bold' }}>↗ +12% vs last week</span>
                  <p style={styles.cardSub}><strong>842</strong> Active | <strong>406</strong> New</p>
                </div>
                <div style={{ ...styles.cardIconBox, background: '#eff6ff', color: '#2563eb' }}>♿</div>
              </div>

              <div style={styles.statCard}>
                <div>
                  <span style={styles.cardLabel}>ACTIVE STAFF</span>
                  <h1 style={styles.cardVal}>342</h1>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>— Stable capacity</span>
                  <p style={styles.cardSub}><strong>120</strong> Docs | <strong>222</strong> Nurses/Techs</p>
                </div>
                <div style={{ ...styles.cardIconBox, background: '#faf5ff', color: '#9333ea' }}>🏥</div>
              </div>

              <div style={styles.statCard}>
                <div>
                  <span style={styles.cardLabel}>WARD OCCUPANCY</span>
                  <h1 style={styles.cardVal}>87%</h1>
                  <div style={styles.progressBg}><div style={{ ...styles.progressFill, width: '87%' }}></div></div>
                  <p style={styles.cardSub}><strong>435</strong> Occupied | <strong>65</strong> Available</p>
                </div>
                <div style={{ ...styles.cardIconBox, background: '#fef2f2', color: '#dc2626' }}>🛏️</div>
              </div>

              <div style={styles.statCard}>
                <div>
                  <span style={styles.cardLabel}>TODAY'S BILLING</span>
                  <h1 style={styles.cardVal}>$142k</h1>
                  <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: 'bold' }}>↗ +5.2% vs avg</span>
                  <p style={styles.cardSub}><strong>85%</strong> Processed | <strong>15%</strong> Pending</p>
                </div>
                <div style={{ ...styles.cardIconBox, background: '#f0fdf4', color: '#16a34a' }}>💵</div>
              </div>
            </div>

            {/* Middle Grid */}
            <div style={styles.middleGrid}>
              {/* Department Status */}
              <div style={styles.card}>
                <div style={styles.cardHeaderFlex}>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>Department Status</h3>
                  <a href="#details" style={{ color: '#2563eb', fontSize: '13px', textDecoration: 'none' }}>View Details &gt;</a>
                </div>

                <div style={styles.deptBox}>
                  <div style={styles.deptHead}>
                    <strong style={{ color: '#0f172a' }}>💥 Emergency Room (ER)</strong>
                    <span style={{ background: '#fee2e2', color: '#991b1b', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>HIGH TRAFFIC</span>
                  </div>
                  <div style={styles.deptStats3}>
                    <div><span style={{ fontSize: '12px', color: '#64748b' }}>Avg Wait</span><h4 style={{ margin: '4px 0 0 0' }}>45m</h4></div>
                    <div><span style={{ fontSize: '12px', color: '#64748b' }}>Patients</span><h4 style={{ margin: '4px 0 0 0' }}>32</h4></div>
                    <div><span style={{ fontSize: '12px', color: '#64748b' }}>Staff on Duty</span><h4 style={{ margin: '4px 0 0 0' }}>14</h4></div>
                  </div>
                </div>

                <div style={{ ...styles.deptBox, marginTop: '15px' }}>
                  <div style={styles.deptHead}>
                    <strong style={{ color: '#0f172a' }}>✂️ Surgery & OR</strong>
                    <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>OPTIMAL</span>
                  </div>
                  <div style={styles.deptStats3}>
                    <div><span style={{ fontSize: '12px', color: '#64748b' }}>OR Active</span><h4 style={{ margin: '4px 0 0 0' }}>8/10</h4></div>
                    <div><span style={{ fontSize: '12px', color: '#64748b' }}>Scheduled</span><h4 style={{ margin: '4px 0 0 0' }}>24</h4></div>
                    <div><span style={{ fontSize: '12px', color: '#64748b' }}>Delays</span><h4 style={{ margin: '4px 0 0 0' }}>0</h4></div>
                  </div>
                </div>
              </div>

              {/* Critical Activity Feed */}
              <div style={styles.card}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Critical Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ background: '#fee2e2', padding: '8px', borderRadius: '50%' }}>⚠️</span>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>Blood Inventory Critical (O-)</strong>
                      <p style={{ margin: '2px 0', fontSize: '12px', color: '#64748b' }}>Blood bank reporting less than 10 units of O-Negative.</p>
                      <small style={{ color: '#94a3b8' }}>10 mins ago</small>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ background: '#eff6ff', padding: '8px', borderRadius: '50%' }}>👥</span>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>Mass Casualty Protocol Inactive</strong>
                      <p style={{ margin: '2px 0', fontSize: '12px', color: '#64748b' }}>Standard trauma admission procedures restored.</p>
                      <small style={{ color: '#94a3b8' }}>45 mins ago</small>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ background: '#faf5ff', padding: '8px', borderRadius: '50%' }}>🔄</span>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>EHR System Sync Complete</strong>
                      <p style={{ margin: '2px 0', fontSize: '12px', color: '#64748b' }}>Daily patient records successfully synchronized.</p>
                      <small style={{ color: '#94a3b8' }}>2 hours ago</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div style={styles.card}>
              <div style={styles.cardHeaderFlex}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>On-Call Staff Roster</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ ...styles.pill, background: '#2563eb', color: 'white' }}>Doctors</button>
                  <button style={{ ...styles.pill, background: '#f1f5f9', color: '#64748b' }}>Nurses</button>
                </div>
              </div>
              <div style={styles.rosterGrid}>
                <div style={styles.rosterCard}>
                  <span style={{ fontSize: '24px' }}>👩‍⚕️</span>
                  <div>
                    <strong style={{ fontSize: '14px' }}>Dr. Sarah Jenkins</strong>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Cardiology</p>
                  </div>
                </div>
                <div style={styles.rosterCard}>
                  <span style={{ fontSize: '24px' }}>👨‍⚕️</span>
                  <div>
                    <strong style={{ fontSize: '14px' }}>Dr. Marcus Chen</strong>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Neurology</p>
                  </div>
                </div>
                <div style={{ ...styles.rosterCard, opacity: 0.7 }}>
                  <span style={{ fontSize: '24px' }}>👩‍⚕️</span>
                  <div>
                    <strong style={{ fontSize: '14px' }}>Dr. Emily Rostova</strong>
                    <p style={{ margin: 0, fontSize: '12px', color: '#dc2626' }}>In Surgery (Unavailable)</p>
                  </div>
                </div>
                <button style={styles.btnAddRoster} onClick={() => { setActiveTab('users'); setShowAddModal(true); }}>
                  + Manage Roster / Add User
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ================= USER MANAGEMENT VIEW ================= */
          <div>
            <div style={styles.pageTitleRow}>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>All Users</h2>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Manage staff accounts, roles, and access permissions across all departments.</p>
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
                    placeholder="Search name or ID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '180px' }}
                  />
                </div>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={styles.selectInput}>
                  <option value="All Roles">All Roles</option>
                  <option value="DOCTOR">Doctors</option>
                  <option value="PHARMACIST">Pharmacists</option>
                  <option value="NURSE">Nurses</option>
                </select>
                <select style={styles.selectInput}><option>All Departments</option></select>
                <select style={styles.selectInput}><option>Any Status</option></select>
                <button style={styles.btnClearFilters} onClick={() => { setSearchTerm(''); setRoleFilter('All Roles'); }}>Clear Filters</button>
              </div>

              <div style={styles.activeStaffBadge}>
                <div>
                  <span style={{ fontSize: '10px', color: '#bfdbfe', fontWeight: 'bold' }}>TOTAL ACTIVE STAFF</span>
                  <h2 style={{ margin: 0, color: 'white', fontSize: '22px' }}>{filteredUsers.length}</h2>
                </div>
                <div style={{ fontSize: '24px' }}>👥</div>
              </div>
            </div>

            {/* Users Table */}
            <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                    <th style={styles.th}>Name & ID</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Contact</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <span style={{ fontSize: '24px', background: '#f1f5f9', padding: '6px', borderRadius: '50%' }}>{user.avatar}</span>
                          <div>
                            <strong style={{ color: '#0f172a' }}>{user.name}</strong>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.rolePill}>{user.role}</span>
                      </td>
                      <td style={styles.td}>{user.department}</td>
                      <td style={styles.td}>
                        <div>{user.contact}</div>
                        <small style={{ color: '#64748b' }}>{user.email}</small>
                      </td>
                      <td style={styles.td}>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                          background: user.status === 'Active' ? '#dcfce7' : '#fef3c7',
                          color: user.status === 'Active' ? '#15803d' : '#b45309'
                        }}>
                          {user.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button style={styles.btnAction}>✏️</button>
                        <button style={{ ...styles.btnAction, color: '#dc2626' }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add User Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Add New Hospital User</h3>
            <form onSubmit={handleAddUser}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input type="text" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="e.g. Dr. Nimal Perera" style={styles.inputModal} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address (For Login)</label>
                <input type="email" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="doctor@hospital.com" style={styles.inputModal} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>System Role</label>
                  <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} style={styles.inputModal}>
                    <option value="DOCTOR">Doctor</option>
                    <option value="PHARMACIST">Pharmacist</option>
                    <option value="NURSE">Nurse</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Department</label>
                  <input type="text" value={newUser.department} onChange={e => setNewUser({...newUser, department: e.target.value})} placeholder="Cardiology" style={styles.inputModal} />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Temporary Password</label>
                <input type="password" required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="******" style={styles.inputModal} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={styles.btnCancel}>Cancel</button>
                <button type="submit" style={styles.btnSave}>Create User Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// 100% Inline Styles object (No External CSS File Needed)
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
  cardSub: { fontSize: '12px', color: '#64748b', marginTop: '8px' },
  cardIconBox: { padding: '12px', borderRadius: '10px', fontSize: '20px' },
  progressBg: { background: '#f1f5f9', height: '6px', borderRadius: '3px', margin: '10px 0', width: '120px' },
  progressFill: { background: '#dc2626', height: '100%', borderRadius: '3px' },
  middleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' },
  card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' },
  cardHeaderFlex: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  deptBox: { background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #f1f5f9' },
  deptHead: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  deptStats3: { display: 'flex', justifyContent: 'space-between', textAlign: 'center' },
  pill: { border: 'none', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' },
  rosterGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' },
  rosterCard: { background: '#f8fafc', padding: '12px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' },
  btnAddRoster: { background: 'white', border: '1px dashed #2563eb', color: '#2563eb', borderRadius: '8px', padding: '12px', fontWeight: 'bold', cursor: 'pointer' },
  btnAddUserBlue: { background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  filterCard: { background: 'white', padding: '15px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  filterSearch: { background: '#f8fafc', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px' },
  selectInput: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' },
  btnClearFilters: { background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' },
  activeStaffBadge: { background: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '10px', display: 'flex', gap: '15px', alignItems: 'center' },
  th: { textAlign: 'left', padding: '12px 20px', color: '#64748b', fontSize: '12px' },
  td: { padding: '16px 20px', fontSize: '14px' },
  rolePill: { background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' },
  btnAction: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', marginRight: '8px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalBox: { background: 'white', padding: '30px', borderRadius: '12px', width: '450px' },
  formGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '12px', fontWeight: 'bold', color: '#475569' },
  inputModal: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' },
  btnSave: { background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  btnCancel: { background: '#e2e8f0', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }
};

export default AdminDashboard;