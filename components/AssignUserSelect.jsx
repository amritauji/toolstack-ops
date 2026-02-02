"use client";

import { useState } from "react";
import { assignTaskAction } from "@/app/(app)/dashboard/actions";

export default function AssignUserSelect({ taskId, users }) {
  const [query, setQuery] = useState("");

  const filtered =
    users.length > 7
      ? users.filter(u =>
          u.full_name.toLowerCase().includes(query.toLowerCase())
        )
      : users;

  return (
    <form action={assignTaskAction}>
      <input type="hidden" name="taskId" value={taskId} />

      {users.length > 7 && (
        <input
          placeholder="Search user…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: 6,
            fontSize: 12,
            marginBottom: 6,
            border: "1px solid #e5e7eb",
            borderRadius: 6,
          }}
        />
      )}

      <select
        name="userId"
        required
        style={{
          width: "100%",
          padding: 6,
          fontSize: 12,
          borderRadius: 6,
          border: "1px solid #e5e7eb",
        }}
      >
        <option value="">Assign to…</option>

        {filtered.map(user => (
          <option key={user.id} value={user.id}>
            {user.full_name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        style={{
          marginTop: 6,
          width: "100%",
          fontSize: 12,
          background: "#2563EB",
          color: "white",
          borderRadius: 6,
          padding: 6,
          border: "none",
          cursor: "pointer",
        }}
      >
        Assign
      </button>
    </form>
  );
}