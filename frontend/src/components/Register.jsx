import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/api';
import "./Register.css";
import "./AuthBgOverride.css";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [showWorkOptions, setShowWorkOptions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    category: "",
  });

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setShowWorkOptions(selectedRole === "worker");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        role,
        category: role === "worker" ? formData.category : undefined,
      };

      const res = await api.post('/auth/register', form);
      alert(res.data.message);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        category: "",
      });
      setRole("");
      setShowWorkOptions(false);
      navigate("/"); // go to login
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        <select value={role} onChange={handleRoleChange} required>
          <option value="">Select Role</option>
          <option value="customer">Customer</option>
          <option value="worker">Worker</option>
        </select>
        {showWorkOptions && (
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Work Type</option>
            <option value="plumbing">Plumber</option>
            <option value="gardening">Gardener</option>
            <option value="babysitting">Babysitter</option>
            <option value="electric">Electric</option>
            <option value="househelp">House Help</option>
          </select>
        )}
        <button type="submit">Register</button>
        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default Register;
