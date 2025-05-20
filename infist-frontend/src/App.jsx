import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./index.css";

function Welcome() {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => navigate("/guide"), 2000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <img src="/logo.png" alt="Logo" className="w-20 h-20 mb-4" />
            <h1 className="text-xl text-center">欢迎来到 infist 线上面试环节，期待你的加入！</h1>
        </div>
    );
}



function Guide() {
    const navigate = useNavigate();
    const markdown = `
# 面试流程说明

1. 输入你的 GitHub ID 和邮箱以接受挑战
2. 提交你的项目仓库链接和 Vercel 在线体验地址
3. 面试官将审核你的实现并与你联系

祝你好运！
  `;

    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-4">
            <div className="prose mb-6 max-w-2xl">
                <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
            <button
                onClick={() => navigate("/accept")}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                继续
            </button>
        </div>
    );
}



function AcceptChallenge() {
    const [githubId, setGithubId] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:4000/api/accept-challenge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ githubId, email }),
            });
            const data = await res.json();
            if (data.success) {
                alert("挑战已接受，下一步请提交你的作品。");
                navigate("/submit");
            } else {
                alert("提交失败，请稍后重试");
            }
        } catch (error) {
            alert("请求出错，请检查网络");
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto mt-10 space-y-4">
            <input
                className="w-full border p-2 rounded"
                placeholder="GitHub ID"
                value={githubId}
                onChange={(e) => setGithubId(e.target.value)}
                required
            />
            <input
                className="w-full border p-2 rounded"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button className="w-full bg-blue-500 text-white p-2 rounded">接受挑战</button>
        </form>
    );
}



function SubmitChallenge() {
    const [repo, setRepo] = useState("");
    const [vercel, setVercel] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:4000/api/submit-challenge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ githubRepo: repo, vercelUrl: vercel }),
            });
            const data = await res.json();
            if (data.success) {
                alert("提交成功，感谢你的参与！");
            } else {
                alert("提交失败，请稍后重试");
            }
        } catch (error) {
            alert("请求出错，请检查网络");
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto mt-10 space-y-4">
            <input
                className="w-full border p-2 rounded"
                placeholder="GitHub 仓库 URL"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                required
            />
            <input
                className="w-full border p-2 rounded"
                placeholder="Vercel 在线体验地址"
                value={vercel}
                onChange={(e) => setVercel(e.target.value)}
                required
            />
            <button className="w-full bg-green-500 text-white p-2 rounded">提交作品</button>
        </form>
    );
}


export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/accept" element={<AcceptChallenge />} />
                <Route path="/submit" element={<SubmitChallenge />} />
            </Routes>
        </Router>
    );
}
