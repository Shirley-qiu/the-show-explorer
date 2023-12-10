import React, { Component } from "react";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Filters from "./components/Filters.jsx";
import Shows from "./components/Shows";
import ShowDetails from "./components/ShowDetails.jsx";
import ScrollMemory from "react-router-scroll-memory";
import { getShows, getShowDetails, getOtherShows, getPoster, getBackdrop, getNetwork } from "./api.js";
import { Route, BrowserRouter as Router, Switch, Redirect } from "react-router-dom";


const apiKey = process.env.REACT_APP_TMDB_API_KEY;
const discoverAPIurl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&include_null_first_air_dates=false`;
const showAPIurl = `https://api.themoviedb.org/3/tv`;

console.log(process.env.REACT_APP_TMDB_API_KEY);

class App extends Component {
	constructor (props) {
		super(props);
		this.state = {
			theme               : "",
			display_lang        : "en-US",
			orig_lang           : "en",
			sort_by             : "popularity.desc",
			genres              : "18",
			air_date_year       : "",
			page                : 1,
			search_query        : "",
			query_shows        : [],
			shows              : [],
			total_pages         : 0,
			total_results       : 0,
			query_total_results : 0
		};
  }

  async componentDidMount () {
		const discoverAPI = `${discoverAPIurl}&language=${this.state.display_lang}&sort_by=${this.state
			.sort_by}&with_genres=${this.state.genres}&with_original_language=${this.state
			.orig_lang}&first_air_date_year=${this.state.air_date_year}&page=${this.state.page}`;
		const apiResult = await getShows(discoverAPI);
    if (apiResult && apiResult.results) {
      this.setState({
        shows               : apiResult.results,
        total_pages         : apiResult.total_pages,
        total_results       : apiResult.total_results,
        query_total_results : apiResult.results.length
      });
      this.initialState = this.state;
    } else {
      console.error('No shows data found.');
    }

		const bodyTag = document.querySelector("body");
		const cachedTheme = localStorage.getItem("theme");

		if (cachedTheme !== null) {
			bodyTag.classList.add("light");
			this.setState({ theme: cachedTheme });
		} else {
			bodyTag.classList.remove("light");
		}
	}

  fetchShowDetails = async (showId) => {
		const showAPI = `${showAPIurl}/${showId}?api_key=${apiKey}&language=${this.state.display_lang}`;
		return await getShowDetails(showAPI);
	};

	fetchOtherShows = async (showId) => {
		const recommendedShowAPI = `${showAPIurl}/${showId}/recommendations?api_key=${apiKey}&language=${this.state.display_lang}&page=1`;
		return await getOtherShows(recommendedShowAPI);
	}

	toggleTheme = () => {
		const { theme } = this.state;
		const bodyTag = document.querySelector("body");
		
		if (theme === "") {
			bodyTag.classList.add("light");
			this.setState({theme: "light"});
			localStorage.setItem("theme", "light");
		}
		else {
			bodyTag.classList.remove("light");
			this.setState({theme: ""});
			localStorage.removeItem("theme");
		}
	}

  resetState = () => {
		this.setState(this.initialState);
	};

	scrollToTop() {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }

	changeSortBy = async (event) => {
		const newSortBy = event.target.value;
		this.setState({
			sort_by : newSortBy,
			page    : 1
		});
		const discoverAPI = `${discoverAPIurl}&language=${this.state
			.display_lang}&sort_by=${newSortBy}&with_genres=${this.state.genres}&with_original_language=${this.state
			.orig_lang}&first_air_date_year=${this.state.air_date_year}&page=1`;
		const apiResult = await getShows(discoverAPI);
		this.setState({
			shows               : apiResult.results,
      total_pages         : apiResult.total_pages,
      total_results       : apiResult.total_results,
      query_total_results : apiResult.results.length
		});
		this.handleSearch(this.state.search_query, false);
	};

