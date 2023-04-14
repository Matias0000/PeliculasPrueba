const API_KEY = '4a3b711b'
const API_KEY1 = '4287ad07'

// export const searchMovies =async ({search}) => {
//   if(search === '') return null
//   try {

//     const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY1}=${search}`)
//     const json = await response.json()
//     const movies = json.Search

//     return movies?.map(movie => ({
//       id:movie.imdbID,
//       title:movie.Title,
//       year:movie.Year,
//       poster:movie.Poster
      
//     })) 
//   } catch (error){
//     throw new Error('Error searching movies')
//   }
// }

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

type SearchMoviesParams = {
  search: string;
};

type SearchResult = {
  id: string;
  title: string;
  year: string;
  poster: string;
}[];

export const searchMovies = async ({ search }: SearchMoviesParams): Promise<SearchResult | null> => {
  if (!search) return null;
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY1}&s=${search}`);
    const data = await response.json();
    const movies = data.Search as Movie[];
    if (!movies) return null;
    return movies.map((movie) => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster === "N/A" ? "" : movie.Poster,
    }));
  } catch (error) {
    throw new Error("Error searching movies");
  }
};