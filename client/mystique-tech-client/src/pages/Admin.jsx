import React from 'react';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-elegant text-Xe-purple-800 mb-8">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600">Welcome to the admin dashboard, {user.firstName}!</p>
          {/* Add admin functionality here */}
        </div>
      </div>
    </div>
  );
};

export default Admin;