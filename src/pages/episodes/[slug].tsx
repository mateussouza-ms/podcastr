import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { api } from "../../services/api";
import { usePlayer } from "../../contexts/PlayerContext";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

import styles from "./styles.module.css";

interface Episode {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  url: string;
  duration: number;
  durationAsString: string;
}

interface EpisodeProps {
  episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
  const {
    play,
    setPlayingState,
    isPlaying,
    episodeList,
    currentEpisodeIndex,
  } = usePlayer();
  const currentEpisode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.episodeContainer}>
      <div className={styles.episode}>
        <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button type="button">
              <img
                src="/arrow-left.svg"
                alt="Voltar para a página inicial"
                title="Voltar para a página inicial"
              />
            </button>
          </Link>
          <Image
            src={episode.thumbnail}
            alt={episode.title}
            width={700}
            height={160}
            objectFit="cover"
          />
          {isPlaying && currentEpisode.id === episode.id ? (
            <button
              type="button"
              className={styles.pauseButton}
              onClick={() => {
                setPlayingState(false);
              }}
            >
              <img
                src="/pause.svg"
                alt="Pausar episódio"
                title="Pausar episódio"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                play(episode);
              }}
            >
              <img
                src="/play.svg"
                alt="Tocar episódio"
                title="Tocar episódio"
              />
            </button>
          )}
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: episode.description }}
        />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get("/episodes", {
    params: {
      _limit: 2,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const paths = data.map((episode) => {
    return {
      params: {
        slug: episode.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    description: data.description,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    thumbnail: data.thumbnail,
    url: data.file.url,
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, //24 hours
  };
};
