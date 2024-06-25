package data

import (
	"database/sql"
	"tourism-back-end/models"
)

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
