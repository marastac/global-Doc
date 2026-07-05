import React, { useEffect } from 'react';
import ReactPixel from 'react-facebook-pixel';
import { Header } from './Header';

interface Props {
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  useEffect(() => {
    // Inicialización del Pixel de Meta
    const PIXEL_ID = '1282637307096201';
    ReactPixel.init(PIXEL_ID);
    
    // Rastrea la página cuando se carga el layout
    ReactPixel.pageView();
  }, []);

  return (
    <div className="page">
      <Header />
      <main>{children}</main>
      <footer className="foot">
        Your peace of mind is our priority. We are with you every step of the way.
      </footer>
    </div>
  );
};