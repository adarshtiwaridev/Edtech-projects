import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  LogOut, 
  X,
  Users,
  Grid,
  Heart
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = user?.accountType || user?.role || 'Student';

  const getNavLinks = () => {
    const commonLinks = [
      { name: 'My Profile', path: '/dashboard/my-profile', icon: <LayoutDashboard size={20} /> },
      { name: 'Settings', path: '/dashboard/setting', icon: <Settings size={20} /> },
    ];

    if (role === 'Student') {
      return [
        ...commonLinks,
        { name: 'Enrolled Courses', path: '/dashboard/student/my-courses', icon: <BookOpen size={20} /> },
        { name: 'Wishlist', path: '/dashboard/cart', icon: <Heart size={20} /> },
      ];
    } else if (role === 'Teacher' || role === 'Instructor') {
      return [
        ...commonLinks,
        { name: 'My Courses', path: '/dashboard/teacher/courses', icon: <BookOpen size={20} /> },
      ];
    } else if (role === 'Admin') {
      return [
        ...commonLinks,
        { name: 'Admin Dashboard', path: '/dashboard/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Manage Courses', path: '/dashboard/admin/courses', icon: <BookOpen size={20} /> },
        { name: 'Categories', path: '/dashboard/admin/categories', icon: <Grid size={20} /> },
        { name: 'All Users', path: '/dashboard/admin/users', icon: <Users size={20} /> },
        { name: 'Instructors', path: '/dashboard/admin/teachers', icon: <Users size={20} /> },
      ];
    }
    return commonLinks;
  };

  const navLinks = getNavLinks();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Brand */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-neutral-800 shrink-0">
        <NavLink to="/" className="flex items-center gap-2">
          <img src="/Images/logo2.png" alt="Logo" className="h-10 dark:invert" />
        </NavLink>
        <button className="lg:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800/50'
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
