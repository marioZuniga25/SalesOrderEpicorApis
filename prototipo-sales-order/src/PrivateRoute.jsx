import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const isAuth = localStorage.getItem("auth"); // o token

    return isAuth ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;