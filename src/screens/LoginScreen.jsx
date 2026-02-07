import { useNavigate } from "react-router-dom";
import { Button, Card, Input } from "../components/ui";

export default function LoginScreen() {
  const navigate = useNavigate();

  return (
    <div style={styles.center}>
      <Card>
        <h2>POS Login</h2>
        <Input placeholder="Username" />
        <Input placeholder="Password" type="password" />
        <Button onClick={() => navigate("/tables")}>
          Login
        </Button>
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
