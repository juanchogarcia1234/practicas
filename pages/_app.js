import { Provider } from "next-auth/client";
import "../styles/global.css";
import "../styles/calendar.css";
import "../styles/info.css";
import "semantic-ui-css/semantic.min.css";
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

export default function App({ Component, pageProps }) {
  return (
    <Provider sesion={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}

//Used to keep state between pages
