import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { apiClient } from "../lib/api-client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Link, useNavigate } from "react-router-dom";
import { LoadingPage } from "../components/index.js";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slice/AuthSlice";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { HISTORY_ROUTES, LOGOUT_ROUTE } from "../utils/constrants";
import { generateFertilizerReport } from "../utils/pdf-generator";
import {
  LayoutDashboard,
  Home,
  Settings,
  LogOut,
  Sprout,
  Droplets,
  Thermometer,
  Download,
  User,
  Leaf,
  FlaskConical,
  History,
  BarChart3,
  PieChart
} from "lucide-react";
import headerLogo from "../assets/logo-img2.png";
import Logo from "../components/Logo.jsx"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, status } = await apiClient.get(HISTORY_ROUTES);
        if (data && status === 200) {
          setHistoryData(data?.user?.predictionHistory?.reverse() || []);
          setUser({
            fullName: data?.user?.fullName,
            email: data?.user?.email,
            picture: data?.user?.picture,
          });
        }
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Failed to fetch data");
        } else {
          toast.error(error.message || "An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const { data, status } = await apiClient.post(LOGOUT_ROUTE, {});
      if (data && status === 200) {
        toast.success(data.message);
        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Logout failed");
      } else {
        toast.error(error.message || "Logout failed");
      }
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  // Chart Data
  const nutrientChartData = {
    labels: ["Nitrogen (N)", "Phosphorus (P)", "Potassium (K)"],
    datasets: [
      {
        label: "Nutrient Levels",
        data: [
          historyData[0]?.PresentN || 0,
          historyData[0]?.PresentP || 0,
          historyData[0]?.PresentK || 0,
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.7)", // Emerald 500
          "rgba(245, 158, 11, 0.7)", // Amber 500
          "rgba(59, 130, 246, 0.7)", // Blue 500
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(59, 130, 246, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.6,
      },
    ],
  };

  const cropTypeCounts = historyData.reduce((acc, curr) => {
    if (curr.CropType) {
      acc[curr.CropType] = (acc[curr.CropType] || 0) + 1;
    }
    return acc;
  }, {});

  const cropPieData = {
    labels: Object.keys(cropTypeCounts),
    datasets: [
      {
        data: Object.values(cropTypeCounts),
        backgroundColor: [
          "#10B981", "#F59E0B", "#3B82F6", "#EF4444", "#8B5CF6", "#6B7280"
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, family: "'Inter', sans-serif" },
        },
      },
    },
    cutout: '60%',
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-white border-r border-gray-200 fixed h-full z-30 transition-all duration-300 flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2 text-green-700 font-bold text-xl">
            <Logo className={"w-24 h-20"} imgUrl={headerLogo} />
          </Link>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors">
            <Home size={20} />
            <span className="hidden lg:block font-medium">Home</span>
          </Link>
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-xl transition-colors">
            <LayoutDashboard size={20} />
            <span className="hidden lg:block font-medium">Dashboard</span>
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors">
            <Settings size={20} />
            <span className="hidden lg:block font-medium">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="hidden lg:block font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 lg:ml-64 p-6 lg:p-10 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.fullName?.split(' ')[0] || 'Farmer'}! 👋</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-700">{user?.fullName || "User"}</span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 border-2 border-green-200 flex items-center justify-center overflow-hidden">
              {user?.picture ? (
                <img src={user.picture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={24} className="text-green-700" />
              )}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-xl text-green-600">
                <Sprout size={24} />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Latest</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Crop Type</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{historyData[0]?.CropType || "N/A"}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                <Leaf size={24} />
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Soil</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Soil Type</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{historyData[0]?.SoilType || "N/A"}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <FlaskConical size={24} />
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Recommended</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Fertilizer</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1 truncate" title={historyData[0]?.fertilizer_name}>
              {historyData[0]?.fertilizer_name || "N/A"}
            </h3>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart3 size={18} className="text-gray-400" /> Nutrient Analysis
            </h3>
            <div className="h-64">
              <Bar data={nutrientChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <PieChart size={18} className="text-gray-400" /> Crop Distribution
            </h3>
            <div className="h-64 flex justify-center">
              <Doughnut data={cropPieData} options={pieOptions} />
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <History size={20} className="text-gray-400" /> Recent History
            </h3>
          </div>

          <div className="overflow-x-auto">
            {historyData.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Crop</th>
                    <th className="px-6 py-4 font-semibold">Soil</th>
                    <th className="px-6 py-4 font-semibold">Fertilizer</th>
                    <th className="px-6 py-4 font-semibold">Nutrients (N-P-K)</th>
                    <th className="px-6 py-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {historyData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {new Date(item?.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 font-bold">
                        {item?.CropType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item?.SoilType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">{item?.fertilizer_name}</span>
                          <span className="text-xs text-gray-400">{item?.fertilizer_quantity} kg/acre</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex gap-2">
                          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{item?.PresentN}</span>
                          <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-bold">{item?.PresentP}</span>
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{item?.PresentK}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => generateFertilizerReport({
                            soilType: item?.SoilType,
                            cropType: item?.CropType,
                            Temparature: item?.Temparature,
                            Humidity: item?.Humidity,
                            Moisture: item?.Moisture,
                            PresentN: item?.PresentN,
                            PresentP: item?.PresentP,
                            PresentK: item?.PresentK,
                            result: {
                              fertilizer_name: item?.fertilizer_name,
                              fertilizer_quantity: item?.fertilizer_quantity,
                            },
                          })}
                          className="text-gray-400 hover:text-green-600 transition-colors p-2 hover:bg-green-50 rounded-lg"
                          title="Download Report"
                        >
                          <Download size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-10 text-center text-gray-400">
                <Sprout size={48} className="mx-auto mb-3 opacity-20" />
                <p>No history available yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
