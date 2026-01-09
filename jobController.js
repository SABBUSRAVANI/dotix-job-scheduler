
const db = require("../db/mysql");
const axios = require("axios");

exports.createJob = (req, res) => {
  const { taskName, payload, priority } = req.body;
  db.query(
    "INSERT INTO jobs (taskName, payload, priority, status) VALUES (?, ?, ?, 'pending')",
    [taskName, JSON.stringify(payload), priority],
    () => res.json({ message: "Job created" })
  );
};

exports.getJobs = (req, res) => {
  db.query("SELECT * FROM jobs ORDER BY createdAt DESC", (e, r) => res.json(r));
};

exports.getJobById = (req, res) => {
  db.query("SELECT * FROM jobs WHERE id=?", [req.params.id], (e, r) =>
    res.json(r[0])
  );
};

exports.runJob = (req, res) => {
  const id = req.params.id;
  db.query("UPDATE jobs SET status='running' WHERE id=?", [id]);

  setTimeout(() => {
    db.query("UPDATE jobs SET status='completed' WHERE id=?", [id]);
    db.query("SELECT * FROM jobs WHERE id=?", [id], async (e, r) => {
      const job = r[0];
      await axios.post(process.env.WEBHOOK_URL, {
        jobId: job.id,
        taskName: job.taskName,
        priority: job.priority,
        payload: JSON.parse(job.payload),
        completedAt: new Date()
      });
    });
  }, 3000);

  res.json({ message: "Job started" });
};
