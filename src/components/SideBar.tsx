import { Link, useLocation } from "react-router-dom";

function SideBar() {
	const { pathname } = useLocation();
	const links = [
		{ path: "/", label: "Dashboard" },
		{ path: "/food-entry", label: "Food Entry" },
	];

	return (
		<aside className="w-64 bg-white shadow h-screen sticky top-0 hidden md:block">
			<div className="p-6 font-bold text-xl text-indigo-600">Feeding App</div>
			<nav className="flex flex-col px-4 space-y-2">
				{links.map(({ path, label }) => (
					<Link
						key={path}
						to={path}
						className={`p-2 rounded-xl transition-all font-medium hover:bg-indigo-100 ${
							pathname === path
								? "bg-indigo-200 text-indigo-800"
								: "text-gray-700"
						}`}
					>
						{label}
					</Link>
				))}
			</nav>
		</aside>
	);
}

export default SideBar;
