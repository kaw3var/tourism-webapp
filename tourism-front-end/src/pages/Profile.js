import axios from "axios";
import { useEffect, useState } from "react";

const Profile = () => {
    const [client, setClient] = useState([]);

    useEffect(() => {
        fetchClientInfo();
    }, [])

    const fetchClientInfo = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/clients/1');
            setClient(response.data);
        } catch(error) {
            console.error('Error fatching client info', error);
        }
    };

    return (  
        <div className="container">
            <div className="profile">
                <div className="profile__title">
                    <p className="profile__item">Имя</p>
                    <p className="profile__item">Фамилия</p>
                    <p className="profile__item">Отчество (при наличии)</p>
                    <p className="profile__item">Телефон</p>
                    <p className="profile__item">Адрес</p>
                </div>
                {client && (
                    <div className="profile__info">
                        <p className="profile__item">{client.FirstName}</p>
                        <p className="profile__item">{client.LastName}</p>
                        <p className="profile__item">{client.MiddleName || 'Не указано'}</p>
                        <p className="profile__item">{client.Phone}</p>
                        <p className="profile__item">{client.Address}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default Profile;