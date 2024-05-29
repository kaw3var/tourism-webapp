import axios from "axios";
import { useEffect, useState } from "react";

const Routes = () => {
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

    useEffect(() => {
        fetchRouteInfo();
    }, [])

    const fetchRouteInfo = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/routes');
            if (response.status === 204) {
                setRouteTrip([]);
            } else {
                setRouteTrip(response.data);
            }
        } catch(error) {
            console.error('Error fetching routes info', error);
        }
    };

    const handleEdit = async (id) => {
        const routeTripToEdit = routeTrip.find(routeTrip => routeTrip.RouteID === id);
        if (routeTripToEdit) {
            setRouteTripData({
                RouteName: routeTripToEdit.RouteName,
                RouteDescription: routeTripToEdit.RouteDescription,
                RoutePrice: routeTripToEdit.RoutePrice
            });
            setIsEditing(true);
            setEditTripId(id);
            setIsAdding(true);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить данный маршрут?')) {
            try {
                await axios.delete(`http://localhost:8080/api/routes/${id}`);
                fetchRouteInfo();
                console.log('RouteTrip deleted successful')
            } catch (error) {
                console.error(`Error deleting RouteTrip with ID ${id}`, error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRouteTripData({ ...routeTripData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const routeTripPayload = {
            RouteName: routeTripData.RouteName,
            RouteDescription: routeTripData.RouteDescription,
            RoutePrice: parseInt(routeTripData.RoutePrice),
            RouteImg: routeTripData.RouteImg
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
        setRouteTripData({
            RouteName: '',
            RouteDescription: '',
            RoutePrice: '',
            RouteImg: ''
        });
        setIsAdding(false);
        fetchRouteInfo();
    };

    return (  
        <div className="container">
            <h1 className="page__title">Маршруты</h1>
            <div className="add-block">
                {!isAdding && (
                    <button onClick={() => setIsAdding(true)}>
                        Добавить маршрут
                    </button>
                )}
            </div>
            {isAdding && (
                <form className="form-card" onSubmit={handleSubmit}>
                    <div className="form-card__info">
                        <label>Название</label>
                        <input
                            type="text"
                            name="RouteName"
                            value={routeTripData.RouteName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-card__info">
                        <label>Описание</label>
                        <input
                            type="text"
                            name="RouteDescription"
                            value={routeTripData.RouteDescription}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-card__info">
                        <label>Цена</label>
                        <input
                            type="text"
                            name="RoutePrice"
                            value={routeTripData.RoutePrice}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="btn-block">
                        <button onClick={() => setIsAdding(!isAdding)}>
                            {isAdding ? 'Отмена' :'Добавить маршрут'}
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
                        <th>Название</th>
                        <th>Описание</th>
                        <th>Цена</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {routeTrip.length > 0 ? (
                        routeTrip.map((routeTrip, index) => (
                            <tr key={routeTrip.RouteID}>
                                <td>{routeTrip.RouteID}</td>
                                <td>{routeTrip.RouteName}</td>
                                <td>{routeTrip.RouteDescription}</td>
                                <td>{routeTrip.RoutePrice}</td>
                                <td>
                                    <div className="btn-block">
                                        <button onClick={() => handleEdit(routeTrip.RouteID)}>Редактировать</button>
                                        <button onClick={() => handleDelete(routeTrip.RouteID)}>Удалить</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">Нет данных</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
 
export default Routes;
