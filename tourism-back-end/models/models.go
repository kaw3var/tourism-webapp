package models

import (
	"time"
)

// Client
type Client struct {
	ClientID   int
	LastName   string
	FirstName  string
	MiddleName *string
	Phone      string
	Address    string
}

// Discounts
type Discount struct {
	DiscountID          int
	DiscountAmount      int
	DiscountDescription string
}

// Route
type Route struct {
	RouteID          int
	RouteName        string
	RouteDescription string
	RoutePrice       int
	RouteImg         string
}

// Trip
type Trip struct {
	TripID          int
	ClientID        int
	RouteID         int
	Discount        *int
	TripDate        time.Time
	TripDuration    time.Duration
	NumberOfTickets int
}
