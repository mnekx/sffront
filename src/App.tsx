import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FoodEntryForm from "./components/FoodEntryForm";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";
import TopBar from "./components/TopBar";
import SideBar from "./components/SideBar";

function App() {
	return (
		<Router>
			<div className="min-h-screen flex bg-gray-100">
				{/* Sidebar Navigation */}
				<SideBar />

				{/* Main Content Area */}
				<div className="flex-1">
					<TopBar />

					<main className="p-4">
						<Routes>
							<Route path="/" element={<Dashboard />} />
							<Route path="/food-entry" element={<FoodEntryForm />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</main>
				</div>
			</div>
		</Router>
	);
}

export default App;
