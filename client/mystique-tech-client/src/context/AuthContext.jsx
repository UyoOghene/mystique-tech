// import React, { createContext, useState, useContext, useEffect } from 'react';

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuthStatus = () => {
//       try {
//         const token = localStorage.getItem('mystiqueTechToken');
//         const userData = localStorage.getItem('mystiqueTechUser');
        
//         if (token && userData) {
//           setUser(JSON.parse(userData));
//         }
//       } catch (error) {
//         console.error('Error checking auth status:', error);
//         localStorage.removeItem('mystiqueTechToken');
//         localStorage.removeItem('mystiqueTechUser');
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuthStatus();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       setLoading(true);
      
//       const response = await mockLoginAPI(email, password);
      
//       if (response.success) {
//         const userData = response.user;
        
//         localStorage.setItem('mystiqueTechToken', response.token);
//         localStorage.setItem('mystiqueTechUser', JSON.stringify(userData));
        
//         setUser(userData);
//         return { success: true, message: 'Login successful!' };
//       } else {
//         return { success: false, message: response.message };
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       return { success: false, message: 'An error occurred during login' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (userData) => {
//     try {
//       setLoading(true);
      
//       const response = await mockRegisterAPI(userData);
      
//       if (response.success) {
//         return { success: true, message: 'Registration successful! Please login.' };
//       } else {
//         return { success: false, message: response.message };
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
//       return { success: false, message: 'An error occurred during registration' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('mystiqueTechToken');
//     localStorage.removeItem('mystiqueTechUser');
//     setUser(null);
//   };

//   const updateUser = (updatedUserData) => {
//     try {
//       const userData = { ...user, ...updatedUserData };
//       localStorage.setItem('mystiqueTechUser', JSON.stringify(userData));
//       setUser(userData);
//       return { success: true, message: 'Profile updated successfully!' };
//     } catch (error) {
//       console.error('Update user error:', error);
//       return { success: false, message: 'Error updating profile' };
//     }
//   };

//   const isAdmin = user?.role === 'admin' || user?.isAdmin;

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     updateUser,
//     isAdmin,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // Mock API functions
// const mockLoginAPI = async (email, password) => {
//   await new Promise(resolve => setTimeout(resolve, 1000));

//   // Get users from localStorage or use default mock users
//   const storedUsers = JSON.parse(localStorage.getItem('mystiqueTechUsers') || '[]');
//   const defaultUsers = [
//     {
//       id: 1,
//       email: 'admin@mystiquetech.com',
//       password: 'admin123',
//       firstName: 'Admin',
//       lastName: 'User',
//       role: 'admin',
//       isAdmin: true
//     },
//     {
//       id: 2,
//       email: 'john@example.com',
//       password: 'password123',
//       firstName: 'John',
//       lastName: 'Doe',
//       role: 'user',
//       isAdmin: false
//     }
//   ];

//   const mockUsers = storedUsers.length > 0 ? storedUsers : defaultUsers;
//   const user = mockUsers.find(u => u.email === email && u.password === password);

//   if (user) {
//     const { password: _, ...userWithoutPassword } = user;
//     return {
//       success: true,
//       user: userWithoutPassword,
//       token: 'mock-jwt-token-' + user.id
//     };
//   }

//   return {
//     success: false,
//     message: 'Invalid email or password'
//   };
// };

// const mockRegisterAPI = async (userData) => {
//   await new Promise(resolve => setTimeout(resolve, 1000));

//   if (!userData.email || !userData.password || !userData.firstName) {
//     return {
//       success: false,
//       message: 'Please fill in all required fields'
//     };
//   }

//   if (userData.password.length < 6) {
//     return {
//       success: false,
//       message: 'Password must be at least 6 characters long'
//     };
//   }

//   const existingUsers = JSON.parse(localStorage.getItem('mystiqueTechUsers') || '[]');
//   const emailExists = existingUsers.some(user => user.email === userData.email);

//   if (emailExists) {
//     return {
//       success: false,
//       message: 'Email already exists'
//     };
//   }

//   const newUser = {
//     id: Date.now(),
//     ...userData,
//     role: 'user',
//     isAdmin: false,
//     createdAt: new Date().toISOString()
//   };

//   existingUsers.push(newUser);
//   localStorage.setItem('mystiqueTechUsers', JSON.stringify(existingUsers));

//   return {
//     success: true,
//     message: 'Registration successful'
//   };
// };

// export { AuthProvider, useAuth };

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mystiqueTechToken');
    const userData = localStorage.getItem('mystiqueTechUser');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('mystiqueTechToken', data.token);
        localStorage.setItem('mystiqueTechUser', JSON.stringify(data));
        setUser(data);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Server error' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await res.json();

      if (res.ok) {
        return { success: true, message: 'Registration successful! Please login.' };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Server error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('mystiqueTechToken');
    localStorage.removeItem('mystiqueTechUser');
    setUser(null);
  };

  const isAdmin = user?.isAdmin;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export { AuthProvider, useAuth };
