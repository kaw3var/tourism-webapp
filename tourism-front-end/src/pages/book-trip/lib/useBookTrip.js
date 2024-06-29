import api from '../../../share/api/api';
import { useEffect, useState } from "react";
import { FormInput } from '../../../share';

const useBookTrip = () => {
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

    const formInputs = [
        {
            value: tripData.ClientID,
            label: 'Номер клиента',
            name: 'ClientID',
            placeholder: 'Номер клиента',
            required: true,
            onChange: handleChange
        },
        {
            value: tripData.RouteID,
            label: 'Номер маршрута',
            name: 'RouteID',
            placeholder: 'Номер маршрута',
            required: true,
            onChange: handleChange
        },
        {
            value: tripData.DiscountID,
            label: 'Скидка',
            name: 'DiscoundID',
            placeholder: 'Скидка',
            required: true,
            onChange: handleChange
        },
        {
            value: tripData.TripDate,
            label: 'Дата',
            name: 'TripDate',
            placeholder: 'Дата',
            required: true,
            onChange: handleChange
        },
        {
            value: tripData.TripDuration,
            label: 'Длительность поездки',
            name: 'TripDuration',
            placeholder: 'Длительность поездки',
            required: true,
            onChange: handleChange
        },
        {
            value: tripData.NumberOfTickets,
            label: 'Количество билетов',
            name: 'NumberOfTickets',
            placeholder: 'Количество билетов',
            required: true,
            onChange: handleChange
        }
      ];

    const list = () => {
        const listItems = formInputs.map((item)=>
          <FormInput value={item.value} label={item.label} name={item.name} 
          placeholder={item.placeholder} required={item.required} onChange={item.onChange} /> 
        );
        return ( listItems );
    };

    return {
        trip,
        isAdding,
        isEditing,
        showDeleteConfirm,
        handleSubmit,
        handleEdit,
        handleDelete,
        handleCloseForm,
        handleAddButtonClick,
        openDeleteConfirm,
        closeDeleteConfirm,
        list,
    };
};

export default useBookTrip;