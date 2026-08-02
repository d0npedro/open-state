let meta = #{
    name: "autonomous-develop",
    description: "One autonomous multi-domain delivery iteration (queue-driven, no push)",
    when_to_use: "Continue Open State demo/docs across AV, UG, Kita, cross via NEXT_STEPS_QUEUE",
    phases: [
        #{ title: "Develop", detail: "Single AGENTS.md iteration from queue or catalog" },
    ],
};

phase("Develop");

let prompt = "";
prompt += "You work in the open-state git repo (root has AGENTS.md, docs/, demo/). Isolated fire — no chat context.\n\n";
prompt += "## Mission\n";
prompt += "Run exactly ONE autonomous multi-domain delivery iteration per:\n";
prompt += "- AGENTS.md (commit, no push)\n";
prompt += "- docs/delivery/AUTONOMOUS_LOOP.md (rotation, refill catalog, forbidden micro-polish)\n";
prompt += "- docs/delivery/loop-state.md (read/write next_domain, counters)\n";
prompt += "- docs/NEXT_STEPS_QUEUE.md, docs/BUILD_STATE.md, docs/DECISION_LOG.md (DEC-012, DEC-013)\n\n";
prompt += "Steps: git log/status → pick top OFFEN (or add max 3 catalog items if empty) → implement one step → ";
prompt += "if code: cd demo && npm run lint && npm run build; domain E2E if UI touched → ";
prompt += "update queue DONE, BUILD_STATE delta only, loop-state → conventional commit. NEVER git push. ";
prompt += "NEVER page.goto after session interaction in same domain (DEC-012). No micro CTA parity (DEC-013).\n\n";
prompt += "## Bail\n";
prompt += "- Dirty unrelated worktree → report blocked and stop\n";
prompt += "- Lint/build red after fix attempt → report fail and stop\n";
prompt += "- No sensible catalog work → idle-no-work, bump consecutive_idle in loop-state\n\n";
prompt += "## Status (required one line)\n";
prompt += "Q-ID | domain=av|ug|kita|cross | commit=hash|no | build=ok|n/a|fail | e2e=ok|n/a|fail | next=Q-…|none | next_domain=…\n";

let result_schema = #{
    "type": "object",
    "required": ["status_line", "queue_id", "commit", "build", "domain"],
    "properties": #{
        "status_line": #{ "type": "string" },
        "queue_id": #{ "type": "string" },
        "commit": #{ "type": "string" },
        "build": #{ "type": "string" },
        "domain": #{ "type": "string" },
        "notes": #{ "type": "string" },
    },
};

let r = agent(prompt, #{
    label: "autonomous-develop-fire",
    capability_mode: "all",
    output_schema: result_schema,
});

if r == () || !r.success {
    complete(#{
        summary: "Agent fire failed or cancelled",
        ok: false,
    });
}

complete(#{
    summary: r.output.status_line,
    ok: true,
    queue_id: r.output.queue_id,
    commit: r.output.commit,
    build: r.output.build,
    domain: r.output.domain,
    notes: r.output.notes,
});
