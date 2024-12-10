import { ThemeProvider } from "./context/ThemeContext";
import Router from "./router";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
	return (
		<ThemeProvider>
			<ToastContainer />
			<Router />
		</ThemeProvider>
	);
};

export default App;	