	changeLang = async (event) => {
		const newLang = event.target.value.split(',');
		this.setState({
			orig_lang : newLang,
			page      : 1
		});
		const discoverAPI = `${discoverAPIurl}&language=${this.state.display_lang}&sort_by=${this.state
			.sort_by}&with_genres=${this.state.genres}&with_original_language=${newLang}&first_air_date_year=${this
			.state.air_date_year}&page=1`;
		const apiResult = await getShows(discoverAPI);
		this.setState({
			  shows              : apiResult.results,
        total_pages         : apiResult.total_pages,
        total_results       : apiResult.total_results,
        query_total_results : apiResult.results.length
		});
		this.handleSearch(this.state.search_query, false);
	};

	changeYear = async (event) => {
		const newYear = event.target.value;
		this.setState({
			air_date_year : newYear,
			page          : 1
		});
		const discoverAPI = `${discoverAPIurl}&language=${this.state.display_lang}&sort_by=${this.state
			.sort_by}&with_genres=${this.state.genres}&with_original_language=${this.state
			.orig_lang}&first_air_date_year=${newYear}&page=1`;
		const apiResult = await getShows(discoverAPI);
		this.setState({
			shows               : apiResult.results,
      total_pages         : apiResult.total_pages,
      total_results       : apiResult.total_results,
      query_total_results : apiResult.results.length
		});
		this.handleSearch(this.state.search_query, false);
	};

	handleSearch = (query, nextPage) => {
		const shows = this.state.shows;
		if (query !== "") {
			if (!nextPage) {
				this.setState({
					page: 1
				});
			}
			const queryShows = shows.filter(
				(show) =>
          show.name.toLowerCase().includes(query.toLowerCase()) ||
          show.original_name.toLowerCase().includes(query.toLowerCase())
			);
			this.setState({
				search_query        : query,
				query_shows         : queryShows,
				query_total_results : queryShows.length
			});
		} else {
			this.setState({
				search_query        : "",
				query_shows        : [],
				query_total_results : shows.length
			});
		}
	};

	nextPage = () => {
		setTimeout(async () => {
			let set = new Set();
			this.setState({ page: this.state.page + 1 });
			const discoverAPI = `${discoverAPIurl}&language=${this.state.display_lang}&sort_by=${this.state
				.sort_by}&with_genres=${this.state.genres}&with_original_language=${this.state
				.orig_lang}&first_air_date_year=${this.state.air_date_year}&page=${this.state.page}`;
			const apiResult = await getShows(discoverAPI);
			let updatedShows = this.state.shows.concat(apiResult.results);
			updatedShows = updatedShows.filter(show => {
				if (!set.has(show.id)) {
					set.add(show.id);
					return true;
				}
				return false;
			}, set);
			this.setState({
				shows               : updatedShows,
        total_pages         : apiResult.total_pages,
        total_results       : apiResult.total_results,
        query_total_results : updatedShows.length
			});
			this.handleSearch(this.state.search_query, true);
		}, 500);
	};

  render() {
    return (
      <div className="AppComponent">
        <Router>
          <ScrollMemory />
          <Header toggleTheme={this.toggleTheme} />
          <Switch>
            <Route exact path="/">
                <Filters
                  getState={this.state}
                  resetState={this.resetState}
                  changeSortBy={this.changeSortBy}
                  changeLang={this.changeLang}
                  changeYear={this.changeYear}
                  handleSearch={this.handleSearch}
                />
                <Shows
                    shows={this.state.shows}
                    queryShows={this.state.query_shows}
                    searchQuery={this.state.search_query}
                    currentPage={this.state.page}
                    totalPages={this.state.total_pages}
                    totalResults={this.state.total_results}
                    queryTotalResults={this.state.query_total_results}
                    getPoster={getPoster}
                    nextPage={this.nextPage}
                  />
            </Route>
            <Route
				exact
				path="/show/:id"
				render={(props) => (
					<ShowDetails
						key={props.match.params.id}
						showId={props.match.params.id}
						fetchShowDetails={this.fetchShowDetails}
						fetchOtherShows={this.fetchOtherShows}
						getPoster={getPoster}
						getBackdrop={getBackdrop}
						getNetwork={getNetwork}
					/>
				)}
			/>
				<Redirect to="/" />
          </Switch>
        </Router>
      </div>
    );
  }
}


export default App;
