import { ThemeProvider } from "./context/ThemeContext";
import Router from "./router";

const App = () => {
	return (
		<ThemeProvider>
			<Router />
		</ThemeProvider>
	);
};

export default App;
