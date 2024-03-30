import { useState } from 'react';
import './App.css';
import products from './db.json';

function ProductCard({ descripcion, enlace, notas, imageurl, onProductSelected}) {
  return (
    <div className='ProductCard'>
      <img src={imageurl} alt={descripcion} className="ProductImage" />
      <h2 className='ProductTitle'>{descripcion}</h2>
      <p className='ProductDescription'>{notas}</p>
      { onProductSelected && <button onClick={() => onProductSelected({ descripcion, enlace, notas, imageurl })}>Ver Más</button>}
      <div className='CardToolbar'>
        <a href={enlace}>Ver producto</a>
      </div>
    </div>
  );
}


function ProductContainer ({products}){
  const [productSelected, setProductSelected] = useState(null)
  const handleProductSelected = (product) => {
    setProductSelected(product);
  };

  const handleModalClose = () => {
    setProductSelected(null);
  };
  return (
    <div className='ProductContainer'>
      {
        products.map((product, index) => (
          <ProductCard
            key={index}
            {...product}
            onProductSelected={handleProductSelected}
            />
        ))
      }

      {console.log(`Producto seleccionado: `, productSelected) || productSelected && (
        <div className="Modal" onClick={handleModalClose}>
          <span className="CloseButton" onClick={handleModalClose}>&times;</span>
          <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
            <ProductCard {...productSelected} />
          </div>
        </div>
      )}
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
