import { useState, useEffect } from "react";
import axios from "axios";
import "./Search.css";
import AnimeCard from "../../components/AnimeCard";
import Loading from "../../components/Loading";
import pokemonSadImage from "../../assets/pokemon-sad-1.png";
import animeSaluteImage from "../../assets/anime-salute-1.png";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [animeList, setAnimeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [searchBy, setSearchBy] = useState("title");
  const [error, setError] = useState("");

  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const fetchMoreAnimes = () => {
    setIsFetchingMore(true);
    axios
      .get(
        `${
          process.env.REACT_APP_ANI_API_URI
        }anime?${searchBy}=${searchTerm}&page=${pageNo + 1}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_ANI_API_KEY}`,
          },
        }
      )
      .then((res) => {
        // console.log("Res", res);
        setPageNo((prev) => prev + 1);
        setError("");
        setAnimeList((prev) => [...prev, ...res.data.data.documents]);
        setIsFetchingMore(false);
      });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        setIsLoading(true);
        axios
          .get(
            `${process.env.REACT_APP_ANI_API_URI}anime?${searchBy}=${searchTerm}&page=1`,
            {
              headers: {
                Authorization: `Bearer ${process.env.REACT_APP_ANI_API_KEY}`,
              },
            }
          )
          .then((res) => {
            // console.log("Res", res);
            if (res.data.data === "" && res.data.status_code === 404) {
              setError("No Animes Found!");
            } else {
              setError("");
              setAnimeList(res.data.data.documents);
              setTotalPages(res.data.data.last_page);
            }
            setIsLoading(false);
          })
          .catch((err) => {
            console.log("Err", err);
            setError("Unknown Error Occured!");
          });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchBy]);

  return (
    <div className="Search">
      <div className="search-bar">
        <div className="search-term">
          <label htmlFor="search_term">Search</label>
          <input
            name="search_term"
            id="search_term"
            value={searchTerm}
            onChange={handleSearchInputChange}
            placeholder="Start typing here"
          />
        </div>
        <div className="dropdown">
          <label>Search By</label>
          <select id="searchBy" name="searchBy" onChange={handleSearchByChange}>
            <option value="title">Title</option>
            <option value="genre">Genre</option>
          </select>
        </div>
      </div>
      {searchTerm && searchTerm.length > 0 ? (
        isLoading ? (
          <div className="loading">
            <Loading />
          </div>
        ) : error ? (
          <div className="error">
            <img src={pokemonSadImage} alt="sad pokemon" />
            <p>{error}</p>
          </div>
        ) : (
          animeList &&
          animeList.length > 0 && (
            <div className="anime-results">
              <div className="anime-list">
                {animeList.map((item) => {
                  return (
                    <div key={item.id}>
                      <AnimeCard
                        id={item.id}
                        title={item.titles.en}
                        cover={item.cover_image}
                        color={item.cover_color}
                        trailerURL={item.trailer_url}
                        genres={item.genres}
                        description={item.descriptions.en}
                        seasonYear={item.season_year}
                        episodeCount={item.episodes_count}
                      />
                    </div>
                  );
                })}
              </div>
              {isFetchingMore ? (
                <div className="second-loading">
                  <Loading />
                </div>
              ) : (
                pageNo < totalPages && (
                  <div className="load-more" onClick={fetchMoreAnimes}>
                    <p>Load More Animes</p>
                  </div>
                )
              )}
            </div>
          )
        )
      ) : (
        <div className="no-search">
          <img src={animeSaluteImage} alt="anime saluting" />
          <p>Start Searching to see results</p>
        </div>
      )}
    </div>
  );
};

export default Search;
