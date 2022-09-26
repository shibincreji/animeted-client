import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, restricted = false, ...rest }) => {
  const isLogin = localStorage.getItem("token");

  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route
      {...rest}
      render={(props) =>
        isLogin && restricted ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
};

export default PublicRoute;
