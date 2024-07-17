import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('user');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // Verificar si el usuario está autenticado y tiene el rol correcto
    if (isAuthenticated && storedUser) {
        if (rest.role === 'administrador' && storedUser.rol === 'administrador') {
            return <Element {...rest} />;
        } else if (rest.role === 'profesor' && storedUser.rol === 'profesor') {
            return <Element {...rest} />;
        } else {
            return <Navigate to="/login" />;
        }
    } else {
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;