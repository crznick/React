import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, TextField, Card, CardContent, Button,
    Typography, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Drawer, List, ListItem,
    ListItemText, IconButton, AppBar, Toolbar, Divider, 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const App = () => {
    const [equipos, setEquipos] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [correo, setCorreo] = useState('eusebio.mendoza@utp.ac.pa.com');
    const [open, setOpen] = useState(false);
    const [selectedEquipo, setSelectedEquipo] = useState(null);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [solicitudes, setSolicitudes] = useState([]);
    const [noHaySolicitudes, setNoHaySolicitudes] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mostrarEquipos, setMostrarEquipos] = useState(true);

    useEffect(() => {
        fetchEquipos();
        fetchSolicitudes();
    }, []);

    //Función para obtener todos los equipos disponibles
    const fetchEquipos = async () => {
        try {
            const response = await axios.get('https://express-3ede.onrender.com/equipos');
            setEquipos(response.data);
        } catch (error) {
            console.error('Error al traer información de equipos:', error);
        }
    };

    //Función para obtener las solicitudes realizadas por el correo específico
    const fetchSolicitudes = async () => {
        try {
            const response = await axios.get('https://express-3ede.onrender.com/solicitudes', {
                params: { correo }
            });
            if (response.data.length === 0) {
                setNoHaySolicitudes(true);
            } else {
                // Filtrar las solicitudes para mostrar solo las del correo específico
                const solicitudesFiltradas = response.data.filter(solicitud => solicitud.correo === correo);
                setSolicitudes(solicitudesFiltradas);
                setNoHaySolicitudes(solicitudesFiltradas.length === 0);
            }
        } catch (error) {
            console.error('Error al encontrar las solicitudes:', error);
        }
    };

    //Función para manejar el cambio en el filtro por nombre
    const handleFiltroNombreChange = (event) => {
        setFiltroNombre(event.target.value);
    };

    //Esta función permite filtrar los valores traidos anteriormente para poder filtrarlos por otro campo, en este caso el nombre "descripcion", pero ssolo los disponibles
    const equiposFiltrados = equipos.filter(equipo =>
        equipo.descripcion.toLowerCase().includes(filtroNombre.toLowerCase()) &&
        equipo.estado.toLowerCase() === 'disponible'
    );

    //Función para abrir el modal de reserva
    const handleOpenModal = (equipo) => {
        setSelectedEquipo(equipo);
        setOpen(true);
    };

    //Función para cerrar el modal de reserva
    const handleCloseModal = () => {
        setOpen(false);
        setSelectedEquipo(null);
    };

    //Función para cerrar el modal de confirmación después de una reserva
    const handleConfirmationClose = () => {
        setConfirmationOpen(false);
    };

    //Función para reservar un equipo
    const reservarEquipo = async () => {
        if (!selectedEquipo) return;
        const { descripcion, marbete } = selectedEquipo;
        try {
            const response = await axios.post('https://express-3ede.onrender.com/solicitudes', {
                correo,
                equipo: descripcion,
                marbete: marbete,
            });
            if (response.status === 200) {
                setConfirmationMessage('Solicitud enviada correctamente.');
                //Actualizar la lista de solicitudes después de una reserva exitosa
                await fetchSolicitudes();
                //Actualizar la lista de equipos después de una reserva exitosa
                await fetchEquipos();
            } else {
                setConfirmationMessage('Error al crear la reserva.');
            }
            handleCloseModal();
            setConfirmationOpen(true);
        } catch (error) {
            setConfirmationMessage('El servicio no responde.');
            handleCloseModal();
            setConfirmationOpen(true);
        }
    };

    return (
        <div style={{ overflowX: 'hidden' }}>
            <AppBar position="fixed" style={{ left: 0, right: 0 }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => setMenuOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Prestamo de Equipos
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
            >
                 <List sx={{ color: 'rgba(25,118,210,1)' }} >
                    <ListItem button onClick={() => { setMostrarEquipos(true); setMenuOpen(false); }}>
                        <ListItemText primary="Lista de Equipos" />
                    </ListItem>
                    <Divider/>
                    <ListItem button onClick={() => { setMostrarEquipos(false); setMenuOpen(false); }}>
                        <ListItemText primary="Solicitudes Realizadas" />
                    </ListItem>
                    <Divider />
                </List>
            </Drawer>

            <Container maxWidth="md" sx={{ marginBottom: '20px' }}>
                {mostrarEquipos && (
                    <div>
                        <Typography variant="h4" gutterBottom sx={{ marginTop: '100px' }}>Equipos Disponibles</Typography>
                        <TextField
                            label="Buscar por nombre"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={filtroNombre}
                            onChange={handleFiltroNombreChange}
                        />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
                            {equiposFiltrados.map(equipo => (
                                <Card key={equipo._id} sx={{ width: '100%', maxWidth: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6">{equipo.descripcion}</Typography>
                                        <Typography variant="body2" color="textSecondary">Estado: {equipo.estado}</Typography>
                                        <Button onClick={() => handleOpenModal(equipo)} variant="contained" color="primary" style={{ marginTop: '8px'}}>
                                            Reservar
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {!mostrarEquipos && (
                    <div>
                        <Typography variant="h4" gutterBottom sx={{ marginTop: '100px' }}>Solicitudes Realizadas</Typography>
                        {noHaySolicitudes ? (
                            <Typography variant="body1">No hay solicitudes realizadas para este correo.</Typography>
                        ) : (
                            solicitudes.map((solicitud, index) => (
                                <Card key={index} sx={{ width: '100%', maxWidth: '100%', marginTop: '16px' }}>
                                    <CardContent>
                                        <Typography variant="h6">{solicitud.equipo}</Typography>
                                        <Typography variant="body2" color="textSecondary">Correo: {solicitud.correo}</Typography>
                                        <Typography variant="body2" color="textSecondary">Marbete: {solicitud.marbete}</Typography>
                                        <Typography variant="body2" color="textPrimary">Estado: {solicitud.estado}</Typography>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                <Dialog open={open} onClose={handleCloseModal}>
                    <DialogTitle>Confirmar Reserva</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {`¿Estás seguro de que deseas reservar el equipo ${selectedEquipo?.descripcion.replace(/�/g, 'í')}?`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={reservarEquipo} color="primary">
                            Aceptar
                        </Button>
                        <Button onClick={handleCloseModal} color="secondary">
                            Cancelar
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={confirmationOpen} onClose={handleConfirmationClose}>
                    <DialogTitle>Resultado de la Solicitud</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {confirmationMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmationClose} color="primary">
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </div>
    );
};
//Exportar App
export default App;