export function Button({ children, ...props }) {
  return (
    <button
      style={{
        padding: "10px 16px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// export function Card({ children }) {
//   return (
//     <div
//       style={{
//         border: "1px solid #e5e7eb",
//         borderRadius: 8,
//         padding: 16,
//         background: "#fff",
//       }}
//     >
//       {children}
//     </div>
//   );
// }

export function Card({ children, onClick, style, ...rest }) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 16,
        background: "#fff",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        ...(style || {}),
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Input(props) {
  return (
    <input
      style={{
        padding: 8,
        border: "1px solid #d1d5db",
        borderRadius: 4,
        width: "100%",
      }}
      {...props}
    />
  );
}
