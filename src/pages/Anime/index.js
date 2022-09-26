import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import Loading from "../../components/Loading";
import "./Anime.css";
import { AiOutlineStar, AiOutlineCalendar } from "react-icons/ai";
import { CgArrowRight, CgArrowLeft } from "react-icons/cg";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const reviewSchema = yup.object().shape({
  desc: yup
    .string()
    .min(5, "Description cannot be less than 5 letters.")
    .max(100, "Description cannot be more than 100 letters.")
    .required("Please enter your Description"),
  rating: yup
    .number()
    .min(1, "Rating cannot be less than 1")
    .max(5, "Rating cannot be more than 5")
    .typeError("Please enter a valid rating")
    .required("Please enter your Rating"),
});

const Anime = () => {
  const { animeId } = useParams();
  let history = useHistory();

  const [animeData, setAnimeData] = useState(null);
  const [reviewData, setReviewData] = useState(null)
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(reviewSchema),
  });

  const handleFormSubmit = (formData) => {
    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}reviews/`,
        {
          ...formData,
          animeId: animeId,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        // console.log("Res", res);
        setIsLoading(false);
        window.location.reload(false);
      })
      .catch((err) => {
        console.log("Err", err.response);
        if (
          err?.response?.status === 401 &&
          err?.response?.data.isTokenExpired === true
        ) {
          localStorage.removeItem("token");
          window.location.reload(false);
        } else {
          setError("Failed to save Review!, Try again later.");
        }
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (animeId) {
      setIsLoading(true);
      axios
        .get(`${process.env.REACT_APP_ANI_API_URI}anime/${animeId}`, {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_ANI_API_KEY}`,
          },
        })
        .then((res) => {
          // console.log("Res", res);
          if (res.data.status_code === 404) {
            history.push("/");
          } else {
            setAnimeData(res.data.data);
          }
          setIsLoading(false);
        });
    }
  }, [animeId, history]);

  useEffect(() => {
    if (animeId) {
      setIsLoading(true);
      axios
        .get(`${process.env.REACT_APP_API_URL}reviews/anime/${animeId}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          // console.log("Res", res);
          if (res.data.status_code === 404) {
            history.push("/");
          } else {
            setReviewData(res.data.data);
          }
          setIsLoading(false);
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
          setIsLoading(false);
        });
    }
  }, [animeId, history]);

  return (
    <div className="Anime">
      {isLoading || !animeData ? (
        <div className="loading">
          <Loading />
        </div>
      ) : (
        <div className="anime-data">
          <div className="banner">
            <div
              style={{
                boxShadow: `inset 1px 0px 100px 1px ${animeData.cover_color}`,
              }}
            ></div>
            <img src={animeData.banner_image} alt="banner" />
          </div>
          <div
            style={{
              borderTop: `2px solid ${animeData.cover_color}`,
            }}
            className="body"
          >
            <div className="left">
              <img
                style={{
                  boxShadow: `0px 0px 40px -10px ${animeData.cover_color}`,
                  border: `1px solid ${animeData.cover_color}`,
                }}
                src={animeData.cover_image}
                alt="cover"
              />
              <a
                href={animeData.trailer_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: animeData.cover_color,
                }}
              >
                Watch Trailer
              </a>
            </div>
            <div className="right">
              <h1
                style={{
                  color: animeData.cover_color,
                }}
              >
                {animeData.titles.en}
              </h1>
              <p className="desc">{animeData?.descriptions?.en}</p>
              <div className="genres">
                {animeData.genres.slice(0, 9).map((genre) => {
                  return (
                    <p
                      style={{
                        backgroundColor: animeData.cover_color,
                      }}
                      className="genre"
                      key={genre}
                    >
                      {genre}
                    </p>
                  );
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <div className="rating">
                  <p>{reviewData?.avg_rating || "Not Rated"}</p>
                  <AiOutlineStar className="star-icon" />
                </div>
                {animeData.season_year && (
                  <div className="year">
                    <p>{animeData.season_year}</p>
                    <AiOutlineCalendar className="calendar-icon" />
                  </div>
                )}
              </div>
              <p className="episodes">
                {animeData.episodes_count}{" "}
                {animeData.episodes_count > 1 ? "episodes" : "episode"}
              </p>
              <div className="story">
                {animeData.prequel && (
                  <Link
                    style={{
                      color: animeData.cover_color,
                    }}
                    to={`/anime/${animeData.prequel}`}
                  >
                    <CgArrowLeft className="left-icon" />
                    <p>See Prequel</p>
                  </Link>
                )}
                {animeData.sequel && (
                  <Link
                    style={{
                      color: animeData.cover_color,
                    }}
                    to={`/anime/${animeData.sequel}`}
                  >
                    <p>See Sequel</p>
                    <CgArrowRight className="right-icon" />
                  </Link>
                )}
              </div>
              <div
                style={{
                  borderTop: `2px solid ${animeData.cover_color}`,
                }}
                className="reviews"
              >
                <h2
                  style={{
                    color: animeData.cover_color,
                  }}
                >
                  Reviews
                </h2>
                <form
                  noValidate
                  onSubmit={handleSubmit(handleFormSubmit)}
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <Input
                    register={register}
                    type="textarea"
                    name="desc"
                    label="Description"
                    placeholder="Please enter description here"
                    error={!!errors.desc}
                    helperText={errors?.desc?.message}
                  />
                  <Input
                    register={register}
                    type="number"
                    name="rating"
                    label="Rating Points (Out of 5)"
                    placeholder="Please enter rating here"
                    error={!!errors.rating}
                    helperText={errors?.rating?.message}
                  />
                  <p className="error">{error}</p>
                  <Button>Upload Review</Button>
                </form>
                <div className="review-list">
                  {reviewData && reviewData.reviews.map((review) => {
                    return (
                      <div key={review._id} className="review">
                        <p>{review.desc}</p>
                        <div>
                          <div className="user">
                            <p
                              style={{
                                color: animeData.cover_color,
                              }}
                            >
                              - {review.userId.username}
                            </p>
                            <p>{new Date(review.createdAt).toDateString()} {new Date(review.createdAt).toLocaleTimeString()}</p>
                          </div>
                          <div className="rating">
                            <p>{review.rating}</p>
                            <AiOutlineStar className="star-icon" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Anime;
