import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InnerListing from './pages/InnerListing';
import AddListing from './pages/AddListing';
import ListingsPage from './pages/ListingsPage';
import Navigation from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/listing/:id" element={<InnerListing />} />
        <Route path="/new-listing" element={<AddListing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
