import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    //## Uso de variables de entorno para facilitar la dockerización
    const API_URL = process.env.REACT_APP_API_URL;
    const USUARIOS = `${API_URL}/usuarios`;
    const LOGIN =  `${API_URL}/login`
    const navigate = useNavigate();

    //Iniciar sesión
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(LOGIN,
                {
                    correo: correo,
                    password: pass
                }
            );

            const usuario = response.data;

            localStorage.setItem('user', JSON.stringify(usuario));

            if (usuario.rol === 'administrador') {
                navigate('/Administrador');
            } else if (usuario.rol === 'profesor') {
                navigate('/Profesores');
            }

        } catch (error) {

            setError('Correo o contraseña incorrectos');

        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ marginTop: '-10px' }}>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
            >
                <img src="/color1_128.png" alt="Logo" style={{ width: '100px', marginBottom: '20px' }} />
                <Typography component="h1" variant="h5" sx={{ color: "#4b2e83" }}>
                    {"Préstamo de Equipos".replace(/�/g, 'í')}
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <form onSubmit={handleSubmit} >
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Correo"
                        name="correo"
                        autoComplete="email"
                        autoFocus
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name={"contraseña".replace(/�/g, 'í')}
                        label={"Contraseña".replace(/�/g, 'í')}
                        type="password"
                        autoComplete="current-password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Iniciar sesión
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Login;