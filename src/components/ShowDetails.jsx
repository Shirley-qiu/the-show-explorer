import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const tmdbUrl = "https://www.themoviedb.org/tv";
const numOtherShows = 6;

class ShowDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showDetails: null,
            otherShows: null
        };
    }

    async componentDidMount() {
        console.log("ShowDetails component mounted");
        console.log("Show ID:", this.props.showId);

        const { showId, fetchShowDetails, fetchOtherShows } = this.props;
        const showDetails = await fetchShowDetails(showId);
        const otherShows = await fetchOtherShows(showId);
        document.show = `${showDetails.name} ${(showDetails.original_name !== showDetails.name) ? "(" + showDetails.original_name + ")" : ""} | Discover Asian Dramas`;
        this.setState({
            showDetails: showDetails,
            otherShows: otherShows
        });
        console.log(showDetails);
        console.log(otherShows);
    }

    render() {
        const { getPoster, getBackdrop, getNetwork } = this.props;
        const { showDetails } = this.state;

        return (
            (showDetails !== null && !showDetails.response) ?
                <div className="showDetailsComponent">
                    <div className="backdrop" style={{ backgroundImage: `url(${getBackdrop(showDetails.backdrop_path, "w780")}` }}></div>
                    <div className="showData">
                        <div className="showPoster mb-4">
                            <a href={`${tmdbUrl}/${showDetails.id}`} target="_blank" rel="noreferrer">
                                <img alt={showDetails.name} src={getPoster(showDetails.poster_path, "w500")} />
                            </a>
                        </div>
                        <div className="showContent">
                            <div>
                                <h4>{showDetails.name} <br /> {(showDetails.original_name !== showDetails.name) ? showDetails.original_name : ""}</h4>
                            </div>
                            <div className="mt-4">
                                <h5>Rating: {showDetails.vote_average}/10 <FontAwesomeIcon icon={faStar} color="orange" ></FontAwesomeIcon></h5>
                                <h6>{showDetails.vote_count} votes</h6>
                            </div>
                            <div className="mt-4">
                                <h5>{
                                    showDetails.networks.map((network) => (
                                        <a key={network.id} href={(showDetails.homepage !== "") ? showDetails.homepage : "#"} target={(showDetails.homepage !== "") ? "_blank" : ""} rel="noreferrer"><img className="mr-4" alt={network.name} src={getNetwork(network.logo_path, "w92")}></img></a>
                                    ))
                                }
                                </h5>
                            </div>
                            <div className="mt-4">
                                <h5>Air Date: {showDetails.first_air_date}</h5>
                            </div>
                            <div>
                                <h5>Episodes: {showDetails.number_of_episodes}</h5>
                            </div>
                            <div className="mt-4">
                                <h6>Genres:&nbsp;
                                    {
                                        showDetails.genres.map((genre) => (
                                            genre.name + " • "
                                        ))
                                    }
                                </h6>
                            </div>
                            <div>
                                <h6>Language: {showDetails.original_language}</h6>
                            </div>
                            <div className="mt-4">
                                <h6>Overview:</h6><p>{showDetails.overview}</p>
                            </div>
                            <div>
                                <h4 className="otherShowsHeading">Recommendations:</h4>
                            </div>
                        </div>
                    </div>
                    <div className="otherShows">
                        {
                            this.state.otherShows.slice(0,numOtherShows).map((otherShow, index) => (
                                <div key={index} className="otherShowPoster mb-4">
                                    <Link to={`/show/${otherShow.id}`}>
                                        <img alt={otherShow.name} src={getPoster(otherShow.poster_path, "w500")} />
                                    </Link>
                                    <p className="mt-3"><b>{otherShow.name} <br /> {(otherShow.original_name !== otherShow.name) ? otherShow.original_name : ""}</b></p>
                                </div>
                            ))
                        }
                    </div>
                </div>
                : <div>
                    <div className="p-4 m-3">
                        <h5>Invalid Show ID.</h5>
                    </div>
                </div>
        );
    }
}

export default ShowDetails;