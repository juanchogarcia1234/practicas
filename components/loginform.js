import styles from "./loginform.module.css";
import Image from "next/image";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submitFormHandler(event, email, password) {
    event.preventDefault();
    const reqBody = { email, password };
    fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => console.log(data));
  }

  return (
    <div className="ui middle aligned center aligned grid">
      <div className="column">
        <h2 className="ui black image header">
          <Image
            src="/images/logo.png"
            className="image"
            height={144} // Desired size with correct aspect ratio
            width={144} // Desired size with correct aspect ratio
            alt="Your Name"
          />
        </h2>
        <form className="ui large form">
          <div className="ui stacked segment">
            <div className="field">
              <div className="ui left icon input">
                <i className="user icon"></i>
                <input type="text" name="email" placeholder="Пользователь" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <div className="ui left icon input">
                <i className="lock icon"></i>
                <input type="password" name="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
            <div className="ui fluid large blue submit button" onClick={e => submitFormHandler(e, email, password)}>
              Войти
            </div>
          </div>

          <div className="ui error message">Неправильные данные</div>
        </form>
      </div>
    </div>
  );
}
