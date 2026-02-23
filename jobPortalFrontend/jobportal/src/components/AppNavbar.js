import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AppNavbar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">iAspire</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Jobs</Nav.Link>
            {token && role === "EMPLOYEE" && (
              <Nav.Link as={Link} to="/my-applications">My Applications</Nav.Link>
            )}
            {token && role === "ADMIN" && (
              <Nav.Link as={Link} to="/admin/jobs">Create Job</Nav.Link>
            )}
            {token && role=="MANAGER" && (
              <Nav.Link as={Link} to="/manager/applications">Manage applications</Nav.Link>
            )}
          </Nav>
          <Nav className="ms-auto">
            {!token ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            ) : (
              <Button variant="outline-light" onClick={() => { logout(); navigate("/login"); }}>
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}