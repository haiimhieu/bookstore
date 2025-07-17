import HomePage from "./views/HomePage";
import GenrePage from "./views/GenrePage";
import Navbar from "./components/Navbar";
import SearchPage from "./views/SearchPage";
import LoginPage from "./views/LoginPage";
import SignUpPage from "./views/SignupPage";
import OrderPage from "./views/OrderPage";
import UserOrderPage from "./views/UserOrderPage";
import AdminOrderPage from "./views/AdminOrderPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BasketProvider } from "./context/BasketContext";
import BookDetailPage from "./views/BookDetailPage";

function App() {
  return (
    <AuthProvider>
      <BasketProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/genre/:genreId" element={<GenrePage />} />
            <Route path="/search/:query" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/book/:bookId" element={<BookDetailPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/myorders" element={<UserOrderPage />} />
            <Route path="/allorders" element={<AdminOrderPage />} />
          </Routes>
        </Router>
      </BasketProvider>
    </AuthProvider>
  );
}

export default App;
