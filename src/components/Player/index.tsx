import { useContext, useEffect, useRef } from "react";
import Image from "next/image";
import Slider from "rc-slider";
import { PlayerContext } from "../../contexts/PlayerContext";

import styles from "./styles.module.css";
import "rc-slider/assets/index.css";

export function Player() {
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
  } = useContext(PlayerContext);
  const episode = episodeList[currentEpisodeIndex];

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            src={episode.thumbnail}
            width={592}
            height={592}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{episode ? episode.durationAsString : "00:00"}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            autoPlay
            ref={audioRef}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" title="Ordem aleatória" disabled={!episode}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button type="button" title="Pular para anterior" disabled={!episode}>
            <img src="/play-previous.svg" alt="Pular para anterior" />
          </button>

          <button
            type="button"
            className={styles.playButton}
            title="Tocar/Pausar"
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Tocar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>

          <button type="button" title="Pular para próximo" disabled={!episode}>
            <img src="/play-next.svg" alt="Pular para próximo" />
          </button>

          <button type="button" title="Repetir" disabled={!episode}>
            <img src="repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
