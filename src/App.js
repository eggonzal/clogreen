import { useEffect, useState } from "react";
import "./App.css";
import products from "./db.json";
import Tooltip from '@mui/material/Tooltip';
import { FaExpandAlt } from "react-icons/fa"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import IconButton from '@mui/material/IconButton';
import { useFavorites } from "./FavoritesContext";

function ProductCard({ categoria, descripcion, enlace, notas, imageurl, onViewMore }) {
  const { favorites, toggleFavorite, filterFavorites } = useFavorites();
  const isFavorite = !!favorites.filter(p => p.descripcion === descripcion).length;
  return (
    <div className="ProductCard" hidden={filterFavorites && !isFavorite}>
      <img src={imageurl} alt={descripcion} className={`ProductImage${/__ Clogreen /.test(descripcion) ? ' make-circle' : ''}`} />
      <h2 className="ProductTitle">{descripcion}</h2>
      <p className="ProductDescription">{notas}</p>
      {onViewMore && (
        <Tooltip className="ProductCard__ViewMore__Tooltip"
          title="Ver Más" arrow>
          <IconButton  
            onClick={() => onViewMore({ descripcion, enlace, notas, imageurl, categoria })}
          >
            <FaExpandAlt  className="ProductCard__ViewMore"/>
          </IconButton>
        </Tooltip>
      )}
      <div className="CardToolbar">
        <IconButton onClick={e => toggleFavorite({categoria, descripcion, enlace, notas, imageurl})}>
            {isFavorite ? <AiFillHeart  className="ProductCard__Favorite"/> : <AiOutlineHeart  className="ProductCard__Favorite"/>}
        </IconButton>
        <a href={enlace} target="_blank">
          Ver producto
        </a>
      </div>
    </div>
  );
}

function ProductContainer({ products, categories }) {
  const [expandedProduct, setExpandedProduct] = useState(null);
  const handleProductViewMore = (product) => {
    setExpandedProduct(product);
  };

  const [currentCategory, setCurrentCategory] = useState(categories[0]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".CategorySection");
      let currentCategory = categories[0];
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 135) {
          currentCategory = section.getAttribute("data-categoria");
        }
      });
      setCurrentCategory(currentCategory);
    };
    handleScroll();
    const container = document.querySelector(".ProductContainer");
    container.addEventListener("scroll", handleScroll);
    console.log(categories);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [categories]);

  const handleModalClose = () => {
    setExpandedProduct(null);
  };
  return (
    <div className="ProductContainer">
        {categories.map((categoria, index) => (
          <div
            key={index}
            id={`categoria-${index}`}
            className={`CategorySection ${
              categoria === currentCategory ? "Active" : ""
            }`}
            data-categoria={categoria}
          >
            <h2>{categoria}</h2>
            <div className="ProductList">
              {products.map(
                (product, idx) =>
                  product.categoria === categoria && (
                    <ProductCard
                      key={idx}
                      {...product}
                      onViewMore={handleProductViewMore}
                    />
                  )
              )}
            </div>
          </div>
        ))}

        {console.log(`Producto seleccionado: `, expandedProduct) ||
          (expandedProduct && (
            <div className="Modal" onClick={handleModalClose}>
              <span className="CloseButton" onClick={handleModalClose}>
                &times;
              </span>
              <div
                className="ModalContent"
                onClick={(e) => e.stopPropagation()}
              >
                <ProductCard {...expandedProduct} />
              </div>
            </div>
          ))}
    </div>
  );
}

