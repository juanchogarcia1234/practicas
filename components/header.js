import styles from "./header.module.css";

export default function Header() {
  return (
    <div className={`ui right menu ${styles.menu}`}>
      <div className=" item">🇪🇸</div>
      <div className="right item">
        <div className="ui button">Выйти</div>
      </div>
    </div>
  );
}
