import api from '../../../share/api/api';
import { useEffect, useState } from "react";

const useTrips = () => {
    const [trip, setTrip] = useState([]);
    const [tripData, setTripData] = useState({
        ClientID: '',
        RouteID: '',
        DiscountID: '',
        TripDate: '',
        TripDuration: '',
        NumberOfTickets: ''
    });
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTripId, setEditTripId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null);

    useEffect(() => {
        fetchTripInfo();
    }, [])

    const fetchTripInfo = async () => {
        try {
            const response = await api.get('/book-tour');
            if (response.status === 204) {
                setTrip([]);
            } else {
                setTrip(response.data);
            }
        } catch(error) {
            console.error('Error fetching trip info', error);
        }
    };

    const handleEdit = async (id) => {
        const tripToEdit = trip.find(trip => trip.TripID === id);
        if (tripToEdit) {
            setTripData({
                ClientID: tripToEdit.ClientID,
                RouteID: tripToEdit.RouteID,
                DiscountID: tripToEdit.DiscountID,
                TripDate: tripToEdit.TripDate,
                TripDuration: tripToEdit.TripDuration,
                NumberOfTickets: tripToEdit.NumberOfTickets
            });
            setIsEditing(true);
            setEditTripId(id);
            setIsAdding(true);
        }
    };

    const handleDelete = async () => {
        if (tripToDelete) {
            try {
                await api.delete(`/book-tour/${tripToDelete}`);
                fetchTripInfo();
                console.log('Trip deleted successful')
            } catch (error) {
                console.error(`Error deleting trip with ID ${tripToDelete}`, error);
            } finally {
                closeDeleteConfirm();
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTripData({ ...tripData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            try {
                await api.put(`/book-tour/${editTripId}`, tripData);
                setIsEditing(false);
                setEditTripId(null);
            } catch (error) {
                console.error(`Error updating trip with ID ${editTripId}`, error);
            }
        } else {
            try {
                await api.post('/book-tour', tripData);
            } catch (error) {
                console.error('Error adding new trip', error)
            }
        }
        setIsAdding(false);
        fetchTripInfo();
    };

    const clearFormFields = () => {
        setTripData({
            ClientID: '',
            RouteID: '',
        });
    };

    const handleAddButtonClick = () => {
        clearFormFields();
        setIsAdding(true);
    };

    const handleCloseForm = () => {
        clearFormFields();
        setIsAdding(false);
        setIsEditing(false);
        setEditTripId(null);
        closeDeleteConfirm();
    };

    const openDeleteConfirm = (id) => {
        setTripToDelete(id);
        setShowDeleteConfirm(true);
    };

    const closeDeleteConfirm = () => {
        setTripToDelete(null);
        setShowDeleteConfirm(false);
    };

    return {
        trip,
        tripData,
        isAdding,
        isEditing,
        showDeleteConfirm,
        handleSubmit,
        handleEdit,
        handleDelete,
        handleChange,
        handleCloseForm,
        handleAddButtonClick,
        openDeleteConfirm,
        closeDeleteConfirm,
    };
};

export default useTrips;