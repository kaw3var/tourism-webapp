import React from "react";
import useClients from "./lib/useClients";
import FormInput from "../../share/ui/formInput/FormInput";

const Clients = () => {
  const {
    client,
    clientData,
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
          <FormInput
            label="Фамилия"
            name="LastName"
            value={clientData.LastName}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Имя"
            name="FirstName"
            value={clientData.FirstName}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Отчество"
            name="MiddleName"
            value={clientData.MiddleName}
            onChange={handleChange}
          />
          <FormInput
            label="Телефон"
            name="Phone"
            value={clientData.Phone}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Адрес"
            name="Address"
            value={clientData.Address}
            onChange={handleChange}
            required
          />
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
                    <button onClick={() => openDeleteConfirm(client.ClientID)}>Удалить</button>
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
            <button onClick={closeDeleteConfirm}>Нет</button>
            <button onClick={handleDelete}>Да</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;
