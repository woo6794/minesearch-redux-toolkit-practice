import { Provider } from "react-redux";
import MineSearch from "./components/MineSearch";
import { store } from "./store";

function App() {
  return (
    <Provider store={store}>
      <MineSearch />
    </Provider>
  );
}

export default App;
