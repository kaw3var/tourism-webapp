import api from '../../../share/api/api';
import { useEffect, useState } from "react";
import { FormInput } from '../../../share';


const useClients = () => {
    const [client, setClient] = useState([]);
    const [clientData, setClientData] = useState({
        LastName: '',
        FirstName: '',
        MiddleName: '',
        Phone: '',
        Address: ''
    });
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editClientId, setEditClientId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);

    useEffect(() => {
        fetchClientInfo();
    }, [])

    const fetchClientInfo = async () => {
        try {
            const response = await api.get('/clients');
            if (response.status === 204) {
                setClient([]);
            } else {
                setClient(response.data);
            }
        } catch(error) {
            console.error('Error fetching clients info', error);
        }
    };

    const handleEdit = async (id) => {
        const clientToEdit = client.find(client => client.ClientID === id);
        if (clientToEdit) {
            setClientData({
                LastName: clientToEdit.LastName,
                FirstName: clientToEdit.FirstName,
                MiddleName: clientToEdit.MiddleName,
                Phone: clientToEdit.Phone,
                Address: clientToEdit.Address
            });
            setIsEditing(true);
            setEditClientId(id);
            setIsAdding(true);
        }
    };

    const handleDelete = async () => {
        if (clientToDelete) {
            try {
                await api.delete(`/clients/${clientToDelete}`);
                fetchClientInfo();
                console.log('Client deleted successful')
            } catch (error) {
                console.error(`Error deleting client with ID ${clientToDelete}`, error);
            } finally {
                closeDeleteConfirm();
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClientData({ ...clientData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            try {
                await api.put(`/clients/${editClientId}`, clientData);
                setIsEditing(false);
                setEditClientId(null);
            } catch (error) {
                console.error(`Error updating client with ID ${editClientId}`, error);
            }
        } else {
            try {
                await api.post('/clients', clientData);
            } catch (error) {
                console.error('Error adding new client', error)
            }
        }
        setIsAdding(false);
        fetchClientInfo();
    };

    const clearFormFields = () => {
        setClientData({
            LastName: '',
            FirstName: '',
            MiddleName: '',
            Phone: '',
            Address: ''
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
        setEditClientId(null);
        closeDeleteConfirm();
    };

    const openDeleteConfirm = (id) => {
        setClientToDelete(id);
        setShowDeleteConfirm(true);
    };

    const closeDeleteConfirm = () => {
        setClientToDelete(null);
        setShowDeleteConfirm(false);
    };

    const formInputs = [
        {
            value: clientData.LastName,
            label: 'Фамилия',
            name: 'LastName',
            placeholder: 'Фамилия',
            required: true,
            onChange: handleChange
        },
        {
            value: clientData.FirstName,
            label: 'Имя',
            name: 'FirstName',
            placeholder: 'Имя',
            required: true,
            onChange: handleChange
        },
        {
            value: clientData.MiddleName,
            label: 'Отчество',
            name: 'MiddleName',
            placeholder: 'Отчество',
            required: true,
            onChange: handleChange
        },
        {
            value: clientData.Phone,
            label: 'Телефон',
            name: 'Phone',
            placeholder: 'Телефон',
            required: true,
            onChange: handleChange
        },
        {
            value: clientData.Address,
            label: 'Адрес',
            name: 'Address',
            placeholder: 'Адрес',
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
        client,
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

export default useClients;