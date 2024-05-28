package data

import (
	"database/sql"
	"fmt"
	"log"
	"tourism-back-end/models"
)

// GetClients retrieves the list of CLIENTS from the db
func GetClients(db *sql.DB) ([]models.Client, error) {
	rows, err := db.Query("SELECT * FROM dbo.Clients ")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var clients []models.Client
	for rows.Next() {
		var client models.Client
		err := rows.Scan(&client.ClientID, &client.LastName, &client.FirstName, &client.MiddleName, &client.Phone, &client.Address)
		if err != nil {
			return nil, err
		}
		clients = append(clients, client)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return clients, nil
}

// GetClientID by ID
func GetClientByID(db *sql.DB, id int) (models.Client, error) {
	query := `SELECT ClientID, FirstName, LastName, MiddleName, Phone, Address FROM Clients WHERE ClientID = @ClientID`
	row := db.QueryRow(query, sql.Named("ClientID", id))

	var client models.Client
	err := row.Scan(&client.ClientID, &client.FirstName, &client.LastName, &client.MiddleName, &client.Phone, &client.Address)
	if err != nil {
		if err == sql.ErrNoRows {
			return client, fmt.Errorf("client %d does not exist", id)
		}
		log.Printf("Error scanning row: %v", err)
		return client, err
	}
	return client, nil
}

// GetRoutes retrieves the list of ROUTES from the db
func GetRoutes(db *sql.DB) ([]models.Route, error) {
	rows, err := db.Query("SELECT * FROM dbo.Routes")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var routes []models.Route

	for rows.Next() {
		var route models.Route
		err := rows.Scan(&route.RouteID, &route.RouteDescription, &route.RouteName, &route.RoutePrice)
		if err != nil {
			return nil, err
		}
		routes = append(routes, route)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return routes, nil
}

// GetDiscounts retrieves the list of DISCOUNTS from the db
func GetDiscounts(db *sql.DB) ([]models.Discount, error) {
	rows, err := db.Query("SELECT * FROM dbo.Discounts")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var discounts []models.Discount
	for rows.Next() {
		var discount models.Discount
		err := rows.Scan(&discount.DiscountID, &discount.DiscountAmount, &discount.DiscountDescription)
		if err != nil {
			return nil, err
		}
		discounts = append(discounts, discount)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return discounts, nil
}

// GetTrips retrieves the list of TRIPS from the db
func GetTrips(db *sql.DB) ([]models.Trip, error) {
	rows, err := db.Query("SELECT * FROM dbo.Trips")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var trips []models.Trip
	for rows.Next() {
		var trip models.Trip
		err := rows.Scan(&trip.TripID, &trip.ClientID, &trip.RouteID, &trip.TripDuration, &trip.TripDate, &trip.Discount, &trip.NumberOfTickets)
		if err != nil {
			return nil, err
		}
		trips = append(trips, trip)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return trips, nil
}

// GetRouteCost retrieves the name and price
func GetRouteCost(db *sql.DB) ([]models.Route, error) {
	rows, err := db.Query("SELECT RouteID, RouteName, RoutePrice, RouteImg FROM dbo.Routes")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var routeCosts []models.Route
	for rows.Next() {
		var routeCost models.Route
		err := rows.Scan(&routeCost.RouteID, &routeCost.RouteName, &routeCost.RoutePrice, &routeCost.RouteImg)
		if err != nil {
			return nil, err
		}
		routeCosts = append(routeCosts, routeCost)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return routeCosts, nil
}
