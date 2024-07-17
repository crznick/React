import React from "react";
import ReactDOMClient from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import App2 from "./Administrador";
import App from "./Profesores";
import Login from "./Login";
import PrivateRoute from './PrivateRoute';

const theme = createTheme();
const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);

root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Login />} /> {/* Ruta por defecto */}
                <Route path="/Profesores" element={<PrivateRoute element={App} role="profesor" />} />
                <Route path="/Administrador" element={<PrivateRoute element={App2} role="administrador" />} />
            </Routes>
        </Router>
    </ThemeProvider>,
);