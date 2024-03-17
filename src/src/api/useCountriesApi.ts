import axios from "axios";

export const useCountriesApi = () =>({
    getCountries: async() => {
        const response = await axios.get('https://restcountries.com/v3.1/all')
        return {
            countries: response.data
        }

    }
})