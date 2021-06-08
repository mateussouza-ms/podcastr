import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Slider from "rc-slider";

import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import { playerActions } from "../../store/player/playerSlice";
import { RootState } from "../../store/store";

import styles from "./styles.module.css";
import "rc-slider/assets/index.css";

export function Player() {
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    hasPrevious,
    hasNext,
  } = useSelector((state: RootState) => state.player);

  const dispatch = useDispatch();
  const episode = episodeList[currentEpisodeIndex];
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentEpisodeIndex]);

  function setupProgressListerner() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handlePlay() {
    if (!isPlaying) {
      dispatch(playerActions.play());
    }
  }

  function handlePause() {
    if (audioRef.current.ended) {
      return;
    }

    if (isPlaying) {
      dispatch(playerActions.pause());
    }
  }

  function handleShuffle() {
    dispatch(playerActions.toggleShuffle());
  }

  function handlePlayPrevious() {
    dispatch(playerActions.playPrevious());
  }

  function handlePlayNext() {
    dispatch(playerActions.playNext(episodeList.length));
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleTogglePlay() {
    dispatch(playerActions.togglePlay());
  }

  function handleToggleLoop() {
    dispatch(playerActions.toggleLoop());
  }

  function handleAudioEnded() {
    dispatch(playerActions.playNext(episodeList.length));
  }

  function togglePlayerCollapse() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div
      className={
        styles.playerContainer + (isCollapsed ? " " + styles.collapsed : "")
      }
    >
      <button type="button" onClick={togglePlayerCollapse}>
        <img
          src="/arrow-left.svg"
          alt="Voltar para a página inicial"
          title="Voltar para a página inicial"
        />
      </button>

      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode} onClick={togglePlayerCollapse}>
          <div className={styles.thumbnailContainer}>
            <Image
              src={episode.thumbnail}
              width={592}
              height={592}
              objectFit="cover"
            />
          </div>
          <div className={styles.details}>
            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>
            {episode ? convertDurationToTimeString(progress) : "00:00"}
          </span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
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
            ref={audioRef}
            loop={isLooping}
            onEnded={handleAudioEnded}
            onLoadedMetadata={setupProgressListerner}
            onPlay={handlePlay}
            onPause={handlePause}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            title="Ordem aleatória"
            disabled={!episode || episodeList.length === 1}
            onClick={handleShuffle}
            className={isShuffling ? styles.isActive : ""}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button
            type="button"
            title="Pular para anterior"
            disabled={!episode || !hasPrevious}
            onClick={handlePlayPrevious}
          >
            <img src="/play-previous.svg" alt="Pular para anterior" />
          </button>

          <button
            type="button"
            className={styles.playButton}
            title="Tocar/Pausar"
            disabled={!episode}
            onClick={handleTogglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Tocar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>

          <button
            type="button"
            title="Pular para próximo"
            disabled={!episode || !hasNext}
            onClick={handlePlayNext}
          >
            <img src="/play-next.svg" alt="Pular para próximo" />
          </button>

          <button
            type="button"
            title="Repetir"
            disabled={!episode}
            onClick={handleToggleLoop}
            className={isLooping ? styles.isActive : ""}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
