import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, TextField, Card, CardContent, Button, Typography,
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, AppBar, Toolbar, IconButton, Drawer, List,
    ListItem, ListItemText, Divider, MenuItem, Select, FormControl,
    InputLabel, Table, TableContainer,TableHead, TableBody, TableCell,
    TableRow, Modal, Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutButton from './LogOut';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const App = () => {
    const SOLICITUDES = "https://express-caz6.onrender.com/solicitudes";
    const EQUIPOS = "https://express-caz6.onrender.com/equipos";
    const USUARIOS = "https://express-caz6.onrender.com/usuarios";

    const [equipos, setEquipos] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [seccionActiva, setSeccionActiva] = useState('solicitudes');
    const [marbeteEquipo, setMarbeteEquipo] = useState('');
    const [descripcionEquipo, setDescripcionEquipo] = useState('');
    const [noHaySolicitudes, setNoHaySolicitudes] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedEquipo, setSelectedEquipo] = useState(null);
    const [newDescripcion, setNewDescripcion] = useState('');
    const [selectedDelete, setSelectedDelete] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [rolUsuario, setRolUsuario] = useState('');
    const [correoUsuario, setCorreoUsuario] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [confirmacionModal, setConfirmacionModal] = useState('');
    const [nombreUsuarioMod, setNombreUsuarioMod] = useState('');
    const [rolUsuarioMod, setRolUsuarioMod] = useState('');
    const [showId, setShowId] = useState(false);
    const storedUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchSolicitudes();
        fetchEquipos();
        fetchHistorial();
        setCorreo(storedUser.correo);
        fetchUsuarios();
    }, []);

    //Función para obtener todos los usuarios creados
    const fetchUsuarios = async () => {
        try {
            const response = await axios.get(USUARIOS);
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al consultar los usuarios:', error);
        }
    };

    //Función para obtener todos los equipos creados
    const fetchEquipos = async () => {
        try {
            const response = await axios.get(EQUIPOS);
            setEquipos(response.data);
        } catch (error) {
            console.error('Error al consultar los equipos:', error);
        }
    };

    //Filtro de todos los equipos
    const equiposFiltrados = equipos.filter(equipo =>
        equipo.descripcion.toLowerCase().includes(filtroNombre.toLowerCase())
    );

    //Función para traer todas las solicitudes
    const fetchSolicitudes = async () => {
        try {
            const response = await axios.get(SOLICITUDES);

            //Filtrar y ordenar las solicitudes
            const solicitudesFiltradas = response.data.filter(solicitud =>
                solicitud.estado === 'PENDIENTE' || solicitud.estado === 'APROBADO'
            ).sort((a, b) => {
                //Ordenar para que los PENDIENTE estén arriba
                if (a.estado === 'PENDIENTE' && b.estado !== 'PENDIENTE') return -1;
                if (a.estado !== 'PENDIENTE' && b.estado === 'PENDIENTE') return 1;
                return 0;
            });

            setSolicitudes(solicitudesFiltradas);
        } catch (error) {
            console.error('Error al consultar las solicitudes:', error);
        }
    };

    const fetchHistorial = async () => {
        try {
            const response = await axios.get(SOLICITUDES);

            if (!response) {
                setNoHaySolicitudes(true);
            }
            //Ordenar las solicitudes por _id
            const solicitudesOrdenadas = response.data.sort((a, b) => {
                //Ordenar por _id ascendente
                return a._id.localeCompare(b._id);
            });

            setHistorial(solicitudesOrdenadas);
        } catch (error) {
            console.error('Error al consultar las solicitudes:', error);
        }
    };

    //Función filtrar por nombre
    const handleFiltroNombreChange = (event) => {
        setFiltroNombre(event.target.value);
    };

    //Función para cerrar el modal de confirmación
    const handleConfirmationClose = () => {
        setConfirmationOpen(false);
    };

    //Función para cambiar el estado de una solicitud
    const cambiarEstadoSolicitud = async (id, marbete, nuevoEstado) => {
        try {
            const response = await axios.post(`${SOLICITUDES}/${id}`, {
                marbete: marbete,
                encargado: procesarCorreo(correo),
                estado: nuevoEstado,
            });
            if (response.status === 200) {
                setConfirmationMessage(`Solicitud ${nuevoEstado.toLowerCase()} correctamente.`);
                await fetchSolicitudes();
                await fetchHistorial();
            } else {
                setConfirmationMessage('Error al cambiar el estado de la solicitud.');
            }
            setConfirmationOpen(true);
        } catch (error) {
            setConfirmationMessage('Error al cambiar el estado de la solicitud.');
            setConfirmationOpen(true);
        }
    };

    //Función para generar el nombre apartir del correo
    const procesarCorreo = (correo) => {
        let nombreUsuario = correo.split('@')[0];
        nombreUsuario = nombreUsuario.replace(/[^a-zA-Z\s.]/g, '');

        let nombreSeparado = nombreUsuario.split('.');
        let nombreFinal = nombreSeparado.map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1)).join(' ');
        return nombreFinal;
    };

    //Función para abrir y cerrar el menu lateral
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    //Elementos del menu lateral, se cierra al seleccionar otra sección
    const drawerList = (
        <List sx={{ color: 'rgba(25,118,210,1)' }} >
            <ListItem button onClick={() => { setSeccionActiva('solicitudes'); setDrawerOpen(false); }}>
                <ListItemText primary="Lista de Solicitudes" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => { setSeccionActiva('agregarEquipos'); setDrawerOpen(false); }}>
                <ListItemText primary="Agregar Equipos" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => { setSeccionActiva('todosLosEquipos'); setDrawerOpen(false); }}>
                <ListItemText primary="Lista de Equipos" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => { setSeccionActiva('historialSolicitud'); setDrawerOpen(false); }}>
                <ListItemText primary="Historial" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => { setSeccionActiva('agregarUsuarios'); setDrawerOpen(false); }}>
                <ListItemText primary="Agregar Usuarios" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => { setSeccionActiva('administrarUsuarios'); setDrawerOpen(false); }}>
                <ListItemText primary="Administrar Usuarios" />
            </ListItem>
            <Divider />
            <ListItem>
                <LogoutButton />
            </ListItem>
        </List>
    );

    //Función para agregar equipos
    const handleAgregarEquipos = async () => {
        try {
            const response = await axios.post(EQUIPOS, {
                descripcion: descripcionEquipo,
                marbete: marbeteEquipo,
            });
            if (response.status === 200) {
                setConfirmationMessage('Equipo guardado correctamente.');
                setDescripcionEquipo('');
                setMarbeteEquipo('');
                await fetchSolicitudes();
                await fetchHistorial();
                await fetchEquipos();
                setSeccionActiva('todosLosEquipos');
                setDrawerOpen(false);
            } else {
                setConfirmationMessage(`Error al guardar el equipo. Código de error: ${response.status}`);
                setDescripcionEquipo('');
                setMarbeteEquipo('');
            }
            setConfirmationOpen(true);
        } catch (error) {
            console.error('Error al guardar el equipo:', error);
            setConfirmationMessage('Error al guardar el equipo.');
            setConfirmationOpen(true);
            setDescripcionEquipo('');
            setMarbeteEquipo('');
        }
    };

    //Funciones para abrir y cerrar los modales de modificar y borrar equipos
    const handleEditOpen = (equipo) => {
        setSelectedEquipo(equipo);
        setNewDescripcion(equipo.descripcion);
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
    };

    const handleDeleteOpen = (equipo) => {
        setSelectedEquipo(equipo);
        setSelectedDelete(equipo.descripcion)
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
    };

    //Función para modificar equipos
    const handleEditSave = async () => {
        try {
            const response = await axios.put(`${EQUIPOS}/${selectedEquipo._id}`, {
                descripcion: newDescripcion
            });
            if (response.status === 200) {
                setConfirmationMessage('Equipo modificado correctamente.');
                await fetchEquipos();
            } else {
                setConfirmationMessage(`Error al modificar el equipo. Código de error: ${response.status}`);
            }
            setEditOpen(false);
            setConfirmationOpen(true);
        } catch (error) {
            console.error('Error al modificar el equipo:', error);
            setConfirmationMessage('Error al modificar el equipo.');
            setEditOpen(false);
            setConfirmationOpen(true);
        }
    };

    //Función para borrar equipos
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete(`${EQUIPOS}/remove/${selectedEquipo._id}`);
            if (response.status === 200) {
                setConfirmationMessage('Equipo eliminado correctamente.');
                await fetchEquipos();
            } else {
                setConfirmationMessage(`Error al eliminar el equipo. Código de error: ${response.status}`);
            }
            setDeleteOpen(false);
            setConfirmationOpen(true);
        } catch (error) {
            console.error('Error al eliminar el equipo:', error);
            setConfirmationMessage('Error al eliminar el equipo.');
            setDeleteOpen(false);
            setConfirmationOpen(true);
        }
    };

    //Funcion para guardar usuarios
    const handleAgregarUsuarios = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(USUARIOS, {
                correo: correoUsuario,
                rol: rolUsuario,
                nombre: nombreUsuario,
            });
            if (response.status === 200) {
                setConfirmationMessage('Usuario agregado correctamente.');
                await fetchUsuarios();
                setCorreoUsuario('');
                setNombreUsuario('');
                setRolUsuario('');
                setSeccionActiva('administrarUsuarios');
            } else {
                setConfirmationMessage('Error al agregar el usuario.');
            }
            setConfirmationOpen(true);
        } catch (error) {
            setConfirmationMessage('Error al conectar con el servicio.');
            setConfirmationOpen(true);
        }
    };
    //Funcion para editar usuarios
    const handleEditarUsuario = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${USUARIOS}/${(usuarioSeleccionado.correo)}`, {
                rol: rolUsuarioMod,
                nombre: nombreUsuarioMod,
            });
            if (response.status === 200) {
                setConfirmationMessage('Usuario modificado correctamente.');
                setModalEditar(false);
                setConfirmationOpen(true);
                await fetchUsuarios();
                setSeccionActiva('administrarUsuarios');
            } else {
                setConfirmationMessage('Error al modificar el usuario.');
                setConfirmationOpen(true);
            }
        } catch (error) {
            setConfirmationMessage('Error al conectar con el servicio.');
            setConfirmationOpen(true);
        }
    };

    //Funcion para borrar usuarios
    const handleEliminarUsuario = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.delete(`${USUARIOS}/${usuarioSeleccionado.correo}`);
            if (response.status === 200) {
                setConfirmationMessage('Usuario eliminado correctamente.');
                setModalEliminar(false);
                setConfirmationOpen(true);
                await fetchUsuarios();
                setSeccionActiva('administrarUsuarios');
            } else {
                setConfirmationMessage('Error al eliminar el usuario.');
                setConfirmationOpen(true);
            }
        } catch (error) {
            setConfirmationMessage('Error al conectar con el servicio.');
            setConfirmationOpen(true);
        }
    };

    const openEditarModal = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setNombreUsuarioMod(usuario.nombre);
        setRolUsuarioMod(usuario.rol);
        setModalEditar(true);
    };

    const openEliminarModal = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setModalEliminar(true);
    };

    // Estado para controlar la visibilidad del _id que utilzamos de contraseña
    const toggleShowId = () => {
        setShowId(!showId);
    };

    //Función para mostrar la sección seleccionada, por defecto esta la de solicitudes
    const renderSeccionActiva = () => {
        switch (seccionActiva) {
            case 'solicitudes':
                //Filtrar solicitudes por nombre, se pudiera cambiar por otros parametros pero por nombre está bien
                const solicitudesFiltradas = solicitudes.filter(solicitud =>
                    solicitud.equipo && solicitud.equipo.toLowerCase().includes(filtroNombre.toLowerCase())
                );
                return (
                    <div>
                        <Typography variant="h4" gutterBottom sx={{ marginTop: '100px' }}>Lista de Solicitudes</Typography>
                        <TextField
                            label="Buscar por nombre"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={filtroNombre}
                            onChange={handleFiltroNombreChange}
                        />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                            {solicitudesFiltradas.map(solicitud => (
                                <Card key={solicitud._id} sx={{ width: '100%', maxWidth: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6">{solicitud.equipo}</Typography>
                                        <Typography variant="body2" color="textSecondary">Estado: {solicitud.estado}</Typography>
                                        <Typography variant="body2" color="textSecondary">Encargado: {solicitud.encargado}</Typography>
                                        <Typography variant="body2" color="textPrimary">Solicitante: {procesarCorreo(solicitud.correo)}</Typography>
                                        {solicitud.estado === 'PENDIENTE' && (
                                            <div>
                                                <Button
                                                    onClick={() => cambiarEstadoSolicitud(solicitud._id, solicitud.marbete, 'APROBADO') }
                                                    variant="contained"
                                                    color="primary"
                                                    style={{ marginTop: '8px', marginRight: '8px' }}
                                                >
                                                    Aprobar
                                                </Button>
                                                <Button
                                                    onClick={() => cambiarEstadoSolicitud(solicitud._id, solicitud.marbete, 'NO_APROBADO') }
                                                    variant="contained"
                                                    color="secondary"
                                                    style={{ marginTop: '8px' }}
                                                >
                                                    Rechazar
                                                </Button>
                                            </div>
                                        )}
                                        {solicitud.estado === 'APROBADO' && (
                                            <Button
                                                onClick={() => cambiarEstadoSolicitud(solicitud._id, solicitud.marbete, 'RETORNADO') }
                                                variant="contained"
                                                color="primary"
                                                style={{ marginTop: '8px' }}
                                            >
                                                Marcar como retornado
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                );
            case 'agregarEquipos':
                return (
                    <div>
                        <Typography variant="h4" gutterBottom sx={{ marginTop: '100px' }}>Agregar Equipos</Typography>
                        <TextField
                            label="Marbete"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={marbeteEquipo}
                            onChange={(e) => setMarbeteEquipo(e.target.value)}
                        />
                        <TextField
                            label="Nombre del Equipo"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={descripcionEquipo}
                            onChange={(e) => setDescripcionEquipo(e.target.value)}
                        />
                        <Button
                            onClick={handleAgregarEquipos}
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '8px' }}
                        >
                            Agregar
                        </Button>
                    </div>
                );
            case 'todosLosEquipos':
                return (
                    <div>
                        <Typography variant="h4" gutterBottom sx={{ marginTop: '100px' }}>Lista de Equipos</Typography>
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
                                        <Typography variant="h12">{equipo._id}</Typography>
                                        <Typography variant="h6">{equipo.descripcion}</Typography>
                                        <Typography variant="h10">Marbete: {equipo.marbete}</Typography>
                                        <Typography variant="body2" color="#4f237f">{equipo.estado}</Typography>
                                        {equipo.estado === 'DISPONIBLE' && (
                                            <div>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleEditOpen(equipo)}
                                                >
                                                    Modificar
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleDeleteOpen(equipo)}
                                                    style={{ marginLeft: '10px' }}
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                );
            case 'historialSolicitud':
                return (
                    <div>
                        <Typography variant="h4" gutterBottom sx={{ marginTop: '100px' }}>Historial de Solicitudes</Typography>
                        {noHaySolicitudes ? (
                            <Typography variant="body1">No hay solicitudes realizadas para este correo.</Typography>
                        ) : (
                            historial.map((historial, index) => (
                                <Card key={index} sx={{ width: '100%', maxWidth: '100%', marginTop: '16px' }}>
                                    <CardContent>
                                        <Typography variant="h6">{historial.equipo}</Typography>
                                        <Typography variant="body2" color="textSecondary">Correo: {historial.correo}</Typography>
                                        <Typography variant="body2" color="textSecondary">Marbete: {historial.marbete}</Typography>
                                        <Typography variant="body2" color="textPrimary">Estado: {historial.estado}</Typography>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                );
            case 'agregarUsuarios':
                return (
                    <div>
                        <Typography variant="h4" gutterBottom sx={{ marginTop: '100px' }}>Agregar Usuarios</Typography>
                        <form onSubmit={handleAgregarUsuarios}>
                        <TextField
                            label="Nombre completo"
                            required
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={nombreUsuario}
                            onChange={(e) => setNombreUsuario(e.target.value)}
                        />
                        <TextField
                            label="Correo"
                            required
                            type="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={correoUsuario}
                            onChange={(e) => setCorreoUsuario(e.target.value)}
                        />
                        <FormControl variant="outlined" fullWidth margin="normal">
                            <InputLabel id="rol-label">Rol de Usuario</InputLabel>
                            <Select
                                labelId="rol-label"
                                required
                                value={rolUsuario}
                                onChange={(e) => setRolUsuario(e.target.value)}
                                label="Rol de Usuario"
                            >
                                <MenuItem value="administrador">Administrador</MenuItem>
                                <MenuItem value="profesor">Profesor</MenuItem>
                                <MenuItem value="deshabilitado">Deshabilitado</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '8px' }}
                        >
                            Agregar
                        </Button>
                        </form>
                    </div>
                );
            case 'administrarUsuarios':
                return (
                    <div>
                        <Typography variant="h4" gutterBottom sx={{ marginTop: '100px' }}>
                            Administrar Usuarios
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Correo</TableCell>
                                        <TableCell>Rol</TableCell>
                                        <TableCell>Contraseña
                                            <Tooltip title={showId ? 'Ocultar' : 'Mostrar'}>
                                                <IconButton onClick={toggleShowId}>
                                                    {showId ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {usuarios.map((usuario) => (
                                        <TableRow key={usuario.correo}>
                                            <TableCell>{usuario.nombre}</TableCell>
                                            <TableCell>{usuario.correo}</TableCell>
                                            <TableCell>{usuario.rol}</TableCell>
                                            <TableCell>
                                                {showId ? (
                                                    usuario._id // Mostrar el _id en texto plano
                                                ) : (
                                                    // Mostrar el _id enmascarado
                                                    '••••••••••••••••••••••••••••••••'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    onClick={() => openEditarModal(usuario)}
                                                    variant="contained"
                                                    color="secondary"
                                                    sx={{ marginRight: 1 }}
                                                >
                                                    Modificar
                                                </Button>
                                                <Button
                                                    onClick={() => openEliminarModal(usuario)}
                                                    variant="contained"
                                                    color="error"
                                                >
                                                    Eliminar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Modal open={modalEditar} onClose={() => setModalEditar(false)}>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', minWidth: '300px' }}>
                                <Typography variant="h6">Modificar Usuario</Typography>
                                <form onSubmit={handleEditarUsuario}>
                                    <TextField
                                        label="Nombre completo"
                                        required
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={nombreUsuarioMod}
                                        onChange={(e) => setNombreUsuarioMod(e.target.value)}
                                    />
                                    <FormControl variant="outlined" fullWidth margin="normal">
                                        <InputLabel id="rol-label">Rol de Usuario</InputLabel>
                                        <Select
                                            labelId="rol-label"
                                            required
                                            value={rolUsuarioMod}
                                            onChange={(e) => setRolUsuarioMod(e.target.value)}
                                            label="Rol de Usuario"
                                        >
                                            <MenuItem value="administrador">Administrador</MenuItem>
                                            <MenuItem value="profesor">Profesor</MenuItem>
                                            <MenuItem value="deshabilitado">Deshabilitado</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button type="submit" variant="contained" color="primary">
                                        Guardar cambios
                                    </Button>
                                </form>
                            </div>
                        </Modal>
                        <Modal open={modalEliminar} onClose={() => setModalEliminar(false)}>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', minWidth: '300px' }}>
                                <Typography variant="h6">Eliminar Usuario</Typography>
                                <Typography>Para confirmar, escriba "eliminar":</Typography>
                                <TextField
                                    required
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={confirmacionModal}
                                    onChange={(e) => setConfirmacionModal(e.target.value)}
                                />
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    disabled={confirmacionModal.toLowerCase() !== 'eliminar'}
                                    onClick={handleEliminarUsuario}
                                >
                                    Confirmar Eliminación
                                </Button>
                            </div>
                        </Modal>
                        <Modal open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', minWidth: '300px' }}>
                                <Typography variant="h6">Confirmación</Typography>
                                <Typography>{confirmationMessage}</Typography>
                                <Button onClick={() => setConfirmationOpen(false)}>Cerrar</Button>
                            </div>
                        </Modal>
                    </div>
                );
            default:
                return null;
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
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Administrar Equipos
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" sx={{ marginBottom: '20px' }}>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                    {drawerList}
            </Drawer>
                {renderSeccionActiva()}
            </Container>
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
            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle>Modificar Equipo</DialogTitle>
                <DialogContent>
                    <br/>
                    <TextField
                        label="Descripción"
                        value={newDescripcion}
                        onChange={(e) => setNewDescripcion(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="primary">Cancelar</Button>
                    <Button onClick={handleEditSave} color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteOpen} onClose={handleDeleteClose}>
                <DialogTitle>Eliminar {selectedDelete} </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        { "Está seguro de que desea eliminar este equipo?".replace(/�/g, 'í') }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} color="primary">Cancelar</Button>
                    <Button onClick={handleDeleteConfirm} color="primary">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
//Exportar App
export default App;