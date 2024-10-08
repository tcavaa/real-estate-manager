import { Link } from "react-router-dom";
import logo from "../logo.png";
import styles from "./Navigation.module.css";

function Navigation() {
  return (
    <nav>
      <div className={styles.insideNav}>
        <Link to="/">
          <img className={styles.logo} src={logo} alt="Logo" />
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;
