import axios from "axios";
import { useEffect, useState } from "react";

const Profile = () => {
    const [client, setClient] = useState([]);

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
    

    const handleEdit = async (id, newData) => {
        try {
            await axios.put(`http://localhost:8080/api/clients/${id}`, newData);
            fetchClientInfo();
        } catch (error) {
            console.error(`Error updating client with ID ${id}`, error);
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

    return (  
        <div className="container">
            <div className="clients">
                <div className="clients__panel">
                    <button className="clients__btn">Добавить клиента</button>
                </div>
                <table className="clients__table">
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
                                            <button className="clients__btn" onClick={() => handleEdit(client.ClientID)}>Редактировать</button>
                                            <button className="clients__btn" onClick={() => handleDelete(client.ClientID)}>Удалить</button>
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