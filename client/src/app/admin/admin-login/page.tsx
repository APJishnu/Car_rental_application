// admin-login/page.tsx
'use client'; // Add this directive

import LoginForm from '../components/AdminLoginForm/LoginForm'; // Adjust the path if needed

const AdminLoginPage = () => {
  return (
    <div className="admin-login-page">
      <LoginForm />
    </div>
  );
};

export default AdminLoginPage;
