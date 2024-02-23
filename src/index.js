import { ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store/store";
import { Provider } from 'react-redux';
const queryClient = new QueryClient();
const lightTheme = createTheme({
  palette: {
    mode: "light",
    // primary: {
    //   main: "rgba(0,0,0,0.4)",
    // },
  },
});
const customToastStyle = {
  top: "20%",
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
<Provider store={store}>
  <QueryClientProvider client={queryClient}>
    {/* <ToastContainer
     style={customToastStyle}
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      limit={2}
      rtl={false}
      toastClassName="!rounded !capitalize !top-[20%] lg:!mx-0 !bg-[#EA3354] !py-0 !text-white"
      pauseOnHover={false}
    /> */}
    <Toaster
      toastOptions={{
        className: "",
        style: {
          border: "1px solid green",
          color: "white",
          fontSize:'15px',
          marginTop:'100px',
          borderRadius:'50px',
          backgroundColor:'rgb(60, 179, 113,.5)',
          
        }, 
      }}
      limit={1} 
    />
    <ThemeProvider theme={lightTheme}>
      <App />
    </ThemeProvider>
  </QueryClientProvider>
</Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
