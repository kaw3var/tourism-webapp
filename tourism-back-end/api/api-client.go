package api

import (
	"database/sql"
	"encoding/json"
	"errors"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"strconv"
	"tourism-back-end/data"
	"tourism-back-end/models"
)

func ClientRoutes(r *mux.Router, db *sql.DB) {
	// API endpoint to GET CLIENTS
	r.HandleFunc("/api/clients", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request to GET /api/clients")
		clients, err := data.GetClients(db)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if len(clients) == 0 {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		err = json.NewEncoder(w).Encode(clients)
		if err != nil {
			return
		}
	}).Methods("GET")

	// API endpoint to GET a SPECIFIC CLIENT by ID
	r.HandleFunc("/api/clients/{id}", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request to GET /api/clients/{id}")
		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, "Invalid ClientID", http.StatusBadRequest)
			return
		}

		client, err := data.GetClientByID(db, id)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				http.Error(w, "Client not found", http.StatusNotFound)
			} else {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			return
		}

		w.Header().Set("Content-Type", "application/json")
		err = json.NewEncoder(w).Encode(client)
		if err != nil {
			return
		}
	}).Methods("GET")

	// API endpoint to CREATE CLIENT
	r.HandleFunc("/api/clients", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request to POST /api/clients")
		var client models.Client
		err := json.NewDecoder(r.Body).Decode(&client)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		err = data.CreateClient(db, client.FirstName, client.LastName, client.MiddleName, client.Phone, client.Address)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}).Methods("POST")

	// API endpoint to UPDATE CLIENT by ID
	r.HandleFunc("/api/clients/{id}", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request to PUT /api/clients/{id}")
		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, "Invalid ClientID", http.StatusBadRequest)
			return
		}

		var client models.Client
		err = json.NewDecoder(r.Body).Decode(&client)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		err = data.UpdateClient(db, id, client.FirstName, client.LastName, client.MiddleName, client.Phone, client.Address)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}).Methods("PUT")

	// API endpoint to DELETE CLIENT by ID
	r.HandleFunc("/api/clients/{id}", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for DELETE /api/clients/{id}")
		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, "Invalid ClientID", http.StatusBadRequest)
			return
		}

		err = data.DeleteClient(db, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}).Methods("DELETE")

}
