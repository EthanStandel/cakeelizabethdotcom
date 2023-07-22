export const ContactEmail = ({
  fullName,
  email,
  phoneNumber,
  subject,
  message,
}: {
  fullName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
}) => (
  <div style={{ fontFamily: "Helvetica", width: "100%" }}>
    <div style={{ background: "#65ffce", padding: "1rem" }}>
      <img src="https://cakeelizabeth.com/resources/other/logo.png" />
      <h2
        style={{
          textTransform: "uppercase",
          fontWeight: "lighter",
          letterSpacing: ".15em",
          maxWidth: "calc(100% - 2rem)",
        }}
      >
        A new contact is trying to reach out!
      </h2>
    </div>
    <div style={{ maxWidth: "calc(100% - 2rem)", padding: "1rem" }}>
      <p>
        Name: <span style={{ fontWeight: "bold" }}>{fullName}</span>
      </p>
      <p>
        Email: <span style={{ fontWeight: "bold" }}>{email}</span>
      </p>
      {!!phoneNumber && (
        <p>
          Phone number:{" "}
          <a
            href={`tel:${phoneNumber
              .split("")
              .filter((char) => /\d/.test(char))
              .join("")}`}
            style={{ fontWeight: "bold" }}
          >
            {phoneNumber}
          </a>
        </p>
      )}
      {!!subject && <h3>{subject}</h3>}
      <p>
        {message?.split("\n").map((p) => (
          <>
            {p}
            <br />
          </>
        ))}
      </p>
    </div>
  </div>
);
