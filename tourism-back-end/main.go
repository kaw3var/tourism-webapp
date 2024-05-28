package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"tourism-back-end/data"

	_ "github.com/denisenkom/go-mssqldb"
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
			http.Error(w, err.Error(), http.StatusInternalServerError)
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

	r.Use(enableCORS)

	log.Fatal(http.ListenAndServe(":8080", r))
}
