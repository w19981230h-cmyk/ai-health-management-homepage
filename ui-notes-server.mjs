import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { DatabaseSync } from "node:sqlite";

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 8 * 1024 * 1024) reject(new Error("请求内容过大"));
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("JSON格式不正确"));
      }
    });
    req.on("error", reject);
  });
}

function safeCoordinate(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

function safeObject(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (typeof value !== "string" || !value) return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function storedObject(value, maxLength = 100000) {
  const object = safeObject(value);
  return object ? JSON.stringify(object).slice(0, maxLength) : "{}";
}

function noteRecord(row) {
  if (!row) return null;
  return {
    noteId: row.note_id,
    projectId: row.project_id,
    pageId: row.page_id,
    noteNumber: row.note_number,
    title: row.title,
    content: row.content,
    x: row.x,
    y: row.y,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedBy: row.updated_by,
    updatedAt: row.updated_at,
    status: row.status,
    targetKey: row.target_key || "",
    targetSnapshot: safeObject(row.target_snapshot),
    featureInference: safeObject(row.feature_inference),
    generatedRules: safeObject(row.generated_rules),
    ruleGeneratedAt: row.rule_generated_at || ""
  };
}

export function createUiNotesApi(root) {
  const dataDirectory = path.join(root, "data");
  const seedFile = path.join(dataDirectory, "ui-notes-seed.json");
  fs.mkdirSync(dataDirectory, { recursive: true });
  const database = new DatabaseSync(path.join(dataDirectory, "ui-notes.sqlite"));
  database.exec([
    "PRAGMA journal_mode = WAL;",
    "CREATE TABLE IF NOT EXISTS ui_notes (",
    "note_id TEXT PRIMARY KEY,",
    "project_id TEXT NOT NULL,",
    "page_id TEXT NOT NULL,",
    "note_number INTEGER NOT NULL,",
    "title TEXT NOT NULL,",
    "content TEXT NOT NULL DEFAULT '',",
    "x REAL NOT NULL,",
    "y REAL NOT NULL,",
    "created_by TEXT NOT NULL,",
    "created_at TEXT NOT NULL,",
    "updated_by TEXT NOT NULL,",
    "updated_at TEXT NOT NULL,",
    "status TEXT NOT NULL DEFAULT 'active',",
    "UNIQUE(project_id, page_id, note_number)",
    ");",
    "CREATE INDEX IF NOT EXISTS idx_ui_notes_page ON ui_notes(project_id, page_id, status, note_number);"
  ].join(" "));

  const schemaVersion = Number(database.prepare("PRAGMA user_version").get().user_version || 0);
  if (schemaVersion < 2) {
    database.exec([
      "BEGIN;",
      "ALTER TABLE ui_notes RENAME TO ui_notes_v1;",
      "CREATE TABLE ui_notes (",
      "note_id TEXT PRIMARY KEY,",
      "project_id TEXT NOT NULL,",
      "page_id TEXT NOT NULL,",
      "note_number INTEGER NOT NULL,",
      "title TEXT NOT NULL,",
      "content TEXT NOT NULL DEFAULT '',",
      "x REAL NOT NULL,",
      "y REAL NOT NULL,",
      "created_by TEXT NOT NULL,",
      "created_at TEXT NOT NULL,",
      "updated_by TEXT NOT NULL,",
      "updated_at TEXT NOT NULL,",
      "status TEXT NOT NULL DEFAULT 'active'",
      ");",
      "INSERT INTO ui_notes SELECT * FROM ui_notes_v1;",
      "DROP TABLE ui_notes_v1;",
      "CREATE UNIQUE INDEX idx_ui_notes_active_number ON ui_notes(project_id, page_id, note_number) WHERE status = 'active';",
      "CREATE INDEX idx_ui_notes_page ON ui_notes(project_id, page_id, status, note_number);",
      "PRAGMA user_version = 2;",
      "COMMIT;"
    ].join(" "));
  }

  if (schemaVersion < 3) {
    database.exec([
      "BEGIN;",
      "ALTER TABLE ui_notes ADD COLUMN target_key TEXT NOT NULL DEFAULT '';",
      "ALTER TABLE ui_notes ADD COLUMN target_snapshot TEXT NOT NULL DEFAULT '{}';",
      "ALTER TABLE ui_notes ADD COLUMN feature_inference TEXT NOT NULL DEFAULT '{}';",
      "ALTER TABLE ui_notes ADD COLUMN generated_rules TEXT NOT NULL DEFAULT '{}';",
      "ALTER TABLE ui_notes ADD COLUMN rule_generated_at TEXT NOT NULL DEFAULT '';",
      "PRAGMA user_version = 3;",
      "COMMIT;"
    ].join(" "));
  }

  const selectNotes = database.prepare(
    "SELECT * FROM ui_notes WHERE project_id = ? AND page_id = ? AND status = 'active' ORDER BY note_number ASC"
  );
  const selectProjectNotes = database.prepare(
    "SELECT * FROM ui_notes WHERE project_id = ? AND status = 'active' ORDER BY page_id ASC, note_number ASC"
  );
  const selectAllActiveNotes = database.prepare(
    "SELECT * FROM ui_notes WHERE status = 'active' ORDER BY project_id, page_id, note_number ASC"
  );
  const countAllNotes = database.prepare("SELECT COUNT(*) AS count FROM ui_notes");
  const selectNote = database.prepare("SELECT * FROM ui_notes WHERE note_id = ?");
  const selectActiveNumber = database.prepare(
    "SELECT note_id FROM ui_notes WHERE project_id = ? AND page_id = ? AND note_number = ? AND status = 'active'"
  );
  const nextNoteNumber = database.prepare(
    "SELECT COALESCE(MAX(note_number), 0) + 1 AS next_number FROM ui_notes WHERE project_id = ? AND page_id = ?"
  );
  const insertNote = database.prepare(
    "INSERT INTO ui_notes (note_id, project_id, page_id, note_number, title, content, x, y, created_by, created_at, updated_by, updated_at, status, target_key, target_snapshot, feature_inference, generated_rules, rule_generated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, ?)"
  );
  const updateNote = database.prepare(
    "UPDATE ui_notes SET note_number = ?, title = ?, content = ?, x = ?, y = ?, updated_by = ?, updated_at = ?, target_key = ?, target_snapshot = ?, feature_inference = ?, generated_rules = ?, rule_generated_at = ? WHERE note_id = ? AND status = 'active'"
  );
  const deleteNote = database.prepare(
    "UPDATE ui_notes SET status = 'deleted', updated_by = ?, updated_at = ? WHERE note_id = ? AND status = 'active'"
  );

  function importProjectSeed() {
    if (Number(countAllNotes.get().count) > 0 || !fs.existsSync(seedFile)) return;
    let seed;
    try {
      seed = JSON.parse(fs.readFileSync(seedFile, "utf8"));
    } catch {
      return;
    }
    const seedNotes = Array.isArray(seed?.notes) ? seed.notes : [];
    database.exec("BEGIN");
    try {
      seedNotes.forEach((note) => {
        if (!note?.noteId || !note?.projectId || !note?.pageId || !note?.title) return;
        const noteNumber = Number(note.noteNumber);
        if (!Number.isInteger(noteNumber) || noteNumber < 1 || noteNumber > 9999) return;
        const createdAt = String(note.createdAt || new Date().toISOString());
        const updatedAt = String(note.updatedAt || createdAt);
        insertNote.run(
          String(note.noteId),
          String(note.projectId).slice(0, 120),
          String(note.pageId).slice(0, 240),
          noteNumber,
          String(note.title).slice(0, 120),
          String(note.content || "").slice(0, 5000),
          safeCoordinate(note.x),
          safeCoordinate(note.y),
          String(note.createdBy || "项目备注").slice(0, 60),
          createdAt,
          String(note.updatedBy || note.createdBy || "项目备注").slice(0, 60),
          updatedAt,
          String(note.targetKey || "").slice(0, 300),
          storedObject(note.targetSnapshot, 7000000),
          storedObject(note.featureInference, 20000),
          storedObject(note.generatedRules, 120000),
          String(note.ruleGeneratedAt || "").slice(0, 60)
        );
      });
      database.exec("COMMIT");
    } catch {
      database.exec("ROLLBACK");
    }
  }

  function writeProjectSeed() {
    const notes = selectAllActiveNotes.all().map(noteRecord);
    fs.writeFileSync(seedFile, JSON.stringify({
      formatVersion: 2,
      exportedAt: new Date().toISOString(),
      notes
    }, null, 2) + "\n", "utf8");
  }

  importProjectSeed();
  writeProjectSeed();

  return async function handleUiNotesApi(req, res, url) {
    try {
      if (req.method === "GET" && url.pathname === "/api/ui-notes") {
        const projectId = String(url.searchParams.get("projectId") || "").trim();
        const pageId = String(url.searchParams.get("pageId") || "").trim();
        const allPages = url.searchParams.get("scope") === "all";
        if (!projectId) return sendJson(res, 400, { error: "缺少项目ID" });
        if (allPages) return sendJson(res, 200, { notes: selectProjectNotes.all(projectId).map(noteRecord) });
        if (!pageId) return sendJson(res, 400, { error: "缺少页面ID" });
        return sendJson(res, 200, { notes: selectNotes.all(projectId, pageId).map(noteRecord) });
      }

      if (req.method === "POST" && url.pathname === "/api/ui-notes") {
        const body = await readJsonBody(req);
        const projectId = String(body.projectId || "").trim().slice(0, 120);
        const pageId = String(body.pageId || "").trim().slice(0, 240);
        const title = String(body.title || "").trim().slice(0, 120);
        const content = String(body.content || "").trim().slice(0, 5000);
        const targetKey = String(body.targetKey || "").trim().slice(0, 300);
        const actor = String(body.createdBy || "在线访客").trim().slice(0, 60) || "在线访客";
        if (!projectId || !pageId || !title) return sendJson(res, 400, { error: "项目、页面和备注标题不能为空" });
        const noteId = crypto.randomUUID();
        const suggestedNumber = Number(nextNoteNumber.get(projectId, pageId).next_number);
        const noteNumber = body.noteNumber === undefined ? suggestedNumber : Number(body.noteNumber);
        if (!Number.isInteger(noteNumber) || noteNumber < 1 || noteNumber > 9999) {
          return sendJson(res, 400, { error: "备注编号必须是1至9999之间的整数" });
        }
        if (selectActiveNumber.get(projectId, pageId, noteNumber)) {
          return sendJson(res, 409, { error: "当前页面已存在该备注编号" });
        }
        const now = new Date().toISOString();
        insertNote.run(
          noteId, projectId, pageId, noteNumber, title, content,
          safeCoordinate(body.x), safeCoordinate(body.y), actor, now, actor, now,
          targetKey,
          storedObject(body.targetSnapshot, 7000000),
          storedObject(body.featureInference, 20000),
          storedObject(body.generatedRules, 120000),
          String(body.ruleGeneratedAt || "").slice(0, 60)
        );
        writeProjectSeed();
        return sendJson(res, 201, { note: noteRecord(selectNote.get(noteId)) });
      }

      const match = url.pathname.match(/^\/api\/ui-notes\/([0-9a-f-]+)$/i);
      if (!match) return sendJson(res, 404, { error: "备注不存在" });
      const noteId = match[1];
      const existing = selectNote.get(noteId);
      if (!existing || existing.status !== "active") return sendJson(res, 404, { error: "备注不存在" });

      if (req.method === "PUT" || req.method === "PATCH") {
        const body = await readJsonBody(req);
        const actor = String(body.updatedBy || "在线访客").trim().slice(0, 60) || "在线访客";
        const title = body.title === undefined ? existing.title : String(body.title || "").trim().slice(0, 120);
        const noteNumber = body.noteNumber === undefined ? existing.note_number : Number(body.noteNumber);
        if (!title) return sendJson(res, 400, { error: "备注标题不能为空" });
        if (!Number.isInteger(noteNumber) || noteNumber < 1 || noteNumber > 9999) {
          return sendJson(res, 400, { error: "备注编号必须是1至9999之间的整数" });
        }
        const numberOwner = selectActiveNumber.get(existing.project_id, existing.page_id, noteNumber);
        if (numberOwner && numberOwner.note_id !== noteId) {
          return sendJson(res, 409, { error: "当前页面已存在该备注编号" });
        }
        updateNote.run(
          noteNumber,
          title,
          body.content === undefined ? existing.content : String(body.content || "").trim().slice(0, 5000),
          body.x === undefined ? existing.x : safeCoordinate(body.x),
          body.y === undefined ? existing.y : safeCoordinate(body.y),
          actor,
          new Date().toISOString(),
          body.targetKey === undefined ? existing.target_key : String(body.targetKey || "").trim().slice(0, 300),
          body.targetSnapshot === undefined ? existing.target_snapshot : storedObject(body.targetSnapshot, 7000000),
          body.featureInference === undefined ? existing.feature_inference : storedObject(body.featureInference, 20000),
          body.generatedRules === undefined ? existing.generated_rules : storedObject(body.generatedRules, 120000),
          body.ruleGeneratedAt === undefined ? existing.rule_generated_at : String(body.ruleGeneratedAt || "").slice(0, 60),
          noteId
        );
        writeProjectSeed();
        return sendJson(res, 200, { note: noteRecord(selectNote.get(noteId)) });
      }

      if (req.method === "DELETE") {
        const encodedActor = String(req.headers["x-ui-note-user"] || "").slice(0, 180);
        let actor = "在线访客";
        if (encodedActor) {
          try {
            actor = decodeURIComponent(encodedActor).slice(0, 60) || actor;
          } catch {
            actor = encodedActor.slice(0, 60);
          }
        }
        deleteNote.run(actor, new Date().toISOString(), noteId);
        writeProjectSeed();
        return sendJson(res, 200, { deleted: true, noteId });
      }

      return sendJson(res, 405, { error: "不支持该请求方式" });
    } catch (error) {
      return sendJson(res, 500, { error: error.message || "服务器处理失败" });
    }
  };
}
