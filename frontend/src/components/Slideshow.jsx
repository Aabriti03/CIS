import React, { useState, useEffect } from 'react';
import './Slideshow.css';
import plumbing from '../assets/plumbing.png';
import househelp from '../assets/househelp.png';
import electric from '../assets/electric.png';
import babysitting from '../assets/babysitting.png';
import gardening from '../assets/gardening.png';

const images = [plumbing, househelp, electric, babysitting, gardening];

const Slideshow = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="slideshow">
      <img src={images[index]} alt="Service Slide" />
    </div>
  );
};

export default Slideshow;
