import React, { useState, useEffect } from 'react';
import axios from 'axios'

const Main = () => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    fetchRouteCosts();
  }, [])

  const fetchRouteCosts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/route-costs');
      setRoute(response.data);
    } catch(error) {
      console.error('Error fatching route costs', error)
    }
  };

  return (  
    <div className="container">
      <div className="list-tour">
        <h1 className="list-tour__title">Туры по культурной и традиционной Японии</h1>
        <div className="list-tour__card">
          {route.map((route, index) =>(
            <div className="card" key={index}>
            <div className="card__photo">
              <img src={route.RouteImg} className="card__img" loading="lazy" alt="Nara"/>
            </div>
            <p className="card__name">{route.RouteName}</p>
            <p className="card__price">{route.RoutePrice}¥</p>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 
export default Main;