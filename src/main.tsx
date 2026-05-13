import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import {
  listenForMessages,
} from "@/lib/firebase";

/*
START FIREBASE LISTENER
*/

listenForMessages();

ReactDOM.createRoot(
  document.getElementById("root")!
).render(

  <React.StrictMode>

    <App />

  </React.StrictMode>
);