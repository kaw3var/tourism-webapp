package api

import (
	"database/sql"
	"encoding/json"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"tourism-back-end/data"
	//"tourism-back-end/models"
)

func TripRoutes(r *mux.Router, db *sql.DB) {
	// API endpoint to GET Trip
	r.HandleFunc("/api/trip", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request to GET /api/trip")
		trip, err := data.GetTrips(db)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		err = json.NewEncoder(w).Encode(trip)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	})
}
