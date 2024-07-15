import React from "react";
import ReactDOMClient from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App2 from "./App2";
import App from "./App";
const theme = createTheme();
const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);

//Aun no hay login así que habría que cambiar App por App2, App es la de usuario, y App2 la de admin
root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App2 />
            
    </ThemeProvider>,
);