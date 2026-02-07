import { useNavigate } from "react-router-dom";
import { Button, Card, Input } from "../components/ui";

export default function LoginScreen() {
  const navigate = useNavigate();

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
          />

          <Input
            placeholder="Password"
            type="password"
            className="w-full"
          />

          <Button
            className="w-full mt-2"
            onClick={() => navigate("/tables")}
          >
            Login
          </Button>
        </div>
      </Card>
    </div>
  );
}

const styles = {
  center: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
  },
};
