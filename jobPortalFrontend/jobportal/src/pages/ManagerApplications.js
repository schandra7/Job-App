// src/pages/ManagerApplications.js
import React, { useEffect, useMemo, useState } from "react";
import {
  listPendingApi,
  listByDecisionApi,
  approveApi,
  rejectApi,
  holdApi,
  markPendingApi,
} from "../api/managerApplicationsApi";
import { useAuth } from "../auth/AuthContext";

const DECISIONS = ["PENDING", "APPROVED", "REJECTED", "ON_HOLD"];

export default function ManagerApplications() {
  const { role, userId } = useAuth(); 
  const [decision, setDecision] = useState("PENDING");
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");
  const [noteMap, setNoteMap] = useState({});
  const [search, setSearch] = useState("");

  
  const [actingId, setActingId] = useState(null);

  useEffect(() => {
    load();
    //eslint-disable-next-line react-hooks/exhaustive-deps

  }, [decision]);

  async function load() {
    setError("");
    setLoading(true);
    try {
      let res;
      if (decision === "PENDING") {
        res = await listPendingApi();
      } else {
        res = await listByDecisionApi(decision);
      }
      const data = Array.isArray(res?.data) ? res.data : [];
      setApps(data);


      const initMap = {};
      for (const a of data) initMap[a.id] = "";
      setNoteMap(initMap);
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : null) ||
        e?.message ||
        "Failed to load applications";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }


  async function act(actionFn, id) {
    setError("");
    setActingId(id);
    try {
      if (!userId) {
        throw new Error("Missing manager identity. Please re-login as MANAGER.");
      }
      const note = noteMap[id] || "";
      await actionFn(id, note, userId); 
      await load(); 
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : null) ||
        e?.message ||
        "Action failed";
      setError(msg);
    } finally {
      setActingId(null);
    }
  }

  const filtered = useMemo(() => {
    if (!search) return apps;
    const s = search.toLowerCase();
    return apps.filter((a) => {
      const title = a.job?.title?.toLowerCase?.() || a.jobTitle?.toLowerCase?.() || "";
      const username = a.user?.username?.toLowerCase?.() || a.username?.toLowerCase?.() || "";
      return title.includes(s) || username.includes(s);
    });
  }, [apps, search]);

  if (role !== "MANAGER" && role !== "ADMIN") {
    return (
      <div className="container">
        <p>Not authorized.</p>
      </div>
    );
  }

  const fmt = (ts) =>
    typeof ts === "string" ? ts.split(".")[0]?.replace("T", " ") : ts || "-";

  return (
    // src/pages/ManagerApplications.js
// ...imports & component state unchanged...

// inside return(...)
<div className="container" style={{ maxWidth: 1100, padding: "1rem" }}>
  <h2>Manager Applications</h2>

  {/* Decision Filter Tabs */}
  <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
    {DECISIONS.map((d) => (
      <button
        key={d}
        onClick={() => setDecision(d)}
        className={`btn ${decision === d ? "btn-primary" : "btn-outline-primary"}`}
        disabled={loading}
      >
        {d.replace("_", " ")}
      </button>
    ))}
  </div>

  {/* Search */}
  <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
    <input
      type="text"
      placeholder="Search by Job title / username"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="form-control"
      style={{ maxWidth: 360 }}
    />
    <button className="btn btn-secondary" onClick={load} disabled={loading}>
      Refresh
    </button>
  </div>

  {error && <div className="alert alert-danger">{String(error)}</div>}
  {loading && <div>Loading...</div>}

  {!loading && filtered.length === 0 && (
    <div className="alert alert-info">No applications found.</div>
  )}

  {!loading && filtered.length > 0 && (
    <div className="table-responsive">
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Job</th>
            <th>Candidate</th>
            <th>Status</th>
            <th>Decision</th>
            <th>Applied At</th>
            <th>Reviewed At</th>
            <th>Last Saved</th>
            <th>New Comment</th> {/* ✨ added editable input column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a, idx) => {
            const isActing = actingId === a.id;
            return (
              <tr key={a.id}>
                <td>{idx + 1}</td>
                <td>
                  {a.job?.title || a.jobTitle || a.jobId}
                  <div className="text-muted small">{a.job?.location}</div>
                </td>
                <td>{a.user?.username || a.username || a.userId}</td>
                <td>
                  <span className="badge bg-info">{a.status}</span>
                </td>
                <td>
                  <span className="badge bg-secondary">{a.decision}</span>
                </td>
                <td>{fmt(a.appliedAt)}</td>
                <td>{fmt(a.reviewedAt)}</td>

                {/* Read-only: Last saved note from backend */}
                <td style={{ minWidth: 220 }}>
                  <div className="text-truncate" title={a.reviewNote || ""}>
                    {a.reviewNote || <span className="text-muted">-</span>}
                  </div>
                </td>

                {/* ✨ Editable: new comment to send with next action */}
                <td style={{ minWidth: 240 }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type a comment to save"
                    value={noteMap[a.id] || ""}
                    onChange={(e) => setNoteMap((prev) => ({ ...prev, [a.id]: e.target.value }))}
                    disabled={isActing} // only disabled while this row is acting
                  />
                </td>

                <td style={{ minWidth: 280, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => act(approveApi, a.id)}
                    disabled={isActing}
                    title="Approve"
                  >
                    {isActing ? "..." : "Approve"}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => act(rejectApi, a.id)}
                    disabled={isActing}
                    title="Reject"
                  >
                    {isActing ? "..." : "Reject"}
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => act(holdApi, a.id)}
                    disabled={isActing}
                    title="Hold"
                  >
                    {isActing ? "..." : "Hold"}
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => act(markPendingApi, a.id)}
                    disabled={isActing}
                    title="Mark Pending"
                  >
                    {isActing ? "..." : "Pending"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</div>
  );
}