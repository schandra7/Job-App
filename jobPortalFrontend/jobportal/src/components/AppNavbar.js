import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AppNavbar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar
      expand="lg"
      className="shadow-sm"
      style={{
        background: "rgba(0, 123, 255, 0.85)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Container>
        {/* BRAND */}
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            fontWeight: "700",
            letterSpacing: "0.5px",
            fontSize: "1.4rem",
          }}
        >
          iAspire
        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse>
          {/* LEFT LINKS */}
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              className="px-3"
              style={{ fontWeight: "500" }}
            >
              Jobs
            </Nav.Link>

            {token && role === "EMPLOYEE" && (
              <Nav.Link
                as={Link}
                to="/my-applications"
                className="px-3"
                style={{ fontWeight: "500" }}
              >
                My Applications
              </Nav.Link>
            )}

            {token && role === "ADMIN" && (
              <Nav.Link
                as={Link}
                to="/admin/jobs"
                className="px-3"
                style={{ fontWeight: "500" }}
              >
                Create Job
              </Nav.Link>
            )}

            {token && role === "MANAGER" && (
              <Nav.Link
                as={Link}
                to="/manager/applications"
                className="px-3"
                style={{ fontWeight: "500" }}
              >
                Manage Applications
              </Nav.Link>
            )}
          </Nav>

          {/* RIGHT SIDE AUTH BUTTONS */}
          <Nav className="ms-auto d-flex align-items-center">
            {!token ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="px-3"
                  style={{ fontWeight: "500" }}
                >
                  Login
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/register"
                  className="px-3"
                  style={{ fontWeight: "500" }}
                >
                  Register
                </Nav.Link>
              </>
            ) : (
              <Button
                variant="light"
                className="px-4 py-1 rounded-pill fw-semibold"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}