import PendingStatusModal from '../components/PendingStatusModal';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <PendingStatusModal />
    </>
  );
}

export default MyApp;
