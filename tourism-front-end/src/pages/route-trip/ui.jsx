import React from "react";
import { useRoutes } from './lib';
import { Button } from "../../share";


const RouteTrip = () => {
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
        handleFilePhotoChange,
        handleAddButtonClick,
        handleFileDrop,
        openDeleteConfirm,
        closeDeleteConfirm,
        list,
    } = useRoutes();

    return (  
        <div className="container">
            <h1 className="page__title">Маршруты</h1>
            <div className="add-block">
                <button onClick={handleAddButtonClick}>Добавить маршрут</button>
            </div>
            {(isAdding || showDeleteConfirm) && (
                <div className="overlay" onClick={handleCloseForm}></div>
            )}
            {isAdding && (
                <form className="form-card" onSubmit={handleSubmit}>
                    {list()}
                    <div className="form-card__info">
                        <label>Фотография</label>
                        <div className="form-card__info--img-input" 
                        onDragOver={(e) => e.preventDefault()} 
                        onDrop={handleFileDrop}>
                            <input
                                type="file"
                                name="RouteImgFile"
                                onChange={handleFilePhotoChange}
                                accept=".png,.jpg,.jpeg"
                            />
                            <p>Перетащите файл сюда или нажмите, чтобы выбрать</p>
                            <input
                                type="text"
                                name="RouteImgUrl"
                                value={routeTripData.RouteImgUrl}
                                onChange={handleChange}
                                placeholder="Введите URL картинки"
                            />
                            {(routeTripData.RouteImgFile || routeTripData.RouteImgUrl) && (
                                <div className="form-card__info--img">
                                    <img src={routeTripData.RouteImgFile || routeTripData.RouteImgUrl} alt="Route Preview" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="btn-block">
                        <Button name="Отмена" onClick={handleCloseForm} />
                        <Button name={isEditing ? 'Сохранить изменения' : 'Сохранить'} type="submit"/>
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
                                        <Button name="Редактировать" onClick={() => handleEdit(routeTrip.RouteID)} />
                                        <Button name="Удалить" onClick={() => openDeleteConfirm(routeTrip.RouteID)} />
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="5">Нет данных</td></tr>
                    )}
                </tbody>
            </table>
            {showDeleteConfirm && (
                <div className="delete-confirm">
                    <p>Вы уверены, что хотите удалить маршрут?</p>
                    <div className="btn-block">
                        <Button name="Нет" onClick={closeDeleteConfirm} />
                        <Button name="Да" onClick={handleDelete} />
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default RouteTrip;