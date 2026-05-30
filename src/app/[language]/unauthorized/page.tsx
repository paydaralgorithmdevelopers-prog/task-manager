import { Box, Typography } from "@mui/material";
import Link from "next/link";

type Props = {
  params: Promise<{ language: string }>;
};

export default async function UnauthorizedPage({ params }: Props) {
  const { language } = await params;

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        px: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        403 — Access Denied
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
        You don&apos;t have the required permissions to view this page. Contact
        your administrator if you believe this is a mistake.
      </Typography>
      <Link
        href={`/${language}/dashboard`}
        style={{
          marginTop: 8,
          padding: "6px 16px",
          border: "1px solid currentColor",
          borderRadius: 4,
          textDecoration: "none",
          color: "inherit",
          fontSize: "0.875rem",
        }}
      >
        Back to Dashboard
      </Link>
    </Box>
  );
}
