import styles from "./header.module.css";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  function logoutHandler() {
    signOut({ callbackUrl: "/login" });
  }
  return (
    <div className={`ui right menu ${styles.menu}`}>
      <div className=" item">🇪🇸</div>
      <div className="right item">
        <div className="ui button" onClick={logoutHandler}>
          Выйти
        </div>
      </div>
    </div>
  );
}
