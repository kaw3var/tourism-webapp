import axios from "axios";
import { useEffect, useState } from "react";

const Profile = () => {
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

    useEffect(() => {
        fetchClientInfo();
    }, [])

    const fetchClientInfo = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/clients');
            if (response.status === 204) {
                setClient([]);
            } else {
                setClient(response.data);
            }
        } catch(error) {
            console.error('Error fetching client info', error);
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

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этого клиента?')) {
            try {
                await axios.delete(`http://localhost:8080/api/clients/${id}`);
                fetchClientInfo();
                console.log('Client deleted successful')
            } catch (error) {
                console.error(`Error deleting client with ID ${id}`, error);
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
                await axios.put(`http://localhost:8080/api/clients/${editClientId}`, clientData);
                setIsEditing(false);
                setEditClientId(null);
            } catch (error) {
                console.error(`Error updating client with ID ${editClientId}`, error);
            }
        } else {
            try {
                await axios.post('http://localhost:8080/api/clients', clientData);
            } catch (error) {
                console.error('Error adding new client', error)
            }
        }
        setClientData({
            LastName: '',
            FirstName: '',
            MiddleName: '',
            Phone: '',
            Address: ''
        });
        setIsAdding(false);
        fetchClientInfo();
    };

    return (  
        <div className="container">
            <div className="clients">
                <h1 className="page__title">Клиенты</h1>
                <div className="add-block">
                    {!isAdding && (
                        <button onClick={() => setIsAdding(true)}>
                            Добавить клиента
                        </button>
                    )}
                </div>
                {isAdding && (
                    <form className="form-card" onSubmit={handleSubmit}>
                        <div className="form-card__info">
                            <label>Фамилия</label>
                            <input
                                type="text"
                                name="LastName"
                                value={clientData.LastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-card__info">
                            <label>Имя</label>
                            <input
                                type="text"
                                name="FirstName"
                                value={clientData.FirstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-card__info">
                            <label>Отчество</label>
                            <input
                                type="text"
                                name="MiddleName"
                                value={clientData.MiddleName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-card__info">
                            <label>Телефон</label>
                            <input
                                type="text"
                                name="Phone"
                                value={clientData.Phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-card__info">
                            <label>Адрес</label>
                            <input
                                type="text"
                                name="Address"
                                value={clientData.Address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="btn-block">
                            <button onClick={() => setIsAdding(!isAdding)}>
                                {isAdding ? 'Отмена' :'Добавить клиента'}
                            </button>
                            <button type="submit">
                                {isEditing ? 'Сохранить изменения' : 'Сохранить'}
                            </button>
                        </div>
                    </form>
                )}
                <table className="table-block">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Фамилия</th>
                            <th>Имя</th>
                            <th>Отчество</th>
                            <th>Телефон</th>
                            <th>Адрес</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {client.length > 0 ? (
                            client.map((client, index) => (
                                <tr key={client.ClientID}>
                                    <td>{client.ClientID}</td>
                                    <td>{client.LastName}</td>
                                    <td>{client.FirstName}</td>
                                    <td>{client.MiddleName}</td>
                                    <td>{client.Phone}</td>
                                    <td>{client.Address}</td>
                                    <td>
                                        <div className="btn-block">
                                            <button onClick={() => handleEdit(client.ClientID)}>Редактировать</button>
                                            <button onClick={() => handleDelete(client.ClientID)}>Удалить</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">Нет данных</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
 
export default Profile;