import api from '../../../share/api/api'
import { useState, useEffect } from 'react';

const useMain = () => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    fetchRouteCosts();
  }, [])

  const fetchRouteCosts = async () => {
    try {
      const response = await api.get('/routes');
      setRoute(response.data);
    } catch(error) {
      console.error('Error fatching route costs', error)
    }
  };

  return {
    route,
  };
};

export default useMain;