import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import CardList from './components/CardList';
import SingleView from './components/SingleView';
import { CartProvider } from './state/CartProvider';
import Cart from './components/Cart'; // Un-commented the Cart component
import Orders from './components/Orders';

function App() {
  return (
    <div className="App">
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<CardList />} />
          <Route path="/product/:id" element={<SingleView />} />
          <Route path="/cart" element={<Cart />} /> {/* Ensure Cart component is rendered */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </CartProvider>
    </div>
  );
}

export default App;
