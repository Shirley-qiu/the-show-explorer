import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Scroller from "react-infinite-scroller";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

class Shows extends Component {

    componentDidMount() {
        document.title = "The Show Explorer";
    }

    render() {
        const { shows, queryShows, searchQuery, currentPage, totalPages, totalResults, queryTotalResults, getPoster, nextPage } = this.props;
        const showsToDisplay = searchQuery !== "" ? queryShows : shows;

        return (
            <div className="Shows">
                {
                    (showsToDisplay.length !== 0) ? console.log(showsToDisplay) : null
                }
                <div className="resultsNum">
                    {
                        (searchQuery === "") ? <b>Displaying: {queryTotalResults} of {totalResults} results</b>
                            : <b>Displaying: {queryTotalResults} results</b>
                    }
                </div>
                {
                    (showsToDisplay.length !== 0) ?
                        <Scroller
                            className="scroller"
                            loadMore={nextPage}
                            hasMore={currentPage < totalPages}
                            loader={
                                <div key={0} className="loader" >
                                    <h6>Loading shows...</h6>
                                    <br />
                                    <Spinner animation="border" />
                                </div>
                            }
                        >
                            <div className="showListContainer">
                                {
                                    showsToDisplay.map((show, index) => (
                                        <Link key={index} className="showLink" to={`/show/${show.id}`} >
                                            <div key={index} className="showInfo">
                                                <div className="showName">
                                                    <p><b>{show.name} <br /> {show.original_name !== show.name ? show.original_name : ""}</b></p>
                                                </div>
                                                <div className="showRating">
                                                    <p>
                                                        Rating: {show.vote_average}/10 <FontAwesomeIcon icon={faStar} color="orange" ></FontAwesomeIcon>
                                                        <br /> Air Date: {show.first_air_date}
                                                    </p>
                                                </div>
                                                <div className="showThumbnail">
                                                    <p><img alt={show.name} src={getPoster(show.poster_path, "w500")}></img></p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>
                            <br />
                        </Scroller>
                        :
                        <div className="m-5">
                            <h5>No shows found for this query.</h5>
                        </div>
                }
                <br />
            </div>
        );
    }
}

export default Shows;