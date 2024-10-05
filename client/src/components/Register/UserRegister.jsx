import React from 'react';
import { useRegisterMutation, useAllUsersQuery } from '../../features/api/userAuth/userAuth'; // Import the useRegisterMutation hook
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';

const UserRegister = () => {
  const [register, { isLoading }] = useRegisterMutation(); // Destructure the mutation
  const navigate = useNavigate();
  
  // Fetch all users
  const { data: usersDat, isLoading: isUsersLoading } = useAllUsersQuery();
  const users = usersDat?.data; // Assuming the users data is in usersDat.data

  console.log(users, 'All Users');

  // Regex patterns for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[a-zA-Z\s]{2,30}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target); // Create FormData object from the form
    const values = {
      name: formData.get('name'),
      userEmail: formData.get('email'),
      password: formData.get('password'),
      referrerId: formData.get('referrer'), // Get selected referrer from dropdown
    };

    // Validate inputs
    if (!nameRegex.test(values.name)) {
      toast.error('Name must be 2-30 characters long and contain only letters and spaces.');
      return;
    }

    if (!emailRegex.test(values.userEmail)) {
      toast.error('Invalid email format.');
      return;
    }

    if (!passwordRegex.test(values.password)) {
      toast.error('Password must be at least 8 characters long, contain at least one letter, one number, and one special character.');
      return;
    }

    try {
      const response = await register(values).unwrap();
      toast.success(response.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      toast.error(err.data.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://www.alwin.io/assets/images/logo-new.svg"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  name="name"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Dropdown for selecting referrer */}
            <div>
              <label htmlFor="referrer" className="block text-sm font-medium leading-6 text-gray-900">
                Referrer (Select User)
              </label>
              <div className="mt-2">
                <select
                  id="referrer"
                  name="referrer"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue=""
                >
                  <option value="" disabled>Select a user</option>
                  {!isUsersLoading && users?.length > 0 ? (
                    users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user?.name} 
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Loading users...</option>
                  )}
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading} // Disable button while loading
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLoading ? 'Registering...' : 'Register'} {/* Change button text while loading */}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default UserRegister;
