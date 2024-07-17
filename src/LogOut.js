import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Eliminar los datos del usuario del localStorage
        localStorage.removeItem('user');

        // Redirigir al usuario a la página de inicio de sesión
        navigate('/login');
    };

    return (
        <Button variant="contained" color="secondary" onClick={handleLogout}>
            { "Cerrar Sesión".replace(/�/g, 'í') }
        </Button>
    );
};

export default LogoutButton;