import Login from "../../components/Login";
import Signup from "../../components/Signup";
import { useParams } from "react-router-dom";

const Auth = () => {
  let { type } = useParams();

  return (
    <div className="Auth">{type === "login" ? <Login /> : <Signup />}</div>
  );
};

export default Auth;
