import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  movies,
  searchMovies,
  recommendFor,
  datasetStats,
  type Movie,
} from "@/lib/recommender";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reel Match — Find your next favorite film" },
      {
        name: "description",
        content:
          "Content-based movie recommender. Search a film, get 10 similar picks ranked by TF-IDF cosine similarity over TMDB metadata.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Movie | null>(null);

  const results = useMemo(() => searchMovies(query, 12), [query]);
  const recs = useMemo(
    () => (selected ? recommendFor(selected.id, 10) : []),
    [selected],
  );
  const stats = useMemo(() => datasetStats(), []);

  const topByRating = useMemo(
    () =>
      [...movies]
        .filter((m) => m.rating >= 7.5)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8),
    [],
  );

  return (
    <main
      className="min-h-screen text-foreground"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-primary/80">
            Reel Match
          </p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            Find your next{" "}
            <span className="text-primary">favorite film</span>.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A content-based recommender over {stats.total.toLocaleString()}{" "}
            popular TMDB titles. Pick a movie you love — we score every other
            film by TF-IDF cosine similarity across genres, keywords, director,
            and plot.
          </p>
        </header>

        <section className="mb-10">
          <label className="mb-2 block text-sm font-medium text-muted-foreground">
            Search a movie you love
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Inception, The Godfather, Toy Story…"
            className="w-full rounded-xl border border-border bg-card px-5 py-4 text-lg outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:shadow-[var(--shadow-glow)]"
          />

          {query && (
            <div className="mt-4 grid gap-2 rounded-xl border border-border bg-card/60 p-2 backdrop-blur">
              {results.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">
                  No matches. Try another title.
                </p>
              ) : (
                results.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelected(m);
                      setQuery("");
                    }}
                    className="flex items-center justify-between rounded-lg px-4 py-3 text-left transition-colors hover:bg-secondary"
                  >
                    <span>
                      <span className="font-medium">{m.title}</span>{" "}
                      {m.year && (
                        <span className="text-muted-foreground">
                          ({m.year})
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-primary">
                      ★ {m.rating.toFixed(1)}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </section>

        {selected ? (
          <>
            <SelectedCard movie={selected} onClear={() => setSelected(null)} />
            <section className="mt-10">
              <h2 className="mb-4 text-2xl font-semibold">
                Because you picked{" "}
                <span className="text-primary">{selected.title}</span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {recs.map(({ movie, score }) => (
                  <RecCard key={movie.id} movie={movie} score={score} onPick={setSelected} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="mb-10">
              <h2 className="mb-4 text-2xl font-semibold">Try one of these</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {topByRating.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelected(m)}
                    className="group rounded-xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-glow)]"
                  >
                    <div className="text-xs uppercase tracking-wider text-primary/80">
                      ★ {m.rating.toFixed(1)}
                    </div>
                    <div className="mt-1 font-semibold">{m.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {m.year} · {m.genres.split(/\s+/)[0]}
                    </div>
                  </button>
                ))}
              </div>
            </section>
            <EdaPanel stats={stats} />
          </>
        )}

        <footer className="mt-16 border-t border-border pt-6 text-xs text-muted-foreground">
          Content-based recommender · TF-IDF + cosine similarity computed
          in-browser over TMDB metadata (genres, keywords, director, tagline,
          overview). Dataset: top {stats.total.toLocaleString()} popular titles.
        </footer>
      </div>
    </main>
  );
}

function SelectedCard({
  movie,
  onClear,
}: {
  movie: Movie;
  onClear: () => void;
}) {
  return (
    <section className="rounded-2xl border border-primary/40 bg-card p-6 shadow-[var(--shadow-glow)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-primary">
            You picked
          </div>
          <h2 className="mt-1 text-3xl font-bold">
            {movie.title}{" "}
            {movie.year && (
              <span className="text-muted-foreground">({movie.year})</span>
            )}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {movie.genres.split(/\s+/).filter(Boolean).map((g) => (
              <span
                key={g}
                className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={onClear}
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary"
        >
          Clear
        </button>
      </div>
      {movie.tagline && (
        <p className="mt-4 italic text-primary/80">"{movie.tagline}"</p>
      )}
      <p className="mt-3 max-w-3xl text-muted-foreground">{movie.overview}</p>
      {movie.director && (
        <p className="mt-3 text-sm text-muted-foreground">
          Directed by <span className="text-foreground">{movie.director}</span>
        </p>
      )}
    </section>
  );
}

function RecCard({
  movie,
  score,
  onPick,
}: {
  movie: Movie;
  score: number;
  onPick: (m: Movie) => void;
}) {
  return (
    <button
      onClick={() => onPick(movie)}
      className="group rounded-xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-glow)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold group-hover:text-primary">
            {movie.title}{" "}
            {movie.year && (
              <span className="font-normal text-muted-foreground">
                ({movie.year})
              </span>
            )}
          </h3>
          <div className="mt-1 text-xs text-muted-foreground">
            {movie.genres} · ★ {movie.rating.toFixed(1)}
          </div>
        </div>
        <div className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-right">
          <div className="text-[10px] uppercase tracking-wider text-primary/70">
            match
          </div>
          <div className="text-sm font-bold text-primary">
            {(score * 100).toFixed(0)}%
          </div>
        </div>
      </div>
      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
        {movie.overview}
      </p>
    </button>
  );
}

function EdaPanel({ stats }: { stats: ReturnType<typeof datasetStats> }) {
  const max = Math.max(...stats.topGenres.map(([, c]) => c));
  return (
    <section className="rounded-2xl border border-border bg-card/60 p-6">
      <h2 className="mb-1 text-xl font-semibold">Dataset at a glance</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Quick EDA over the cleaned TMDB slice powering these recommendations.
      </p>
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Movies" value={stats.total.toLocaleString()} />
        <Stat
          label="Year range"
          value={`${stats.minYear}–${stats.maxYear}`}
        />
        <Stat label="Avg rating" value={stats.avgRating.toFixed(2)} />
        <Stat label="Vocab (TF-IDF)" value={stats.vocabSize.toLocaleString()} />
      </div>
      <div className="mt-6">
        <div className="mb-2 text-sm font-medium text-muted-foreground">
          Top genre tokens
        </div>
        <div className="space-y-1.5">
          {stats.topGenres.map(([g, c]) => (
            <div key={g} className="flex items-center gap-3 text-sm">
              <div className="w-20 shrink-0 text-muted-foreground">{g}</div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(c / max) * 100}%` }}
                />
              </div>
              <div className="w-10 shrink-0 text-right tabular-nums text-muted-foreground">
                {c}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-primary">{value}</div>
    </div>
  );
}