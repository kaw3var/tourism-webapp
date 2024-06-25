package api

import (
	"database/sql"
	"encoding/json"
	"errors"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"strconv"
	"tourism-back-end/functions"
	"tourism-back-end/models"
)

func RouteTripRoutes(r *mux.Router, db *sql.DB) {
	// API endpoint to GET RouteTrip
	r.HandleFunc("/api/routes", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request to GET /api/routes")
		routeTrip, err := data.GetRoutes(db)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		err = json.NewEncoder(w).Encode(routeTrip)
		if err != nil {
			return
		}
	}).Methods("GET")

	// API endpoint to GET RouteTrip by ID
	r.HandleFunc("/api/routes/{id}", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request to GET /api/routes/{id}")
		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		routeTrip, err := data.GetRouteByID(db, id)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				http.Error(w, "Client not found", http.StatusInternalServerError)
			} else {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			return
		}

		w.Header().Set("Content-Type", "application/json")
		err = json.NewEncoder(w).Encode(routeTrip)
		if err != nil {
			return
		}
	}).Methods("GET")

	// API endpoint to CREATE RouteTrip
	r.HandleFunc("/api/routes", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request to POST /api/routes")
		var routeTrip models.Route
		err := json.NewDecoder(r.Body).Decode(&routeTrip)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = data.CreateRoute(db, routeTrip.RouteName, routeTrip.RouteDescription, routeTrip.RoutePrice, routeTrip.RouteImg)
		if err != nil {
			log.Println("Error to POST CreateRoute")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}).Methods("POST")

	// API endpoint to UPDATE RouteTrip by ID
	r.HandleFunc("/api/routes/{id}", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request to PUT /api/routes/{id}")
		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, "Invalid RouteID", http.StatusBadRequest)
			return
		}

		var routeTrip models.Route
		err = json.NewDecoder(r.Body).Decode(&routeTrip)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		log.Printf("Updating route ID %d with data: %+v\n", id, routeTrip)

		err = data.UpdateRoute(db, id, routeTrip.RouteName, routeTrip.RouteDescription, routeTrip.RoutePrice, routeTrip.RouteImg)
		if err != nil {
			log.Printf("Error updating route: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}).Methods("PUT")

	// API endpoint to DELETE RouteTrip by ID
	r.HandleFunc("/api/routes/{id}", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request to DELETE /api/routes/{id}")
		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = data.DeleteRoute(db, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}).Methods("DELETE")
}
