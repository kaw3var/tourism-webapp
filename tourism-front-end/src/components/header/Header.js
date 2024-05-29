import React from "react";
import headerlogo from "./../../img/headerlogo.png";


const Header = () => {
    return (  
        <header className="header">
            <div className="header__nav">
                <div className="nav__logo">
                    <img src={headerlogo} className="nav__img" alt="japan logo"/>
                </div>
                <nav className="nav-link">
                    <a href="/" className="nav-link__item">Главная</a>
                    <a href="/clients" className="nav-link__item">Клиенты</a>
                    <a href="/book-tour" className="nav-link__item">Запись на тур</a>
                    {/* <Link to="/" className="nav-link__item">Главная</Link>
                    <Link to="/profile" className="nav-link__item">Профиль</Link>
                    <Link to="/tour-book" className="nav-link__item">Записаться на тур</Link> */}
                </nav>
            </div>
            <div className="header__banner">
                {/* <img src="https://cf.youtravel.me/tr:w-1980%2Ch-400/upload/iblock/5b5/7yfukyzv0yejw0flwzlnip6kk12btegg.jpg" className="header__img"/> */}
            </div>
        </header>
    );
}
 
export default Header;