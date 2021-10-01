import Link from "next/link";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/client";
import styles from "./menu.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the FontAwesomeIcon component
import { faCalendarAlt, faWindowClose, faClock, faPlusCircle } from "@fortawesome/free-solid-svg-icons"; // import the icons you need

export default function Menu({ session, user }) {
  const router = useRouter();
  console.log(session);
  return (
    <div className={`ui vertical pointing menu ${styles.menu} ${styles.vertical}`}>
      <Link className="item" href="/" style={{ fontWeight: "bold" }}>
        <div style={{ padding: "10px 20px 10px 20px", borderBottom: "1px solid rgba(34,36,38,.1)" }} className={styles.selected}>
          <FontAwesomeIcon style={{ marginRight: "10px" }} icon={faCalendarAlt}></FontAwesomeIcon>
          Уроки
        </div>
      </Link>
      <Link
        className="item"
        href="/uroki/otmenennye"
        activeStyle={{
          fontWeight: "bold"
        }}
      >
        <div style={{ padding: "10px 20px 10px 20px", borderBottom: "1px solid rgba(34,36,38,.1)" }} className={styles.selected}>
          <FontAwesomeIcon style={{ marginRight: "10px" }} icon={faWindowClose}></FontAwesomeIcon>
          Отменные уроки
        </div>
      </Link>
      <Link
        className="item"
        href="/uroki/perenesennye"
        activeStyle={{
          fontWeight: "bold"
        }}
      >
        <div style={{ padding: "10px 20px 10px 20px", borderBottom: "1px solid rgba(34,36,38,.1)" }} className={styles.selected}>
          <FontAwesomeIcon style={{ marginRight: "10px" }} icon={faClock}></FontAwesomeIcon>
          Перенесенные уроки
        </div>
      </Link>

      {user === "juan@gmail.com" && (
        <Link
          className="item"
          href="/uroki/perenesennye"
          activeStyle={{
            fontWeight: "bold"
          }}
        >
          <div style={{ padding: "10px 20px 10px 20px", borderBottom: "1px solid rgba(34,36,38,.1)" }} className={styles.selected}>
            <FontAwesomeIcon style={{ marginRight: "10px" }} icon={faPlusCircle}></FontAwesomeIcon>
            Добавить курс
          </div>
        </Link>
      )}
    </div>
  );
}
