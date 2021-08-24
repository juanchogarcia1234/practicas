import styles from "./layout.module.css";
import Header from "./header";
import Menu from "./menu";

export default function Layout({ children }) {
  return (
    <div className={styles.appLayout}>
      <Header />
      <Menu />
      <div className={styles.appContent}>{children}</div>
    </div>
  );
}
