import '@/styles/globals.css';
import Modal from 'react-modal';
import UserContextProvider from './context/userContext';

Modal.setAppElement('#__next');

export default function App({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <Component {...pageProps} />
    </UserContextProvider>
  );
}

