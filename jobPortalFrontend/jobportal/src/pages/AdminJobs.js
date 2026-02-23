import { useEffect, useState } from "react";
import { Container, Card, Button, Form, Row, Col, Alert, Badge } from "react-bootstrap";
import { getAdminJobsApi } from "../api/jobsApi";
import { createJobApi, updateJobApi, deleteJobApi, closeJobApi } from "../api/adminJobsApi";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    applyDeadline: "",
    isPublished: true,
  });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const res = await getAdminJobsApi(); // GET /admin/jobs
    setJobs(res.data);
  };

  useEffect(() => {
    load().catch(() => setErr("Failed to load jobs"));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (editingId) {
        await updateJobApi(editingId, form);
      } else {
        await createJobApi(form);
      }
      setForm({ title: "", description: "", location: "", applyDeadline: "", isPublished: true });
      setEditingId(null);
      await load();
    } catch (e2) {
      setErr(e2.response?.data || "Save failed (check ADMIN token)");
    }
  };

  const onEdit = (job) => {
    setEditingId(job.id);
    setForm({
      title: job.title,
      description: job.description,
      location: job.location || "",
      applyDeadline: job.applyDeadline,
      isPublished: job.isPublished,
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await deleteJobApi(id);
      await load();
    } catch (e) {
      setErr(e.response?.data || "Delete failed");
    }
  };

  const onClose = async (id) => {
    if (!window.confirm("Close this job? (marks as closed/unavailable)")) return;
    try {
      await closeJobApi(id);
      await load();
    } catch (e) {
      setErr(e.response?.data || "Close failed");
    }
  };

  return (
    <Container className="py-4">
      <h3 className="mb-3">Admin - Manage Jobs</h3>
      {err && <Alert variant="danger">{err}</Alert>}

      <Card className="shadow-sm mb-3">
        <Card.Body>
          <h5>{editingId ? `Edit Job #${editingId}` : "Create Job"}</h5>
          <Form onSubmit={onSubmit}>
            <Row className="g-2">
              <Col md={4}>
                <Form.Control
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="date"
                  placeholder="Apply Deadline"
                  value={form.applyDeadline}
                  onChange={(e) => setForm({ ...form, applyDeadline: e.target.value })}
                  required
                />
              </Col>
              <Col md={12}>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </Col>
              <Col md={3} className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  label="Published"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                />
              </Col>
              <Col md={3}>
                <Button type="submit" className="w-100">
                  {editingId ? "Update" : "Create"}
                </Button>
              </Col>
              {editingId && (
                <Col md={3}>
                  <Button
                    variant="secondary"
                    className="w-100"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ title: "", description: "", location: "", applyDeadline: "", isPublished: true });
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              )}
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <div className="d-grid gap-3">
        {jobs.map((j) => (
          <Card key={j.id} className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <Card.Title>{j.title}</Card.Title>
                <Badge bg={j.isPublished ? "success" : "secondary"}>
                  {j.isPublished ? "Published" : "Unpublished"}
                </Badge>
              </div>
              <Card.Text>{j.description}</Card.Text>
              <small className="text-muted">
                Location: {j.location || "N/A"} · Apply by: {j.applyDeadline}
              </small>
              <div className="d-flex gap-2 mt-3">
                <Button variant="outline-primary" onClick={() => onEdit(j)}>Edit</Button>
                <Button variant="outline-warning" onClick={() => onClose(j.id)}>Close</Button>
                <Button variant="outline-danger" onClick={() => onDelete(j.id)}>Delete</Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
}