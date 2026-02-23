import { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { registerApi } from "../api/authApi";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await registerApi({ username, password });
      login({ token: res.data.token, role: res.data.role, userId: res.data.userId });
      navigate("/", { replace: true });
    } catch (error) {
      setErr(error.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="py-5" style={{ maxWidth: 520 }}>
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-3">Register (Employee)</h3>
          {err && <Alert variant="danger">{err}</Alert>}
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button type="submit" className="w-100" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}