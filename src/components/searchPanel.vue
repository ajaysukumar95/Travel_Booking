<template>
  <v-container>
    <v-row justify="center">
      <v-card min-width="400" class="mx-auto px-7 py-5 elevation-8">
        <h1 class="text-center pb-5">Booking App</h1>
        <v-form v-model="valid" ref="form" lazy-validation>
          <!-- source selection -->
          <v-autocomplete
            v-model="sourceSelection"
            :rules="nameRules"
            item-value="PlaceId"
            item-text="PlaceName"
            required
            :return-object="true"
            :items="sourceLocation"
            dense
            filled
            label="From*"
          ></v-autocomplete>
          <!-- source selection -->
          <!-- Destination selection -->
          <v-autocomplete
            v-model="destinationSelection"
            :items="destinationLocation"
            :return-object="true"
            :rules="nameRules"
            item-value="PlaceId"
            item-text="PlaceName"
            filled
            required
            dense
            label="To*"
          ></v-autocomplete>
          <!-- Destination selection -->
          <!-- Depature date picker -->
          <v-menu
            v-model="depatureMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="depatureDate"
                label="Depature Date*"
                clearable
                :rules="[v => !!v || 'Date is required']"
                required
                prepend-inner-icon="mdi-calendar"
                readonly
                filled
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="depatureDate" @input="depatureMenu = false"></v-date-picker>
          </v-menu>
          <!-- Depature date picker -->
          <!-- Return date picker -->
          <v-menu
            v-model="returnMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="returnDate"
                label="Return Date"
                prepend-inner-icon="mdi-calendar"
                readonly
                filled
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="returnDate" @input="returnMenu = false"></v-date-picker>
          </v-menu>
          <!-- Return date picker -->
          <!-- Search Button -->
        </v-form>
        <v-btn depressed block @click="getSearchInput" color="primary">search</v-btn>
        <!-- Search Button -->
      </v-card>
    </v-row>
    <div v-show="errorMessage">
      <errorModalDialog></errorModalDialog>
    </div>
  </v-container>
</template>

<script>
import apiServiceCall from "../service/apiCall";
import { eventBus } from "@/eventBus";
const errorModalDialog = () => ({
  component: import("@/components/errorModalDialog")
});
export default {
  name: "searchPanel",
  components: {
    errorModalDialog
  },
  data: () => ({
    valid: true,
    nameRules: [v => !!v || "location name is required"],
    sourceLocation: [],
    destinationLocation: [],
    sourceSelection: null,
    destinationSelection: null,
    depatureDate: null,
    returnDate: null,
    errorMessage: "",
    flightListOneTrip: [],
    flightListRoundTrip: [],
    depatureMenu: false,
    returnMenu: false
  }),
  created() {
    // Get Location Details 
    apiServiceCall.getLoactionDetails().then(response => {
      this.sourceLocation = response;
      this.destinationLocation = response;
    });
  },
  methods: {
    // Get search Input
    getSearchInput() {
      this.$refs.form.validate();
      let oneTripSearchQuery = {
        source: this.sourceSelection.PlaceId,
        destination: this.destinationSelection.PlaceId,
        date: this.depatureDate
      };
      var roundTripSearchQuery = {
        source: this.destinationSelection.PlaceId,
        destination: this.sourceSelection.PlaceId,
        date: this.returnDate
      };
      let searchQuerySelections = {
        source: this.sourceSelection.PlaceName,
        destination: this.destinationSelection.PlaceName,
        depature: this.depatureDate,
        arrival: this.returnDate
      };

      // Date selection validation
      let currentDate = this.moment().format("YYYY-MM-DD");
      if (this.moment(this.depatureDate).isBefore(currentDate)) {
        this.errorMessage = "Selected depature date is prior to Today";
        eventBus.$emit("errorMessageTrigger", this.errorMessage);
      } else if (this.moment(this.returnDate).isBefore(currentDate)) {
        this.errorMessage = "Selected arrival date is prior to Today";
        eventBus.$emit("errorMessageTrigger", this.errorMessage);
      } else if (this.moment(this.returnDate).isBefore(this.depatureDate)) {
        this.errorMessage = "Selected arrival date is prior to depature date";
        eventBus.$emit("errorMessageTrigger", this.errorMessage);
      } else {
        // Round Trip Selection api call
        if (
          this.sourceSelection &&
          this.destinationSelection &&
          this.depatureDate &&
          this.returnDate
        ) {
          this.$router.push({ path: "/flightDetails" });
          apiServiceCall.getFlightList(oneTripSearchQuery).then(response => {
            this.flightListOneTrip = response;
            apiServiceCall
              .getFlightList(roundTripSearchQuery)
              .then(response => {
                this.flightListRoundTrip = response;
                var roundTripList = this.flightListOneTrip
                  .filter(x =>
                    this.flightListRoundTrip.some(y => y.name == x.name)
                  )
                  .map(x => {
                    var returnFlight = this.flightListRoundTrip.find(
                      y => y.name == x.name
                    );
                    return {
                      name: x.name,
                      DepartureDate: x.DepartureDate,
                      ReturnDate: returnFlight.DepartureDate,
                      DepatureCost: x.Price,
                      ArrivalCost: returnFlight.Price,
                      totalPrice: x.Price + returnFlight.Price
                    };
                  });
                // Passing roundtrip details to list component
                eventBus.$emit(
                  "selectedFlightDetails",
                  roundTripList,
                  searchQuerySelections
                );
              });
          });
        } else if (
          this.sourceSelection &&
          this.destinationSelection &&
          this.depatureDate
        ) {
          // One trip selection API call
          this.$router.push({ path: "/flightDetails" });
          apiServiceCall.getFlightList(oneTripSearchQuery).then(response => {
            this.flightListOneTrip = response;
             // Passing One trip details to list component
            eventBus.$emit(
              "selectedFlightDetails",
              this.flightListOneTrip,
              searchQuerySelections
            );
          });
        }
      }
    }
  }
};
</script>
