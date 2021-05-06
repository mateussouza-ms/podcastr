import { usePlayer } from "../../contexts/PlayerContext";

import styles from "./styles.module.css";

interface EpisodeButtonProps {
  episodeId: string;
  onClick: () => void;
}

export function EpisodeButton({ onClick, episodeId }: EpisodeButtonProps) {
  const { isPlaying, currentEpisodeIndex, episodeList } = usePlayer();
  const currentEpisode = episodeList[currentEpisodeIndex];

  return (
    <button
      type="button"
      className={
        styles.button +
        (currentEpisode?.id === episodeId ? " " + styles.active : "")
      }
      onClick={onClick}
    >
      {currentEpisode?.id === episodeId ? (
        isPlaying ? (
          <img
            src="/pause.svg"
            alt="Pausar"
            title="Pausar"
            className={styles.buttonImage}
          />
        ) : (
          <img
            src="/play.svg"
            alt="Tocar"
            title="Tocar"
            className={styles.buttonImage}
          />
        )
      ) : (
        <img
          src="/play-green.svg"
          alt="Tocar episódio"
          title="Tocar episódio"
          className={styles.buttonImage}
        />
      )}
    </button>
  );
}
