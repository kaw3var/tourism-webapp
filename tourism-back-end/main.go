package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"tourism-back-end/data"
	"tourism-back-end/models"

	_ "github.com/denisenkom/go-mssqldb"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	connectionString := "sqlserver://localhost:1433?database=TourismDB&Integrated%20Security=true"

	db, err := sql.Open("sqlserver", connectionString)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to the database")

	r := mux.NewRouter()

	// API endpoint to get clients
	r.HandleFunc("/api/clients", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for /api/clients")
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
		json.NewEncoder(w).Encode(clients)
	}).Methods("GET")

	// API endpoint to get a specific client by ID
	r.HandleFunc("/api/clients/{id}", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for /api/clients/{id}")
		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, "Invalid ClientID", http.StatusBadRequest)
			return
		}

		client, err := data.GetClientByID(db, id)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Client not found", http.StatusNotFound)
			} else {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(client)
	}).Methods("GET")

	// API endpoint to get price and name of route
	r.HandleFunc("/api/route-costs", func(w http.ResponseWriter, r *http.Request) {
		routeCost, err := data.GetRouteCost(db)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		log.Println("Received request for /api/route-costs")
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(routeCost)
	}).Methods("GET")

	// API endpoint to update client by ID
	r.HandleFunc("/api/clients/{id}", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for PUT /api/clients/{id}")
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

		err = data.UpdateClientByID(db, id, client.FirstName, client.LastName, client.MiddleName, client.Phone, client.Address)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}).Methods("PUT")

	// API endpoint to delete client by ID
	r.HandleFunc("/api/clients/{id}", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for DELETE /api/clients/{id}")
		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, "Invalid ClientID", http.StatusBadRequest)
			return
		}

		err = data.DeleteClientByID(db, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}).Methods("DELETE")

	corsOptions := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:3000"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
		handlers.AllowCredentials(),
	)

	// Начало сервера с CORS
	log.Fatal(http.ListenAndServe(":8080", corsOptions(r)))
}
