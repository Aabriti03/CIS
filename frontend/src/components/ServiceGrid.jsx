import React from "react";
import "./ServiceGrid.css";
import babysittingImg from "../assets/babysitting.png";
import electricImg from "../assets/electric.png";
import gardeningImg from "../assets/gardening.png";
import househelpImg from "../assets/househelp.png";
import plumbingImg from "../assets/plumbing.png";
import { useNavigate } from "react-router-dom";

const services = [
  { title: "Babysitting", image: babysittingImg },
  { title: "Electric", image: electricImg },
  { title: "Gardening", image: gardeningImg },
  { title: "House Help", image: househelpImg },
  { title: "Plumbing", image: plumbingImg },
];

const ServiceGrid = () => {
  const navigate = useNavigate();

  // Map display titles to the slug used in the route
  const categoryMap = {
    Babysitting: "babysitting",
    Electric: "electric",
    Gardening: "gardening",
    "House Help": "househelp",
    Plumbing: "plumbing",
  };

  const handleClick = (serviceTitle) => {
    const category = categoryMap[serviceTitle];
    // Navigate to a dynamic route that includes the category
    navigate(`/service/${category}`);
  };

  return (
    <div className="service-grid-wrapper">
      <div className="service-grid">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="service-card"
            onClick={() => handleClick(service.title)}
          >
            <img src={service.image} alt={service.title} />
            <h3>{service.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceGrid;
