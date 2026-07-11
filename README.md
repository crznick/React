# Sistema de Préstamo de Equipos

Aplicación web diseñada para la gestión, reserva y administración de equipos en la Universidad. El sistema permite la autenticación diferenciada por roles (Administrador y Profesor), facilitando el control de inventario y el seguimiento de solicitudes.

## Características Principales

* **Autenticación Segura**: Sistema de login con validación de credenciales y redireccionamiento basado en roles.
* **Gestión de Inventario**: Visualización de equipos disponibles y capacidad de filtrado por nombre.
* **Sistema de Reservas**: Interfaz para realizar solicitudes de préstamo, con confirmación mediante modales.
* **Panel de Usuario**: Seguimiento de solicitudes realizadas, permitiendo a los usuarios verificar el estado de sus pedidos.
* **Administración**: Módulos dedicados para la edición y eliminación de registros de equipo.

## Tecnologías Utilizadas

* **Frontend**: React.js, Material UI (MUI).
* **Comunicación**: Axios para el consumo de la API REST.
* **Enrutamiento**: React Router DOM para la navegación entre vistas.

## Configuración y Ejecución

### Variables de Entorno
La aplicación utiliza una variable de entorno para gestionar la conexión con el backend de manera dinámica:

* `REACT_APP_API_URL`: Esta variable de entorno será el URL con el que se conectará al contenedor de Docker de la API.

### Instalación
1. Clona el repositorio.
2. Instala las dependencias necesarias:
   ```bash
   npm install