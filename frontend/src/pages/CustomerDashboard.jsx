import React from 'react';
import Navbar from '../components/Navbar';
import Slideshow from '../components/Slideshow';
import ServiceGrid from '../components/ServiceGrid';

const CustomerDashboard = () => {
  return (
    <div style={{ backgroundColor: "#CFFFE2", minHeight: "100vh" }}>
      <Navbar />
      <Slideshow />
      <ServiceGrid />
    </div>
  );
};

export default CustomerDashboard;
