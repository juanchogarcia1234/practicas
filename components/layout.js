import styles from "./layout.module.css";
import Header from "./header";
import Menu from "./menu";

export default function Layout({ children, session, usuario }) {
  return (
    <div className={styles.appLayout}>
      <Header />
      <Menu session={session} user={usuario} />
      <div className={styles.appContent}>{children}</div>
    </div>
  );
}
