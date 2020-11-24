import axios from 'axios';

// Base URL
const baseUrl = 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices';

// Header configuration
let config = {
    headers: {
        "x-rapidapi-key": "04e4406573msh80083324d30e611p14211ajsn57c73fe27e6c",
        "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        "useQueryString": true
    },
    params: {
        "query": "US"
    },
}

class apiServiceCall {
    // Get Location Details
    static getLoactionDetails() {
        let locationUrl = `${baseUrl}/autosuggest/v1.0/US/USD/en-US/`;
        return axios.get(locationUrl, config).then(response => {
            return response.data.Places.map(item => {
                let locationObj = {
                    PlaceName: item.PlaceName,
                    PlaceId: item.PlaceId
                };
                return locationObj;
            });
        });

    }
    static getFlightList(searchQuery) {
        // Get Flight List
        let flightListUrl = `${baseUrl}/browseroutes/v1.0/US/USD/en-US/${searchQuery.source}/${searchQuery.destination}/${searchQuery.date}`;
        return axios.get(flightListUrl, config).then(response => {
            var flightListObj = response.data;
            var flightList = flightListObj.Carriers.map(carry => {
                var quote = flightListObj.Quotes.find(x => x.OutboundLeg.CarrierIds.some(y => y == carry.CarrierId));
                var route = flightListObj.Routes.find(x => x.QuoteIds && x.QuoteIds.some(y => y == quote.QuoteId));
                return {
                    name: carry.Name,
                    DepartureDate: quote.OutboundLeg.DepartureDate,
                    Direct: quote.Direct,
                    Price: route.Price
                };
            })
            return flightList;
        });
    }
}


export default apiServiceCall;