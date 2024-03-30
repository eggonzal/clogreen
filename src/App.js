import { useEffect, useState } from "react";
import "./App.css";
import products from "./db.json";

function ProductCard({
  descripcion,
  enlace,
  notas,
  imageurl,
  onViewMore,
}) {
  return (
    <div className="ProductCard">
      <img src={imageurl} alt={descripcion} className="ProductImage" />
      <h2 className="ProductTitle">{descripcion}</h2>
      <p className="ProductDescription">{notas}</p>
      {onViewMore && (
        <button
          onClick={() => onViewMore({ descripcion, enlace, notas, imageurl })}
        >
          Ver Más
        </button>
      )}
      <div className="CardToolbar">
        <a href={enlace}>Ver producto</a>
      </div>
    </div>
  );
}

function ProductContainer({ products }) {
  const [productExpanded, setProductSelected] = useState(null);
  const handleProductViewMore = (product) => {
    setProductSelected(product);
  };

  // Ordenar productos por categoría
  const sortedProducts = products.sort((a, b) =>
    a.categoria.localeCompare(b.categoria)
  );

  // Agrupar productos por categoría
  const categories = Array.from(
    new Set(sortedProducts.map((product) => product.categoria))
  );

  // Estado para la categoría actualmente visible
  const [currentCategory, setCurrentCategory] = useState(categories[0]);

  // Función para manejar el cambio de categoría al hacer clic en el encabezado
  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
  };

  // Efecto para actualizar la categoría actual cuando se desplaza
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".CategorySection");
      let currentCategory = categories[0];
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 0) {
          currentCategory = section.getAttribute("data-categoria");
        }
      });
      setCurrentCategory(currentCategory);
    };

    const container = document.querySelector('.ProductContainer');
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [categories]);

  const handleModalClose = () => {
    setProductSelected(null);
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
          <h2 onClick={() => handleCategoryClick(categoria)}>{categoria}</h2>
          <div className="ProductList">
            {sortedProducts.map(
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

      {console.log(`Producto seleccionado: `, productExpanded) ||
        (productExpanded && (
          <div className="Modal" onClick={handleModalClose}>
            <span className="CloseButton" onClick={handleModalClose}>
              &times;
            </span>
            <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
              <ProductCard {...productExpanded} />
            </div>
          </div>
        ))}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <h1>Productos</h1>
      <ProductContainer products={products} />
    </div>
  );
}

export default App;
