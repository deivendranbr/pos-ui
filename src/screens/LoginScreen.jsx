import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input } from "../components/ui";

const API_URL = "http://localhost:3000";

export default function LoginScreen() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      return alert("Username & Password required");
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        return alert(data.message || "Login failed");
      }

      // Save token
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful ✅");

      console.log(data.user.role);
      if(data.user.role === 'admin') {
        navigate('/hotel');
      }
      else {
        navigate("/tables");
      }
    } catch (error) {
      alert("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm p-6 shadow-lg rounded-xl bg-white">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Waiter Login
        </h2>

        <div className="space-y-4">
          <Input
            placeholder="Username"
            className="w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full mt-2" onClick={handleLogin}>
            Captain Login
          </Button>


          <div className="text-center mt-4">
            <Button
              variant="link"
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={() => navigate("/tables")}
            >
              Staff Login
            </Button>
            <br />
            <Button
              variant="link"
              className="text-sm text-purple-500 hover:text-purple-700 mt-2"
              onClick={() => navigate("/super-admin")}
            >
              Super Admin Login
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
