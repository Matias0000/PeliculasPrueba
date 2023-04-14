import { useMemo, useRef, useState, useCallback } from "react";
import { searchMovies } from "../service/seactMovies";
// import withoutResultsMovies from "../mocks/with-results.json";
// import withoutResponseMovies from '../mocks/no-result.json'

// let previousSearch = '' Esto funciona pero en no se cumple los principios de modulos en js ya que se genera una unica instacia, en caso de querer hacer otra esta mal y se romperia el custum hook y no seria reutilizable siendo lo correcto usar useRef()

export function useMovies({ search, sort }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const previousSearch = useRef(search)

  // Primera version de prueba 
  // const [reponseMovies, setResponseMovies] = useState<any>([])

  // const movies = reponseMovies.Search;

  // const mappedMovies = movies?.map(movie => ({
  //   id:movie.imdbID,
  //   title:movie.Title,
  //   year:movie.Year,
  //   poster:movie.Poster
  // }))

  // const getMovies = () => {
  //   if(search){
  //     // setResponseMovies(withoutResultsMovies)
  //     fetch(`http://www.omdbapi.com/?apikey=4a3b711b&s=${search}`)
  //     .then(res => res.json())
  //     .then(json =>{
  //       setResponseMovies(json)
  //     } )
  //   }else{
  //     setResponseMovies(withoutResponseMovies)
  //   } 
  // }

  // return {movies: mappedMovies, getMovies}

  // const getMovies = useMemo(() => {
  //   return async ( {search}) => {
  //     if (search === previousSearch.current) return

  //     try {
  //       setLoading(true)
  //       setError(null)
  //       previousSearch.current = search
  //       const newMovies = await searchMovies({ search })
  //       setMovies(newMovies)
  //     } catch (error) {
  //       setError(error.message)
  //     } finally {
  //       setLoading(false)
  //     }   
  //   }
  // },[])


  // El useCallback es lo mismo que useMemo nomas que se usa mas en funciones 
  const getMovies = useCallback(async ({ search }) => {
    if (search === previousSearch.current) return
    try {
      setLoading(true)
      setError(null)
      previousSearch.current = search
      const newMovies = await searchMovies({ search })
      setMovies(newMovies)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])





  // useMemo lo utilizamos para memorizar operaciones que no queremos que se repitan a menos que cambien las dependencias que nosotros le indicamos en el caso este solo necesitamos que se ejecute la funcion cuando se busca una movie o se ordenan no cuando se esta escribiendo en el search 
  const sortedMovies = useMemo(() => {
    return sort
      ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
      : movies
  }, [sort, movies])

  // esto ordena las peliculas pero realiza un renderizado cada vez que cambia el search
  // const sortedMovies = sort 
  // ? [...movies].sort((a,b)=> a.title.localeCompare(b.title))
  // :movies

  return { movies: sortedMovies, getMovies, loading }
}