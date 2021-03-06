import { PlayerContextProvider } from "../contexts/PlayerContext";
import { Header } from "../components/Header";
import { Player } from "../components/Player";

import "../styles/global.css";
import styles from "../styles/app.module.css";

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <div className={styles.appWrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  );
}

export default MyApp;
