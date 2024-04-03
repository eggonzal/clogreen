// FavoritosContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Cargar favoritos desde localStorage al cargar la aplicación
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites'));
    console.log(`Loaded Favorites: `, savedFavorites)
    if (savedFavorites) {
      setFavorites(savedFavorites);
    }
    setLoaded(true);
  }, []);

  // Guardar favoritos en localStorage cada vez que cambien
  useEffect(() => {
    if(loaded){
        console.log(`Saving favorites: \n`, favorites);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [loaded, favorites]);

  const toggleFavorite = (product) => {
    console.log(`Toggle Favorite: `, product);
    if (favorites.find(p => p.descripcion === product.descripcion)) {
      setFavorites(favorites.filter(p => p.descripcion !== product.descripcion));
    } else {
      setFavorites([...favorites, product]);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};