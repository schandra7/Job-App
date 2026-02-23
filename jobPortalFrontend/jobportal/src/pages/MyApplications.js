import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { listMyApplicationsApi, withdrawApi } from "../api/applicationsApi";
import { useAuth } from "../auth/AuthContext";

// Helpers
const badgeForStatus = (s) => {
  if (s === "WITHDRAWN") return "secondary";
  if (s === "APPLIED") return "info";
  return "light";
};

const decisionVariant = (d) => {
  switch (d) {
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "danger";
    case "ON_HOLD":
      return "warning";
    case "PENDING":
    default:
      return "info";
  }
};

const fmt = (ts) =>
  typeof ts === "string" ? ts.split(".")[0]?.replace("T", " ") : ts || "-";

// Unified filter values
// "ALL" | "STATUS:APPLIED" | "STATUS:WITHDRAWN" | "DECISION:PENDING" | ...
const FILTERS = {
  ALL: "ALL",
  STATUS_APPLIED: "STATUS:APPLIED",
  STATUS_WITHDRAWN: "STATUS:WITHDRAWN",
  DECISION_PENDING: "DECISION:PENDING",
  DECISION_APPROVED: "DECISION:APPROVED",
  DECISION_REJECTED: "DECISION:REJECTED",
  DECISION_ON_HOLD: "DECISION:ON_HOLD"
};

export default function MyApplications() {
  const { userId } = useAuth();

  const [apps, setApps] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState(FILTERS.ALL); 

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [actingId, setActingId] = useState(null);

  const applyUnifiedFilter = (list, value) => {
    if (!Array.isArray(list)) {
      setFiltered([]);
      return;
    }
    if (value === FILTERS.ALL) {
      setFiltered(list);
      return;
    }

    if (value.startsWith("STATUS:")) {
      const status = value.split(":")[1]; // APPLIED / WITHDRAWN
      setFiltered(list.filter((a) => a.status === status));
      return;
    }

    if (value.startsWith("DECISION:")) {
      const decision = value.split(":")[1]; // PENDING / APPROVED ...
      setFiltered(list.filter((a) => (a.decision || "PENDING") === decision));
      return;
    }

    // Fallback
    setFiltered(list);
  };

  const load = async () => {
    if (!userId) throw new Error("UserId missing");
    const res = await listMyApplicationsApi(userId);
    const data = Array.isArray(res?.data) ? res.data : [];
    setApps(data);
    applyUnifiedFilter(data, filter);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!userId) throw new Error("UserId missing");
        const res = await listMyApplicationsApi(userId);
        if (mounted) {
          const data = Array.isArray(res?.data) ? res.data : [];
          setApps(data);
          applyUnifiedFilter(data, filter);
        }
      } catch (e) {
        if (mounted) {
          setErr(
            e?.response?.data?.message ||
              e?.response?.data ||
              e?.message ||
              "Failed to load applications"
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    applyUnifiedFilter(apps, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const onWithdraw = async (applicationId) => {
    if (!window.confirm("Withdraw this application?")) return;
    try {
      setErr("");
      setActingId(applicationId);
      await withdrawApi({ applicationId, userId });
      await load();
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          e?.response?.data ||
          e?.message ||
          "Withdraw failed"
      );
    } finally {
      setActingId(null);
    }
  };

  return (
    <Container className="py-4 myapps-container">
      {/* Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">My Applications</h3>

        {/* Single dropdown: Status + Decision */}
        <Form.Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: 260 }}
          size="sm"
          aria-label="Filter by status or manager decision"
          className="btn-oval"
        >
          <option value={FILTERS.ALL}>All</option>
          <optgroup label="Status">
            <option value={FILTERS.STATUS_APPLIED}>Applied</option>
            <option value={FILTERS.STATUS_WITHDRAWN}>Withdrawn</option>
            <option value={FILTERS.DECISION_PENDING}>Pending</option>
            <option value={FILTERS.DECISION_APPROVED}>Approved</option>
            <option value={FILTERS.DECISION_REJECTED}>Rejected</option>
            <option value={FILTERS.DECISION_ON_HOLD}>On Hold</option>
          </optgroup>
        </Form.Select>
      </div>

      {err && <Alert variant="danger">{err}</Alert>}

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="d-grid gap-3">
          {filtered.length === 0 ? (
            <Alert variant="info">No applications found.</Alert>
          ) : (
            filtered.map((a) => {
              const jobTitle = a.job?.title || a.jobTitle || `Job #${a.jobId}`;
              const jobId = a.job?.id || a.jobId;
              const location = a.job?.location || a.location || "N/A";
              const appliedAt = fmt(a.appliedAt);
              const reviewedOrUpdated = fmt(a.reviewedAt || a.updatedAt);
              const decision = a.decision || "PENDING";
              const reviewNote = a.reviewNote;
              const canWithdraw = a.status === "APPLIED";

              return (
                <Card key={a.id} className="shadow-sm">
                  <Card.Body>
                    {/* Header Row */}
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <Card.Title className="mb-1">
                          Application #{a.id}{" "}
                          <Badge
                            bg={badgeForStatus(a.status)}
                            className="ms-2 rounded-pill"
                          >
                            {a.status}
                          </Badge>
                        </Card.Title>

                        <Card.Text className="mb-1">
                          Job: <b>{jobTitle}</b>{" "}
                          {jobId && (
                            <span className="text-muted">(ID: {jobId})</span>
                          )}
                        </Card.Text>

                        <div className="text-muted small">
                          Location: {location}
                        </div>
                      </div>

                      <Badge bg={decisionVariant(decision)} pill>
                        {decision}
                      </Badge>
                    </div>

                    {/* Times */}
                    <Row className="mt-3">
                      <Col sm={6} className="small text-muted">
                        <div>
                          <span className="me-2">Applied:</span>
                          <span className="text-body-secondary">{appliedAt}</span>
                        </div>
                      </Col>
                      <Col sm={6} className="small text-muted">
                        <div className="text-end">
                          <span className="me-2">Reviewed/Updated:</span>
                          <span className="text-body-secondary">
                            {reviewedOrUpdated}
                          </span>
                        </div>
                      </Col>
                    </Row>

                    {/* Manager Note */}
                    <div className="mt-2 small">
                      <span className="text-muted">Manager note: </span>
                      <span title={reviewNote || ""}>
                        {reviewNote || <span className="text-body-secondary">—</span>}
                      </span>
                    </div>

                    {/* Withdraw Action */}
                    {canWithdraw && (
                      <div className="mt-3">
                        <Button
                          variant="outline-danger"
                          onClick={() => onWithdraw(a.id)}
                          disabled={actingId === a.id}
                        >
                          {actingId === a.id ? "..." : "Withdraw"}
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              );
            })
          )}
        </div>
      )}
    </Container>
  );
}