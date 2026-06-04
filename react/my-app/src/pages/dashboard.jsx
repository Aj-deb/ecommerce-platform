import Navbar from "../components/Navbar";
import Products from "./Products";

const categories = ["All", "Electronics", "Fashion", "Home", "Deals"];

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="px-4 py-6 max-w-7xl mx-auto">
        <Products />
      </div>
    </>
  );
};

export default Dashboard;