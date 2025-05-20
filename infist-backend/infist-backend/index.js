// index.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// 创建数据库连接
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "infinite",
    port: 3306,
});

// 连接数据库
db.connect((err) => {
    if (err) {
        console.error("数据库连接失败:", err);
        return;
    }
    console.log("成功连接数据库");
});

// 接口1：接受挑战，插入 github_id 和 email
app.post("/api/accept-challenge", (req, res) => {
    const { githubId, email } = req.body;
    if (!githubId || !email) {
        return res.json({ success: false, message: "缺少 githubId 或 email" });
    }
    const sql = "INSERT INTO accept_challenge (github_id, email, created_at) VALUES (?, ?, NOW())";
    db.query(sql, [githubId, email], (err, result) => {
        if (err) {
            console.error("插入 accept_challenge 失败:", err);
            return res.status(500).json({ success: false, message: "数据库错误" });
        }
        res.json({ success: true });
    });
});

// 接口2：提交作品，插入 github_repo 和 vercel_url
app.post("/api/submit-challenge", (req, res) => {
    const { githubRepo, vercelUrl } = req.body;
    if (!githubRepo || !vercelUrl) {
        return res.json({ success: false, message: "缺少 githubRepo 或 vercelUrl" });
    }
    const sql = "INSERT INTO submit_challenge (github_repo, vercel_url, created_at) VALUES (?, ?, NOW())";
    db.query(sql, [githubRepo, vercelUrl], (err, result) => {
        if (err) {
            console.error("插入 submit_challenge 失败:", err);
            return res.status(500).json({ success: false, message: "数据库错误" });
        }
        res.json({ success: true });
    });
});

app.listen(port, () => {
    console.log(`服务器启动，监听端口 ${port}`);
});