function ProductToolbar({
  categories,
  selectedCategories,
  onCategoriesChange,
}) {
  const [selectAll, setSelectAll] = useState(false);
  const {categoriesWithFavorites, filterFavorites, setFilterFavorites} = useFavorites()

  const handleCheckboxChange = (category) => {
    if(filterFavorites && !categoriesWithFavorites.includes(category)) return;

    const updatedCategoriesSelected = [...selectedCategories];
    if (updatedCategoriesSelected.includes(category)) {
      updatedCategoriesSelected.splice(updatedCategoriesSelected.indexOf(category), 1);
    } else {
      updatedCategoriesSelected.push(category);
    }
    onCategoriesChange(updatedCategoriesSelected.sort());
    setSelectAll(false);
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      onCategoriesChange(categories.sort());
    } else {
      onCategoriesChange([]);
    }
  };
  const handleFilterFavorites = () => {
    setFilterFavorites(!filterFavorites);
  }

  useEffect(() => {
    // Verificar si todas las categorías están seleccionadas para actualizar selectAll
    if(filterFavorites){
      if (selectedCategories.length === categoriesWithFavorites.length)
        setSelectAll(true);
      else 
        setSelectAll(false);
    }else{
      if (selectedCategories.length === categories.length)
        setSelectAll(true);
      else 
        setSelectAll(false);
    }
  }, [categories, selectedCategories]);

  return (
    <>
      <div className="ProductToolbar">
        <div className="ProductToolbar__All"
          onClick={handleSelectAllChange}
        >
          <input
            type="checkbox"
            id="selectAll"
            checked={selectAll}
            onChange={(e) => {handleSelectAllChange(); e.stopPropagation()}}
          />
          <span htmlFor="selectAll">Ver Todo</span>
        </div>
        <div className="ProductToolbar__FavoritesFilter"
          onClick={e => handleFilterFavorites()}
        >
          <IconButton >
              {filterFavorites ? <AiFillHeart  className="ProductToolbar__FavoritesFilter__Icon"/> : <AiOutlineHeart  className="ProductToolbar__FavoritesFilter__Icon"/>}
          </IconButton>
          <span>Filtrar Favoritos</span>
        </div>
      </div>
      <div className="ProductToolbar">
        {(filterFavorites ? categories.filter(c=>categoriesWithFavorites.includes(c)) : categories).map((category, index) => (
          <div key={index} 
            onClick={(e) => handleCheckboxChange(category)}
            className={`ProductToolbar__option ${
              selectedCategories.includes(category) ? 'active' : ''
            }`}
          >
            <span>{category}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function App() {
  const {favorites, filterFavorites} = useFavorites();
  const sortedProducts = products.sort((a, b) =>
    a.categoria.localeCompare(b.categoria)
  );

  const categories = Array.from(
    new Set(sortedProducts.map((product) => product.categoria))
  );
  const [selectedCategories, setSelectedCategories] = useState([...categories]);
  const [selectedCategoriesBackup, setSelectedCategoriesBackup] = useState(selectedCategories);

  const handleCategoriesChange = (newSelectedCategories) => {
    const categoriesWithFavorites = Array.from(
      new Set(favorites.map((product) => product.categoria))
    );
    if(filterFavorites)
      setSelectedCategories(newSelectedCategories.filter(c => categoriesWithFavorites.includes(c)));
    else
      setSelectedCategories(newSelectedCategories);
  };

  useEffect(()=>{
    const categoriesWithFavorites = Array.from(
      new Set(favorites.map((product) => product.categoria))
    );
    if(filterFavorites){
      setSelectedCategoriesBackup(selectedCategories);
      setSelectedCategories(selectedCategories.filter(c => categoriesWithFavorites.includes(c)));
    } else {
      const disabledCategoriesWithFavorites = categoriesWithFavorites.filter(c => !selectedCategories.includes(c));
      // disable categories from the backup that where disabled during favorites view
      setSelectedCategories(
        Array.from(new Set(selectedCategoriesBackup.concat(selectedCategories)))
        .filter(c => !disabledCategoriesWithFavorites.includes(c))
      );
    }
  }, [filterFavorites]);
  return (
      <div className="App">
        <ProductToolbar
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoriesChange={handleCategoriesChange} />
        <ProductContainer
          products={sortedProducts}
          categories={selectedCategories}/>
      </div>
  );
}

export default App;
