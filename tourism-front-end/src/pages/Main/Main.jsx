import React from 'react';
import useMain from './lib/useMain';

const Main = () => {
  const {
    route,
  } = useMain();
  
  return (  
    <div className="container">
      <div className="list-tour">
        <h1 className="list-tour__title">Туры по культурной и традиционной Японии</h1>
        <div className="list-tour__card">
          {route.map((route, index) =>(
            <div className="card" key={index}>
            <div className="card__photo">
              <img src={route.RouteImg} className="card__img" loading="lazy" alt={route.RouteName}/>
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