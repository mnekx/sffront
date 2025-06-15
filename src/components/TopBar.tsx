export function TopBar() {
	return (
		<header className="bg-white shadow px-4 py-3 flex justify-between items-center sticky top-0 z-10">
			<h1 className="text-lg font-semibold text-gray-800">
				School Feeding System
			</h1>
			<div className="flex items-center space-x-4">
				<span className="text-sm text-gray-500">John Doe</span>
				<img
					src="https://i.pravatar.cc/40"
					alt="User avatar"
					className="w-8 h-8 rounded-full"
				/>
			</div>
		</header>
	);
}

export default TopBar;
