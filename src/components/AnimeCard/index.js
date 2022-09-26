import "./AnimeCard.css";
import { CgArrowRight } from "react-icons/cg";
import { AiOutlineStar, AiOutlineCalendar } from "react-icons/ai";
import Button from "../Button";
import { useState, useEffect } from "react";
import axios from "axios";

const AnimeCard = ({
  id,
  title,
  cover,
  color,
  trailerURL,
  genres,
  description,
  seasonYear,
  episodeCount,
}) => {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (id) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}reviews/anime/rating/${id}`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          // console.log("Res", res);
          setRating(res.data.data);
        })
        .catch((err) => {
          console.log("Err", err.response);
          if (
            err?.response?.status === 401 &&
            err?.response?.data.isTokenExpired === true
          ) {
            localStorage.removeItem("token");
            window.location.reload(false);
            // } else {
            //   setError("Failed to fetch Reviews!, Try again later.");
          }
        });
    }
  }, [id]);

  return (
    <div className="AnimeCard">
      <div className="front-card">
        <img src={cover} alt="cover" />
        <p>{title.length > 50 ? title.slice(0, 49) + "..." : title}</p>
      </div>
      <div className="back-card">
        <div className="back-card-data">
          <p className="title">
            {title.length > 40 ? title.slice(0, 39) + "..." : title}
          </p>
          {trailerURL && (
            <div className="trailer-link" onClick={() => {}}>
              <a href={trailerURL} target="_blank" rel="noopener noreferrer">
                Watch Trailer
              </a>
              <CgArrowRight className="link-icon" />
            </div>
          )}
          <div className="genres">
            {genres
              .filter((genre) => genre.length < 10)
              .slice(0, 3)
              .map((genre) => (
                <p
                  style={{
                    backgroundColor: color,
                  }}
                  className="genre"
                  key={genre}
                >
                  {genre}
                </p>
              ))}
          </div>
          {description && (
            <p className="desc">
              {description.replace("<i>", "").replace("</i>", "").length > 100
                ? description.slice(0, 99) + "..."
                : description}
            </p>
          )}
          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <div className="rating">
              <p>{rating || "Not Rated"}</p>
              <AiOutlineStar className="star-icon" />
            </div>
            {seasonYear && (
              <div className="year">
                <p>{seasonYear}</p>
                <AiOutlineCalendar className="calendar-icon" />
              </div>
            )}
          </div>
          <p className="episodes">
            {episodeCount} {episodeCount > 1 ? "episodes" : "episode"}
          </p>
        </div>
        <Button link to={`/anime/${id}`}>
          See more
        </Button>
      </div>
    </div>
  );
};

export default AnimeCard;
