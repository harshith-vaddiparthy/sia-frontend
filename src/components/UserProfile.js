import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { Menu, MenuButton, MenuList, MenuItem, IconButton, Avatar } from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        console.log("No user is logged in.");
      }
    });
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out.");
        // Redirect to the login page or handle accordingly
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Error during sign-out:", error);
      });
  };

  if (!user) return null;

  return (
    <div style={{ position: "absolute", bottom: "26px", left: "12px", zIndex: 1000 }}>
      <Menu>
        <MenuButton as={IconButton} icon={<Avatar src={user.photoURL} />} variant="unstyled" /> {/* Removed the outline */}
        <MenuList>
          <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

export default UserProfile;
