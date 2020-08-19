import React, { useState, useEffect } from "react";

import "./styles.css";
import api from "./services/api";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {

    api.get('repositories')
      .then(res => {
        setRepositories(res.data);
      })
      .catch(err => {
        console.log(err);
      });

  }, []);

  async function handleAddRepository() {
    const repository = {
      title: `Repositório ${Date.now()}`,
      url: 'http://...',
      techs: ['React']
    }

    const response = await api.post('repositories', repository);

    setRepositories([...repositories, response.data]);
  }

  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);

    let newRepositories = repositories;

    newRepositories.splice(newRepositories.findIndex(repository => repository.id === id), 1);

    setRepositories([...newRepositories]);
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {
          repositories.map(repository => (
            <li key={repository.id}>
              {repository.title}

              <button onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </li>
          ))
        }
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
