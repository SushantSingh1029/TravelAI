import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    try {
      const res = await api.get('/api/favorites');
      setFavorites(res.data.map(place => place.id));
    } catch (err) {
      console.error('Failed to fetch favorites', err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (placeId) => {
    const isFav = favorites.includes(placeId);
    try {
      if (isFav) {
        await api.delete(`/api/favorites/${placeId}`);
        setFavorites(favorites.filter(id => id !== placeId));
      } else {
        await api.post('/api/favorites', { place_id: placeId });
        setFavorites([...favorites, placeId]);
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
