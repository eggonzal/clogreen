import './App.css';
import products from './db.json';

function ProductCard({descripcion, enlace, notas, imageurl, categoria}){
  console.log(categoria);
  return (
    <div className='ProductCard'>
      <h2>{descripcion}</h2>
      <img src={imageurl} alt={descripcion} className="ProductImage" />
      <p>{notas}</p>
      <a href={enlace}>Ver producto</a>
    </div>
  );
}

function ProductContainer ({products}){
  return (
    <div className='ProductContainer'>
      {products.map((product, index) => (
        <ProductCard key={index} {...product} />
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
