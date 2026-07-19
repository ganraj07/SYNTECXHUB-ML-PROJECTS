import moviesData from "@/data/movies.json";

export interface Movie {
  id: number;
  title: string;
  year: number | null;
  genres: string;
  keywords: string;
  overview: string;
  rating: number;
  director: string;
  tagline: string;
}

export const movies = moviesData as Movie[];

const STOPWORDS = new Set(
  "a an the and or but if while of at by for with about against between into through during before after above below to from up down in out on off over under again further then once here there when where why how all any both each few more most other some such no nor not only own same so than too very s t can will just don should now is are was were be been being have has had do does did i you he she it we they them his her its our their this that these those as".split(
    " ",
  ),
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function corpusText(m: Movie): string {
  return [
    m.genres,
    m.genres, // weight genres more
    m.keywords,
    m.keywords,
    m.director,
    m.tagline,
    m.overview,
  ].join(" ");
}

// Build TF-IDF vectors once
type SparseVec = Map<number, number>;

interface Index {
  vectors: SparseVec[];
  norms: Float64Array;
  vocab: Map<string, number>;
}

let cached: Index | null = null;

function buildIndex(): Index {
  const docs = movies.map((m) => tokenize(corpusText(m)));
  const vocab = new Map<string, number>();
  const df = new Map<number, number>();

  const tfList: Map<number, number>[] = docs.map((tokens) => {
    const tf = new Map<number, number>();
    const seen = new Set<number>();
    for (const tok of tokens) {
      let idx = vocab.get(tok);
      if (idx === undefined) {
        idx = vocab.size;
        vocab.set(tok, idx);
      }
      tf.set(idx, (tf.get(idx) || 0) + 1);
      seen.add(idx);
    }
    for (const idx of seen) df.set(idx, (df.get(idx) || 0) + 1);
    return tf;
  });

  const N = docs.length;
  const idf = new Float64Array(vocab.size);
  for (const [idx, count] of df) idf[idx] = Math.log((N + 1) / (count + 1)) + 1;

  const vectors: SparseVec[] = tfList.map((tf) => {
    const v = new Map<number, number>();
    for (const [idx, freq] of tf) v.set(idx, freq * idf[idx]);
    return v;
  });

  const norms = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    let s = 0;
    for (const w of vectors[i].values()) s += w * w;
    norms[i] = Math.sqrt(s) || 1;
  }

  return { vectors, norms, vocab };
}

function getIndex(): Index {
  if (!cached) cached = buildIndex();
  return cached;
}

function cosine(a: SparseVec, b: SparseVec, na: number, nb: number): number {
  // iterate over smaller
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  let dot = 0;
  for (const [idx, w] of small) {
    const w2 = large.get(idx);
    if (w2) dot += w * w2;
  }
  return dot / (na * nb);
}

export interface Recommendation {
  movie: Movie;
  score: number;
}

export function recommendFor(movieId: number, topK = 10): Recommendation[] {
  const idx = getIndex();
  const i = movies.findIndex((m) => m.id === movieId);
  if (i < 0) return [];
  const results: Recommendation[] = [];
  for (let j = 0; j < movies.length; j++) {
    if (j === i) continue;
    const s = cosine(idx.vectors[i], idx.vectors[j], idx.norms[i], idx.norms[j]);
    results.push({ movie: movies[j], score: s });
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}

export function searchMovies(query: string, limit = 20): Movie[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored: { m: Movie; s: number }[] = [];
  for (const m of movies) {
    const t = m.title.toLowerCase();
    if (t === q) scored.push({ m, s: 1000 });
    else if (t.startsWith(q)) scored.push({ m, s: 100 + m.rating });
    else if (t.includes(q)) scored.push({ m, s: 50 + m.rating });
  }
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, limit).map((x) => x.m);
}

// Stats for EDA panel
export function datasetStats() {
  const total = movies.length;
  const withOverview = movies.filter((m) => m.overview.length > 0).length;
  const years = movies.map((m) => m.year).filter((y): y is number => !!y);
  const avgRating = movies.reduce((s, m) => s + m.rating, 0) / total;
  const genreCounts = new Map<string, number>();
  for (const m of movies) {
    for (const g of m.genres.split(/\s+/).filter(Boolean)) {
      genreCounts.set(g, (genreCounts.get(g) || 0) + 1);
    }
  }
  const topGenres = [...genreCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  return {
    total,
    withOverview,
    minYear: Math.min(...years),
    maxYear: Math.max(...years),
    avgRating,
    topGenres,
    vocabSize: getIndex().vocab.size,
  };
}