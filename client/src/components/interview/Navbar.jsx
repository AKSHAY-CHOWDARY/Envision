import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            AI Mock Interview
          </Link>
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800">Home</Link>
            <Link to="/interview" className="text-gray-600 hover:text-gray-800">Start Interview</Link>
            <Link to="/history" className="text-gray-600 hover:text-gray-800">History</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;