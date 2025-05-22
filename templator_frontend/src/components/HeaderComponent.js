import React from "react";
import { Link } from "react-router-dom";

const HeaderComponent = () => {
    return (
        <header>
            <nav className="navbar p-0">
                <div className="container-fluid">
                    <div className="d-flex justify-content-sm-between justify-content-around align-items-sm-center w-100">
                        <div className="d-flex flex-column flex-sm-row justify-content-start align-items-center">
                            <Link to="/templatesList"><img src="/images/logo.png" alt="Logo de la aplicación" width="100" height="90" /> </Link>
                            <h2 className="texto-aplicacion font-weight-bold mb-3 mb-lg-0 mb-md-0 mb-sm-0 ml-md-3 text-center text-md-left">
                                Demo Hotels
                            </h2>
                        </div>

                        <div className="navegacion d-flex mb-2 mb-lg-0 mb-md-0 mb-sm-0">
                            <ul className="navbar-nav d-flex flex-column flex-sm-row align-items-center flex-wrap justify-content-end">
                                <li className="nav-item">
                                    <a className="nav-link">
                                        <i className="bi bi-info-circle mx-2"></i>Ayuda
                                    </a>
                                </li>
                                <li className="nav-item ms-3">
                                    <a className="nav-link">
                                        <i className="bi bi-lock mx-2"></i>Contraseña
                                    </a>
                                </li>
                                <li className="nav-item ms-3">
                                    <a className="nav-link">
                                        <i className="bi bi-box-arrow-right mx-2"></i>Cerrar sesión
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default HeaderComponent;
