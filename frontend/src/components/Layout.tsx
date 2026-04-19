import React from 'react';
import { Header } from './Header';

interface Props {
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => (
  <div className="page">
    <Header />
    <main>{children}</main>
    <footer className="foot">
      Your peace of mind is our priority. We are with you every step of the way.
    </footer>
  </div>
);
