import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui";
import { useOrders } from "../context/OrderContext";

const tables = Array.from({ length: 12 }, (_, i) => i + 1);

export default function TableScreen() {
  const navigate = useNavigate();
  const { orders } = useOrders();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200
        flex items-center px-5 sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-slate-900">
          Select Table
        </h2>
      </header>

      {/* Content */}
      <main className="flex-1 flex justify-center p-4">
        <div className="w-full max-w-6xl flex flex-wrap gap-4 content-start">
          {tables.map((t) => {
            const occupied = orders[t]?.length > 0;

            return (
              <Card
                key={t}
                onClick={() => navigate(`/billing?table=${t}`)}
                className={`
                  h-36
                  w-[160px]
                  flex flex-col justify-center items-center
                  rounded-2xl border
                  cursor-pointer
                  transition
                  shadow-sm hover:shadow-md
                  ${
                    occupied
                      ? "bg-red-100 border-red-300 hover:bg-red-200"
                      : "bg-green-100 border-green-300 hover:bg-green-200"
                  }
                `}
              >
                <strong className="text-lg text-slate-900 mb-1">
                  Table {t}
                </strong>

                <span
                  className={`text-sm font-medium
                    ${occupied ? "text-red-700" : "text-green-700"}
                  `}
                >
                  {occupied ? "Occupied" : "Free"}
                </span>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="h-14 bg-white border-t border-gray-200
        flex items-center justify-center">
        <span className="text-sm text-slate-500">
          Tap a table to start order
        </span>
      </footer>

    </div>
  );
}
