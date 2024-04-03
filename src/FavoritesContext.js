// FavoritosContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [categoriesWithFavorites, setCategoriesWithFavorites] = useState([])
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Cargar favoritos desde localStorage al cargar la aplicación
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites'));
    const newCategoriesWithFavorites = Array.from(
      new Set(favorites.map((product) => product.categoria))
    );
    console.log(`Loaded Favorites: `, savedFavorites)
    if (savedFavorites) {
      setFavorites(savedFavorites);
      setCategoriesWithFavorites(newCategoriesWithFavorites);
    }
    setLoaded(true);
  }, []);

  // Guardar favoritos en localStorage cada vez que cambien
  useEffect(() => {
    if(loaded){
        console.log(`Saving favorites: \n`, favorites);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        const newCategoriesWithFavorites = Array.from(
          new Set(favorites.map((product) => product.categoria))
        );
        setCategoriesWithFavorites(newCategoriesWithFavorites);
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
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, categoriesWithFavorites, filterFavorites, setFilterFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};