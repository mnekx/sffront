import { Link } from "react-router-dom";

export function NotFound() {
	return (
		<div className="flex items-center justify-center min-h-screen text-center">
			<div>
				<h1 className="text-4xl font-bold text-gray-800 mb-4">
					404 - Page Not Found
				</h1>
				<p className="text-gray-600">
					Sorry, the page you are looking for does not exist.
				</p>
				<Link to="/" className="text-indigo-500 mt-4 inline-block">
					Go to Dashboard
				</Link>
			</div>
		</div>
	);
}

export default NotFound;
