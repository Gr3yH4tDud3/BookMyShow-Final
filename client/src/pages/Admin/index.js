import React, { useEffect } from 'react';
import { Tabs, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MovieList from './MovieList';
import TheatresTable from './TheatresTable';
import MovieForm from './MovieForm'; // Corrected import

function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = await axios.get("/api/users/get-current-user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(user.data.data);

        if (!user.data) {
          navigate("/admin");
          return;
        }

        if (user.data.data.role === "partner") {
          navigate("/partner");
          message.error("You are not allowed to access this page");
        } else if (user.data.data.role === "user") {
          navigate("/");
          message.error("You are not allowed to access this page");
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        message.error("An error occurred while checking the user role");
      }
    };

    checkUser();
  }, [navigate]);

  const tabItems = [
    {
      key: '1',
      label: 'Movies',
      children: <MovieList />
    },
    {
      key: '2',
      label: 'Theatres',
      children: <TheatresTable />
    }
  ];

  return (
    <div>
      <h1>Admin Page</h1>
      <Tabs items={tabItems} />
    </div>
  );
}

export default Admin;
