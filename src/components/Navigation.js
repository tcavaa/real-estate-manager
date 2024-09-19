import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/new-listing">Add New Listing</Link>
    </nav>
  );
}

export default Navigation;