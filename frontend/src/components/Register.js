import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    address: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // ✅ හරියාකාර URL එක: /auth/register/patient
      const response = await API.post('/auth/register/patient', formData);
      
      // AuthResponse object එකක් එන නිසා success message එකක් පෙන්වමු
      setMessage('Registration Successful!');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed! Please try again.');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-lg border-0 rounded-3 mt-3">
          <div className="card-body p-4">
            <h3 className="text-center text-primary fw-bold mb-4">Patient Registration</h3>

            {message && <div className="alert alert-success">{message} Redirecting to login...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label font-weight-bold">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Pasindu Perera"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="pasindu@gmail.com"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0771234567"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    name="age"
                    className="form-control"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Blood Group</label>
                  <select
                    name="bloodGroup"
                    className="form-select"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  className="form-control"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Colombo, Sri Lanka"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
                Register Patient
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;