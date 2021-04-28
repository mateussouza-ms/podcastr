import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { api } from "../services/api";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

import styles from "./home.module.css";

interface Episode {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  duration: number;
  durationAsString: string;
}

interface HomeProps {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode) => {
            return (
              <li key={episode.id}>
                <Image
                  src={episode.thumbnail}
                  alt={episode.title}
                  width={192}
                  height={192}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img
                    src="/play-green.svg"
                    alt="Tocar episódio"
                    title="Tocar episódio"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th colSpan={2}>PODCAST</th>
              <th>INTEGRANTES</th>
              <th>DATA</th>
              <th>DURAÇÃO</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 65 }}>
                    <Image
                      src={episode.thumbnail}
                      alt={episode.title}
                      height={120}
                      width={120}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 90, textTransform: "capitalize" }}>
                    {episode.publishedAt}
                  </td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img
                        src="/play-green.svg"
                        alt="Tocar episódio"
                        title="Tocar episódio"
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("/episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes: Episode[] = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      thumbnail: episode.thumbnail,
      url: episode.file.url,
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
    };
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
