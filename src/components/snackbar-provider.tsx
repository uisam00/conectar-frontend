import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SnackbarProvider() {
  return (
    <ToastContainer
      position="bottom-left"
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}
