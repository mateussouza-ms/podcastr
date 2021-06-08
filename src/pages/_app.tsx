import { Provider } from "react-redux";

import { Header } from "../components/Header";
import { Player } from "../components/Player";

import { store } from "../store/store";

import "../styles/global.css";
import styles from "../styles/app.module.css";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <div className={styles.appWrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </Provider>
  );
}

export default MyApp;
