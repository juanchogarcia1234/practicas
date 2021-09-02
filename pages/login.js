import LoginForm from "../components/loginform";

// //This is a container component
// class Login extends React.Component {
//   onFormSubmit = (user, password, mensajeError) => {
//     this.props.logIn(user, password, mensajeError);
//   };

export default function Login() {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", height: "100vh", backgroundColor: "#fafafa" }}>
      <LoginForm />
    </div>
  );
}
