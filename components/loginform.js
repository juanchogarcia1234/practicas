import styles from "./loginform.module.css";
import Image from "next/image";

export default function LoginForm() {
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
                <input type="text" name="email" placeholder="Пользователь" onChange={e => this.onChangeUser(e)} value="test" />
              </div>
            </div>
            <div className="field">
              <div className="ui left icon input">
                <i className="lock icon"></i>
                <input type="password" name="password" placeholder="Пароль" onChange={e => this.onChangePassword(e)} value="test" />
              </div>
            </div>
            <div className="ui fluid large blue submit button" onClick={() => this.props.onFormSubmit(this.state.userName, this.state.password)}>
              Войти
            </div>
          </div>

          <div className="ui error message">Неправильные данные</div>
        </form>
      </div>
    </div>
  );
}
