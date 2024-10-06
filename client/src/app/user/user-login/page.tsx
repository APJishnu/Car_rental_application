// app/user-login/page.tsx

import React from "react";
import LoginForm from "../../../modules/user/components/UserLoginForm/LoginForm"; // Adjust the path based on your project structure

const UserLoginPage: React.FC = () => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default UserLoginPage;
