import React from "react";
import Router from "./routers/index";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router />
        </ThemeProvider>
    );
}

export default App;