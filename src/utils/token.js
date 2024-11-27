function jwtDecode(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map((c) => {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    return JSON.parse(jsonPayload);
}

function isTokenExpired(token) {
    if (!token) {
        return true;
    }

    const decodedToken = jwtDecode(token);
    const expirationTime = decodedToken.exp * 1000;

    return Date.now() >= expirationTime;
}

export const isAuths = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;
    if (isTokenExpired(token)) return null;

    return jwtDecode(token);
};

export const isAuth = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    return token;
};

export const setAuth = (token) => {
    sessionStorage.setItem("token", token);
};

export const clearAuth = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("fullname");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("idAutoGate");
    sessionStorage.removeItem("idAutoGateDetail");
    const id = sessionStorage.getItem("idAutoGateDetail");
    if (id) {
        const changesKey = `editeOcrChanges_${id}`;
        localStorage.removeItem(changesKey);
    }
};
