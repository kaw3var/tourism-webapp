package data

import (
	"database/sql"
	"errors"
	"tourism-back-end/models"
)

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
		err := rows.Scan(&route.RouteID, &route.RouteName, &route.RouteDescription, &route.RoutePrice, &route.RouteImg)
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

// GetRouteByID get route from the db
func GetRouteByID(db *sql.DB, routeID int) (models.Route, error) {
	row := db.QueryRow("SELECT * FROM dbo.Routes WHERE route_id = ?", routeID)
	var route models.Route

	err := row.Scan(&route.RouteID, &route.RouteName, &route.RouteDescription, &route.RoutePrice, &route.RouteImg)
	if err != nil {
		if err == sql.ErrNoRows {
			return models.Route{}, errors.New("route not found")
		}
		return models.Route{}, err
	}
	return route, nil
}

// CreateRoute add route to the db
func CreateRoute(db *sql.DB, RouteName, RouteDescription string, RoutePrice int, RouteImg string) error {
	query := `INSERT INTO dbo.Routes (RouteName, RouteDescription, RoutePrice, RouteImg) VALUES (@p1, @p2, @p3, @p4)`
	_, err := db.Exec(query, RouteName, RouteDescription, RoutePrice, RouteImg)
	if err != nil {
		return err
	}
	return nil
}

// DeleteRoute delete route from the db
func DeleteRoute(db *sql.DB, routeID int) error {
	query := `DELETE FROM dbo.Routes WHERE RouteID = @RouteID`
	_, err := db.Exec(query, sql.Named("RouteID", routeID))
	if err != nil {
		return err
	}
	return nil
}

// UpdateRoute update route info in the db
func UpdateRoute(db *sql.DB, routeID int, RouteName, RouteDescription string, RoutePrice int, RouteImg string) error {
	query := `UPDATE dbo.Routes SET 
                      RouteName = @RouteName, 
                      RouteDescription = @RouteDescription, 
                      RoutePrice = @RoutePrice,
                      RouteImg = @RouteImg
                  WHERE RouteID = @RouteID`
	_, err := db.Exec(query,
		sql.Named("RouteID", routeID),
		sql.Named("RouteName", RouteName),
		sql.Named("RouteDescription", RouteDescription),
		sql.Named("RoutePrice", RoutePrice),
		sql.Named("RouteImg", RouteImg))
	if err != nil {
		return err
	}
	return nil
}
