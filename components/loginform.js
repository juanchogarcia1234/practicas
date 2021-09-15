import styles from "./loginform.module.css";
import axios from "axios";
import { signIn } from "next-auth/client";
import Image from "next/image";
import { useState, useRef } from "react";
import { resolveHref } from "next/dist/next-server/lib/router/router";
import { useRouter } from "next/router";
import Spinner from "./spinner";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const errorMes = useRef(null);
  const router = useRouter();

  async function submitFormHandler(event, email, password) {
    event.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password
    });
    console.log("esta funcion sigue activs", result);

    if (result.error !== null) {
      setLoading(false);
      console.log(errorMes);
      errorMes.current.style.display = "block";
    } else {
      router.push("/");
    }
  }

  return (
    <>
      {loading ? (
        <Spinner></Spinner>
      ) : (
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
                <div className="ui fluid large blue submit button" type="submit" onClick={e => submitFormHandler(e, email, password)}>
                  Войти
                </div>
              </div>
              {}
              <div ref={errorMes} className="ui error message">
                Неправильные данные
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
