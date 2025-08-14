import { Toaster } from 'react-hot-toast';
import PendingStatusModal from '../components/PendingStatusModal';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <PendingStatusModal />
      <Toaster />
    </>
  );
}

export default MyApp;
