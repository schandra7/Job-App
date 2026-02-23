import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
  Row,
  Col,
  Form,
  InputGroup,
} from "react-bootstrap";
import { getPublishedJobsApi } from "../api/jobsApi";
import { applyApi } from "../api/applicationsApi";
import { useAuth } from "../auth/AuthContext";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  
  const [titleQuery, setTitleQuery] = useState("");
  const [skillQuery, setSkillQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  
  const [debTitle, setDebTitle] = useState("");
  const [debSkill, setDebSkill] = useState("");
  const [debLocation, setDebLocation] = useState("");

  const { token, role, userId } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const res = await getPublishedJobsApi();
        setJobs(res.data || []);
      } catch {
        setErr("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebTitle(titleQuery.trim());
      setDebSkill(skillQuery.trim());
      setDebLocation(locationQuery.trim());
    }, 250);
    return () => clearTimeout(t);
  }, [titleQuery, skillQuery, locationQuery]);

  const normalizeSkills = (job) => {
    if (!job) return [];
    const s = job.skills;
    if (Array.isArray(s)) return s.map((x) => String(x).toLowerCase().trim()).filter(Boolean);
    if (typeof s === "string")
      return s
        .split(",")
        .map((x) => x.toLowerCase().trim())
        .filter(Boolean);

    if (job.description && typeof job.description === "string") {
      return job.description
        .split(/[,\n/•\-]/)
        .map((x) => x.toLowerCase().trim())
        .filter((x) => x.length > 2);
    }
    return [];
  };

  const filteredJobs = useMemo(() => {
    const title = debTitle.toLowerCase();
    const location = debLocation.toLowerCase();
    const skillTerms = debSkill
      .split(",")
      .map((s) => s.toLowerCase().trim())
      .filter(Boolean);

    return jobs.filter((j) => {
      const matchTitle = !title || j.title?.toLowerCase().includes(title);

      const matchLocation =
        !location || j.location?.toLowerCase().includes(location);

      const jobSkills = normalizeSkills(j);
      const matchSkills =
        skillTerms.length === 0 ||
        skillTerms.some((q) => jobSkills.some((sk) => sk.includes(q)));

      return matchTitle && matchLocation && matchSkills;
    });
  }, [jobs, debTitle, debSkill, debLocation]);

  const onApply = async (jobId) => {
    if (!userId) return alert("UserId missing. Please login again.");
    try {
      await applyApi({ jobId, userId });
      alert("Applied successfully!");
    } catch (e) {
      alert(e.response?.data || "Apply failed");
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Job Listings</h3>
      </div>

      
      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Label>Title</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="e.g., Frontend Developer"
                  value={titleQuery}
                  onChange={(e) => setTitleQuery(e.target.value)}
                />
              </InputGroup>
            </Col>

            <Col md={4}>
              <Form.Label>Skills</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="e.g., React, Node, AWS"
                  value={skillQuery}
                  onChange={(e) => setSkillQuery(e.target.value)}
                />
              </InputGroup>
            </Col>

            <Col md={4}>
              <Form.Label>Location</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="e.g., Bengaluru, Remote"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {err && <Alert variant="danger">{err}</Alert>}

      {loading ? (
        <Spinner />
      ) : filteredJobs.length === 0 ? (
        <Alert variant="info">No jobs match your filters.</Alert>
      ) : (
        <div className="d-grid gap-3">
          {filteredJobs.map((j) => (
            <Card key={j.id} className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                    <Card.Title>{j.title}</Card.Title>
                </div>

                <Card.Text className="mb-2">{j.description}</Card.Text>

                
                {normalizeSkills(j).length > 0 && (
                  <div className="mb-2">
                    {normalizeSkills(j).slice(0, 8).map((s, idx) => (
                      <Badge key={idx} bg="secondary" className="me-1">
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Location: {j.location || "N/A"} · Apply by: {j.applyDeadline || "N/A"}
                  </small>
                  {token && role === "EMPLOYEE" && j.isPublished && (
                    <Button onClick={() => onApply(j.id)}>Apply</Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
