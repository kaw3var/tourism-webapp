import React from "react";
import useTrips from "./lib/useBookTrip";
import { Button } from "../../share";

const BookTrip = () => {
  const {
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
  } = useTrips();

  return (  
    <div className="container">
      <h1 className="page__title">Запись на туры</h1>
      <div className="add-block">
        <button onClick={handleAddButtonClick}>
          Добавить бронь
        </button>
      </div>
      {(isAdding || showDeleteConfirm) && 
        <div className="overlay" onClick={handleCloseForm}></div>
      }
      {isAdding && (
        <form className="form-card" onSubmit={handleSubmit}>
          {list()}
          <div className="btn-block">
            <Button name="Отмена" onClick={handleCloseForm} />  
            <Button name={isEditing ? 'Сохранить изменения' : 'Сохранить'} type="submit" />
          </div>
        </form>
      )}
      <table className="table-block">
        <thead>
          <tr>
            <th>№</th>
            <th>Номер клиента</th>
            <th>Номер маршрута</th>
            <th>Скидка</th>
            <th>Дата</th>
            <th>Длительность поездки</th>
            <th>Количество билетов</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {trip.length > 0 ? (
            trip.map((trip, index) => (
              <tr key={trip.TripID}>
                <td>{trip.TripID}</td>
                <td>{trip.ClientID}</td>
                <td>{trip.RouteId}</td>
                <td>{trip.DiscountID}</td>
                <td>{trip.TripDate}</td>
                <td>{trip.TripDuration}</td>
                <td>{trip.NumberOfTickets}</td>
                <td>
                  <div className="btn-block">
                    <Button name="Редактировать" onClick={() => handleEdit(trip.TripID)} />
                    <Button name="Удалить" onClick={() => openDeleteConfirm(trip.TripID)} />
                    <button onClick={() => handleEdit(trip.TripID)}>Редактировать</button>
                    <button onClick={() => openDeleteConfirm(trip.TripID)}>Удалить</button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Нет данных</td>
            </tr>
          )}
        </tbody>
      </table>
      {showDeleteConfirm && (
        <div className="delete-confirm">
          <p>Вы уверены, что хотите удалить бронь?</p>
          <div className="btn-block">
            <Button name="Нет" onClick={closeDeleteConfirm} />
            <Button name="Да" onClick={handleDelete} />
          </div>
        </div>
      )}
    </div>
  );
}

export default BookTrip;
