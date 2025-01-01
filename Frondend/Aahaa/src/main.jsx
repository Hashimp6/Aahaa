import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";
import "./index.css"; // Make sure this is correctly imported

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {" "}
      {/* Wrap your App with the Redux Provider */}
      <App />
    </Provider>
    ,
  </React.StrictMode>
);
