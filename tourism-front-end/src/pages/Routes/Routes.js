import React from "react";
import useRoutes from './lib/useRoutes';

const Routes = () => {
    const {
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
    } = useRoutes();

    return (  
        <div className="container">
            <h1 className="page__title">Маршруты</h1>
            <div className="add-block">
                <button onClick={handleAddButtonClick}>
                    Добавить маршрут
                </button>
            </div>
            {(isAdding || showDeleteConfirm) && (
                <div className="overlay" onClick={handleCloseForm}></div>
            )}
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
                            required
                        />
                    </div>
                    <div className="form-card__info">
                        <label>Фотография</label>
                        <input
                            type="text"
                            name="RouteImg"
                            value={routeTripData.RouteImg}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="btn-block">
                        <button type="button" onClick={handleCloseForm}>
                            Отмена
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
                                        <button onClick={() => handleEdit(routeTrip.RouteID)}>
                                            Редактировать
                                        </button>
                                        <button onClick={() => openDeleteConfirm(routeTrip.RouteID)}>
                                            Удалить
                                        </button>
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
            {showDeleteConfirm && (
                <div className="delete-confirm">
                    <p>Вы уверены, что хотите удалить маршрут?</p>
                    <div className="btn-block">
                        <button onClick={closeDeleteConfirm}>Нет</button>
                        <button onClick={handleDelete}>Да</button>
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default Routes;
