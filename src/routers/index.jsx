import React, { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import Login from "../views/auth/login";
import Transaction from "../views/admin/transaction/transaction";
import Dashboard from "../views/admin/dashboard/dashboard";
import swal from "sweetalert";
import Layout from "../layout/layout";
import Users from "../views/admin/users/users";
import Gate from "../views/admin/gate/gate";
import GateDevice from "../views/admin/gate/gateDevice";
import Config from "../views/admin/config/config";
import OCRData from '../views/admin/ocr-data/ocr'
import TestData from '../views/admin/test-data/testdata'
import Search from '../views/admin/search/search'
import { isAuth } from "../utils/token";
import AutoGateError from "../views/admin/autogate-error/autoGateError";
import ServerMonitoring from '../views/admin/server-monitoring/MonitoringDashboard'
const ScrollToTop = ({ children }) => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return children;
};


const Auth = ({ children }) => {
    const token = isAuth()
    if (!token) {

        return <Navigate to="/login" replace />;
    }
    return children;
};

const Router = () => {
    const token = isAuth();
    return (
        <BrowserRouter>
            <ScrollToTop>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/dashboard" element={<Layout />}>
                        <Route index element={<Auth><Dashboard /></Auth>} />
                    </Route>
                    <Route path="/server" element={<Layout />}>
                        <Route index element={<Auth><ServerMonitoring /></Auth>} />
                    </Route>

                    <Route
                        path="/"
                        element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
                    />
                    <Route path="/transaction" element={<Layout />}>
                        <Route index element={<Auth> <Transaction /> </Auth>} />
                    </Route>
                    <Route path="/autogateerror" element={<Layout />}>
                        <Route index element={<Auth> <AutoGateError /> </Auth>} />
                    </Route>
                    <Route path="/ocr" element={<Layout />}>
                        <Route index element={<Auth> <OCRData /> </Auth>} />
                    </Route>
                    <Route path="/user" element={<Layout />}>
                        <Route index element={<Auth> <Users /> </Auth>} />
                    </Route>
                    <Route path="/gate" element={<Layout />}>
                        <Route index element={<Auth> <Gate /> </Auth>} />
                    </Route>
                    <Route path="/gate/:id" element={<Layout />}>
                        <Route index element={<Auth> <GateDevice /> </Auth>} />
                    </Route>

                    <Route path="/config" element={<Layout />}>
                        <Route index element={<Auth> <Config /> </Auth>} />
                    </Route>

                    <Route path="/manualinput" >
                        <Route index element={<Auth> <TestData /> </Auth>} />
                    </Route>
                    <Route path="/search" element={<Layout />}>
                        <Route index element={<Auth> <Search /> </Auth>} />
                    </Route>
                </Routes>
            </ScrollToTop>
        </BrowserRouter>
    );
};

export default Router;