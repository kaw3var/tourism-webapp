import axios from 'axios';
import { useState, useEffect } from 'react';

const useRoutes = () => {
  const [routeTrip, setRouteTrip] = useState([]);
  const [routeTripData, setRouteTripData] = useState({
    RouteName: '',
    RouteDescription: '',
    RoutePrice: '',
    RouteImg: '',
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTripId, setEditTripId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);

  useEffect(() => {
    fetchRouteInfo();
  }, []);

  const fetchRouteInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/routes');
      if (response.status === 204) {
        setRouteTrip([]);
      } else {
        setRouteTrip(response.data);
      }
    } catch (error) {
      console.error('Error fetching routes info', error);
    }
  };

  const handleEdit = async (id) => {
    const routeTripToEdit = routeTrip.find(routeTrip => routeTrip.RouteID === id);
    if (routeTripToEdit) {
      setRouteTripData({
        RouteName: routeTripToEdit.RouteName,
        RouteDescription: routeTripToEdit.RouteDescription,
        RoutePrice: routeTripToEdit.RoutePrice,
      });
      setIsEditing(true);
      setEditTripId(id);
      setIsAdding(true);
    }
  };

  const handleDelete = async () => {
    if (routeToDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/routes/${routeToDelete}`);
        fetchRouteInfo();
        console.log('RouteTrip deleted successful');
      } catch (error) {
        console.error(`Error deleting RouteTrip with ID ${routeToDelete}`, error);
      } finally {
        closeDeleteConfirm();
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRouteTripData({ ...routeTripData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const routeTripPayload = {
      RouteName: routeTripData.RouteName,
      RouteDescription: routeTripData.RouteDescription,
      RoutePrice: parseInt(routeTripData.RoutePrice),
      RouteImg: routeTripData.RouteImg,
    };

    if (isEditing) {
      try {
        await axios.put(`http://localhost:8080/api/routes/${editTripId}`, routeTripPayload);
        setIsEditing(false);
        setEditTripId(null);
      } catch (error) {
        console.error(`Error updating RouteTrip with ID ${editTripId}`, error);
      }
    } else {
      try {
        await axios.post('http://localhost:8080/api/routes', routeTripPayload);
      } catch (error) {
        console.error('Error adding new RouteTrip', error);
      }
    }
    clearFormFields();
    setIsAdding(false);
    fetchRouteInfo();
  };

  const clearFormFields = () => {
    setRouteTripData({
      RouteName: '',
      RouteDescription: '',
      RoutePrice: '',
      RouteImg: '',
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
    setRouteToDelete(id);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setRouteToDelete(null);
    setShowDeleteConfirm(false);
  };

  return {
    routeTrip,
    routeTripData,
    isAdding,
    isEditing,
    showDeleteConfirm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCloseForm,
    handleChange,
    handleAddButtonClick,
    openDeleteConfirm,
    closeDeleteConfirm,
  };
};

export default useRoutes;