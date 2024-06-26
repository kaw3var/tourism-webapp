import api from '../../../share/api/api';
import { useState, useEffect } from 'react';

const useRoutes = () => {
  const [routeTrip, setRouteTrip] = useState([]);
  const [routeTripData, setRouteTripData] = useState({
    RouteName: '',
    RouteDescription: '',
    RoutePrice: '',
    RouteImgFile: '',
    RouteImgUrl: '',
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
      const response = await api.get('/routes');
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
        RouteImg: routeTripToEdit.RouteImg,
      });
      setIsEditing(true);
      setEditTripId(id);
      setIsAdding(true);
    }
  };

  const handleDelete = async () => {
    if (routeToDelete) {
      try {
        await api.delete(`/routes/${routeToDelete}`);
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
      RouteImg: routeTripData.RouteImgFile || routeTripData.RouteImgUrl,
    };

    if (isEditing) {
      try {
        await api.put(`/routes/${editTripId}`, routeTripPayload);
        setIsEditing(false);
        setEditTripId(null);
      } catch (error) {
        console.error(`Error updating RouteTrip with ID ${editTripId}`, error);
      }
    } else {
      try {
        await api.post('/routes', routeTripPayload);
      } catch (error) {
        console.error('Error adding new RouteTrip', error);
      }
    }
    setIsAdding(false);
    fetchRouteInfo();
  };

  const handleFilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file, () => { e.target.value = null; });
    }
  };

  const handleFileDrop = (ev) => {
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      [...ev.dataTransfer.items].forEach((item) => {
        if (item.kind === "file" && ["image/png", "image/gif", "image/jpg", "image/jpeg"].includes(item.type)) {
          const file = item.getAsFile();
          if (file.size > 500000) { 
            alert("File is too large.");
          } else {
            processFile(file, () => {});
          }
        } else {
          alert("Invalid file type.");
        }
      });
    }
  };

  const processFile = (file) => {
    const allowedFormats = ['image/png', 'image/jpg', 'image/jpeg'];
    if (allowedFormats.includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRouteTripData({ ...routeTripData, RouteImgFile: reader.result, RouteImgUrl: '' });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Допустимые форматы: png, jpg, jpeg');
    }
  };

  const clearFormFields = () => {
    setRouteTripData({
      RouteName: '',
      RouteDescription: '',
      RoutePrice: '',
      RouteImgFile: '',
      RouteImgUrl: '',
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
    handleFilePhotoChange,
    handleAddButtonClick,
    handleFileDrop,
    openDeleteConfirm,
    closeDeleteConfirm,
  };
};

export default useRoutes;