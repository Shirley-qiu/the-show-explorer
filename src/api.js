import axios from "axios";
import noPoster from "./images/no_image_poster.jpg";
import noBackdrop from "./images/no_image_backdrop.jpg";
const imageAPI = `https://image.tmdb.org/t/p`;

export const getShows = async (apiUrl) => {
	try {
		const { data: { total_pages, total_results, results } } = await axios.get(apiUrl);
		return { total_pages, total_results, results };
	} catch (err) {
		return err;
	}
};

export const getShowDetails = async (apiUrl) => {
	try {
		const { data } = await axios.get(apiUrl);
		return data;
	} catch (err) {
		return err;
	}
};

export const getOtherShows = async (apiUrl) => {
	try {
		const { data: { results } } = await axios.get(apiUrl);
		return results;
	} catch (err) {
		return err;
	}
};

export const getPoster = (image_path, image_size) => {
	if (image_path !== null) {
		return `${imageAPI}/${image_size}${image_path}`;
	}
	return noPoster;
};

export const getBackdrop = (image_path, image_size) => {
	if (image_path !== null) {
		return `${imageAPI}/${image_size}${image_path}`;
	}
	return noBackdrop;
};

export const getNetwork = (image_path, image_size) => {
	if (image_path !== null) {
		return `${imageAPI}/${image_size}${image_path}`;
	}
	return "";
};