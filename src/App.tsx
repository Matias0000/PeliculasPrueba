import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { Movies } from "./components";
import { useMovies } from "./hooks";
import debounce from "just-debounce-it";

// custom hook que extrae logica de los componentes un useeffect es un custom hook casi siempre, para separar logica es mejor un helper
function useSearch() {
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === "";
      return;
    }

    if (search === "") {
      setError("No se puede buscar una pelicula vacia");
      return;
    }
    if (search.match(/^\d+$/)) {
      setError("No se puede buscar una pelicula por numero");
      return;
    }
    if (search.length < 3) {
      setError("La pelicula no puede tener menos de 3 caracteres ");
      return;
    }
    setError(null);
  }, [search]);

  return { search, updateSearch, error };
}

function App() {
  // const {movies:mappedMovies} = useMovies()
  const [sort, setSort] = useState(false);
  const { search, updateSearch, error } = useSearch();
  const { movies, loading, getMovies } = useMovies({ search, sort });

  // Es un hook que te permite generar una referencia mutable
  // que persiste durante todo el ciclo de vida de tu componente, siendo muy util para guardar cualquier valor que puedas mutar, como un identificardor, un elemento del dom, un contador y que cuando cambia no vuelve a renderizar el componente.
  // En cambio el useState cada vez que cambia se vuelve a renderizar el componente
  // No abusar del useRef para hacer multiples referencias a inputs
  // const inputRef = useRef();
  // const [query , setQuery ] = useState('')
  // const handleSubmit = (event:) => {

  const debouncedGetMovies = useCallback(
    debounce((search) => {
      console.log("search", search);
      getMovies({ search });
    }, 600),
    [getMovies]
  );

  const handleSubmit = (
    event: React.BaseSyntheticEvent<HTMLFormElement | Event>
  ) => {
    event.preventDefault();
    getMovies({ search });
    // const { query } = Object.fromEntries(new window.FormData(event.target));
    // console.log({ search });

    // Si quiero recuperar la info de todos los input
    // const fields = Object.fromEntries(new window.FormData(event.target));
    // console.log(fields);

    // const inputEl:React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> = inputRef.current;
    // const value = inputEl.value;

    // alert(value);
  };
  const handleSort = () => {
    setSort(!sort);
  };

  const handleChange = (event) => {
    const newSearch = event.target.value;
    // updateSearch(event.target.value)
    updateSearch(newSearch);
    // Forma lenta pero mas facil de hacer
    // esto generando que no sea el ultimo valor ya que es asincrono para solucionarlo tenemos que volver a conseguir el evento esto siempre utilizando la forma controlada
    // setQuery(event.target.value)
    // const newQuery = event.target.value

    // if(newQuery.startWith(' '))return
    // setQuery(newQuery)

    // if(newQuery === ''){
    //   setError('No se puede buscar una pelicula vacia')
    //   return
    // }
    // if(newQuery.match(/^\d+$/) ){
    //   setError('No se puede buscar una pelicula por numero')
    //   return
    // }
    // if(newQuery.length < 3){
    //   setError('La pelicula no puede tener menos de 3 caracteres ')
    //   return
    // }
    // setError(null)
    // getMovies({search:newSearch})
    debouncedGetMovies(newSearch);
  };

  return (
    <div className="page">
      <h1>Buscador de Peliculas</h1>
      <header className=" ">
        <form action="" className="form" onSubmit={handleSubmit}>
          <label htmlFor=""></label>
          <input
            style={{
              border: "1px solid transparent",
              borderColor: error ? "red" : "transparent",
            }}
            name="query"
            type="text"
            placeholder="Avengers, Start Wars, The Matrix ...."
            // ref={inputRef}
            value={search}
            onChange={handleChange}
          />
          {/* <input name="Cual"/> */}
          <input type="checkbox" onChange={handleSort} checked={sort} />
          <button type="submit">Buscar</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </header>

      <main>
        {loading ? <p>Cargando....</p> : <Movies movies={movies} />}

        {/* Aqui iran los resultados */}
        {/* {hasMovies ? (   Esto se puede hacer para el primer acercamiento rapido
          <ul>
            {movies.map((movie) => (
              <li key={movie.imdbID} >
                <h3>{movie.Title}</h3>
                <p>{movie.Type}</p>
                <img src={movie.Poster} alt="The Movies" />
              </li>
            ))}
          </ul>
        ) : (
          <p> NO se encontraron Peliculas</p>
        )} */}
        {/* <Movies movies={mappedMovies}/> */}
      </main>
    </div>
  );
}

export default App;
