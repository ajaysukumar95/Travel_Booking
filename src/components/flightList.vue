<template>
  <v-container>
    <v-row>
      <v-col cols="12" xs="12" sm="3" md="9">
        <h2>Flight List</h2>
        <h3>Filters</h3>
        <v-row>
          <v-col cols="12" xs="12" sm="3" md="6">
            <v-slider
              v-model="Price"
              class="pt-3"
              label="Cost Filter"
              :min="lowCost"
              :max="highCost"
              @change="filterCost"
              thumb-label="always"
            ></v-slider>
          </v-col>
          <v-col cols="12" xs="12" sm="3" md="3">
            <v-select
              :items="direct"
              :disabled="roundTrip"
              v-model="directSelection"
              @change="filterCost"
              filled
              label="Direct"
            ></v-select>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" xs="12" sm="3" md="3" align-self="end">
        <h4 class="pb-2">
          From :
          <span class="font-weight-regular">{{sourceLocation}}</span>
        </h4>
        <h4 class="pb-2">
          To :
          <span class="font-weight-regular">{{destinationLocation}}</span>
        </h4>
        <h4 class="pb-2">
          Depature Date :
          <span class="font-weight-regular">{{depatureDate}}</span>
        </h4>
        <h4 class="pb-2" v-show="roundTrip">
          Return Date :
          <span class="font-weight-regular">{{returnDate}}</span>
        </h4>
      </v-col>
    </v-row>
    <v-data-table max-width="500" :headers="dynamicHeader" :items="filterCost" class="elevation-7">
      <template v-slot:item.DepartureDate="{ item }">
        <span>{{ item.DepartureDate | moment("DD/MM/YYYY") }}</span>
      </template>
      <template v-slot:item.ReturnDate="{ item }">
        <span>{{ item.ReturnDate | moment("DD/MM/YYYY") }}</span>
      </template>
      <template v-slot:item.Price="{ item }">
        <v-chip :color="getColor(item.Price)">{{ item.Price }}</v-chip>
      </template>
      <template v-slot:item.totalPrice="{ item }">
        <v-chip :color="getColor(item.totalPrice)" light>{{ item.Price }}</v-chip>
      </template>
    </v-data-table>
    <div v-show="errorModal()">
      <errorModalDialog></errorModalDialog>
    </div>
  </v-container>
</template>

<script>
import { eventBus } from "@/eventBus";
const errorModalDialog = () => ({
  component: import("@/components/errorModalDialog")
});

export default {
  name: "flightList",
  components: {
    errorModalDialog
  },
  data: () => ({
    direct: ["true", "false", "All"],
    directSelection: "All",
    costFilter: "",
    sourceLocation: "",
    destinationLocation: "",
    depatureDate: "",
    returnDate: "",
    roundTrip: true,
    errorMessage: "",
    dataReceived: false,
    Price: [],
    lowCost: "",
    highCost: "",
    headers: [
      {
        text: "Flight Name",
        align: "start",
        sortable: false,
        value: "name"
      },
      {
        text: "Depature Date",
        value: "DepartureDate",
        sortable: false
      }
    ],
    FlightList: []
  }),
  created() {
    // Getting Flight details response for One way and round trip
    eventBus.$on("selectedFlightDetails", (flightList, searctFilter) => {
      if (flightList && searctFilter) {
        this.dataReceived = true;
        this.FlightList = flightList;
        this.sourceLocation = searctFilter.source;
        this.destinationLocation = searctFilter.destination;
        this.depatureDate = searctFilter.depature;
        this.returnDate = searctFilter.arrival;
        this.Price = this.FlightList.map(item => item.Price);
        this.lowCost = Math.min(...this.Price);
        this.highCost = Math.max(...this.Price);
      }
    });
  },
  computed: {
    // Cost Filter logic
    filterCost() {
      this.costFilter = this.FlightList.filter(
        item =>
          item.Price >= this.Price &&
          item.Price <= this.highCost &&
          (this.directSelection == "All" ||
            (this.directSelection == "true" && item.Direct) ||
            (this.directSelection == "false" && !item.Direct))
      );
      return this.costFilter;
    },
    // Generate table header dynamically
    dynamicHeader() {
      if (this.dataReceived) {
        if (!this.returnDate) {
          this.roundTrip = false;
          this.headers.push(
            { text: "Cost($)", value: "Price", width: "200" },
            { text: "Direct", sortable: false, value: "Direct", width: "200" }
          );
        } else {
          this.headers.push(
            {
              text: "Arrival Date",
              value: "ReturnDate"
            },
            {
              text: "Depature Cost($)",
              value: "DepatureCost"
            },
            {
              text: "Arrival Cost($)",
              value: "ArrivalCost"
            },
            {
              text: "Total Cost($)",
              value: "totalPrice"
            }
          );
        }
        return this.headers;
      }
    }
  },
  methods: {
    // Differentiate high and low cost
    getColor(price) {
      if (this.FlightList.length > 1) {
      if (price == this.lowCost) return "green lighten-3";
      if (price == this.highCost) return "red lighten-3";
      else return "grey lighten-4";
      }
    },
    // Error pop up call 
    errorModal() {
      if (this.dataReceived) {
        if (this.FlightList.length < 1) {
          this.errorMessage = "No Flights available on the selected route";
          eventBus.$emit("errorMessageTrigger", this.errorMessage);
        }
      }
    }
  }
};
</script>

<style>
</style>