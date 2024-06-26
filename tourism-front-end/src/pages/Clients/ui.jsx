import React from "react";
import { useClients } from "./lib";
import { Button } from "../../share";


const Clients = () => {
  const {
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
  } = useClients();

  return (  
    <div className="container">
      <h1 className="page__title">Клиенты</h1>
      <div className="add-block">
        <button onClick={handleAddButtonClick}>
          Добавить клиента
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
            <Button name={isEditing ? 'Сохранить изменения' : 'Сохранить'} type="submit"/>
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
                    <Button name="Редактировать" onClick={() => handleEdit(client.ClientID)} />
                    <Button name="Удалить" onClick={() => openDeleteConfirm(client.ClientID)} />
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
      {showDeleteConfirm && (
        <div className="delete-confirm">
          <p>Вы уверены, что хотите удалить клиента?</p>
          <div className="btn-block">
              <Button name="Нет" onClick={closeDeleteConfirm} />
              <Button name="Да" onClick={handleDelete} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;
