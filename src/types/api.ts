export type ResultadoBusca = {
  trackId: number;
  trackName: string;
  artistId: number;
  artistName: string;
  collectionId: number;
  collectionName: string;
  artworkUrl100: string;
  primaryGenreName: string;
  releaseDate: string;
  trackTimeMillis: number;
  trackViewUrl: string;
  previewUrl?: string;
};

export type RespostaBusca = {
  resultCount: number;
  results: ResultadoBusca[];
};