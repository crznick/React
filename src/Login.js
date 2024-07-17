import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
//import { useHistory } from 'react-router-dom';
const Login = () => {
    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    //const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://bytes507.mywire.org:4000/usuarios');
            const usuarios = response.data;

            const usuario = usuarios.find(user => user.correo === correo && user.contrasena === pass);

            if (usuario) {
                localStorage.setItem('user', JSON.stringify(usuario));
                if (usuario.rol === 'administrador') {
                    //history.push('/app2');
                } else if (usuario.rol === 'profesor') {
                    //history.push('/app1');
                }
            } else {
                setError('Correo o contraseña incorrectos');
            }
        } catch (error) {
            setError('Error al conectar con el servicio');
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
                <form>
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