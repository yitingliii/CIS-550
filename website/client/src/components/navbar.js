// import React from "react";
// import { AppBar, Container, Toolbar, Typography } from "@mui/material";
// import { NavLink } from "react-router-dom";

// // Helper component to style each navigation link
// function NavText({ href, text, isMain }) {
//   return (
//     <Typography
//       variant={isMain ? "h5" : "h7"} // Larger for main item
//       noWrap
//       style={{
//         marginRight: "30px",
//         fontFamily: "monospace",
//         fontWeight: 700,
//         letterSpacing: ".3rem",
//       }}
//     >
//       <NavLink
//         to={href}
//         style={{
//           color: "inherit",
//           textDecoration: "none",
//         }}
//       >
//         {text}
//       </NavLink>
//     </Typography>
//   );
// }

// // Main NavBar component
// export default function NavBar() {
//   return (
//     <AppBar position="static">
//       <Container maxWidth="xl">
//         <Toolbar disableGutters>
//           {/* Main Logo */}
//           <NavText href="/" text="SWIFTIFY" isMain />
//           {/* Other Links */}
//           <NavText href="/albums" text="ALBUMS" />
//           <NavText href="/songs" text="SONGS" />
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }
