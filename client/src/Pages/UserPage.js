import React from 'react';
import { makeStyles } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';

import { isAuth } from '../Middleware/isAuth';

const UserPage = (props) => {
  const classes = useStyles();
  const [userName, setUserName] = React.useState('');
  const [name, setName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const logoutClicked = () => {
    localStorage.removeItem('token');
    window.location.pathname = '/';
  };

  const updateUserClicked = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://137.184.75.4:5001/api/user', {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: userName,
          name,
          lastName,
          password,
        }),
      });

      const updatedUser = await response.json();
      console.log(updatedUser);

      setPassword('');
    } catch (error) {
      console.log(error);
    }
  };

  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://137.184.75.4:5001/api/user', {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const userInfo = await response.json();
      setUserName(userInfo.username);
      setName(userInfo.name);
      setLastName(userInfo.lastName);
      setPassword('');
      console.log(userInfo);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    isAuth();
    getUserInfo();
    setPassword('');
  }, []);

  return (
    <div className={classes.root}>
      <AccountCircleIcon className={classes.accountCirlce} />

      <label>
        <p>Usuario</p>
        <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
      </label>
      <label>
        <p>Nombre</p>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        <p>Apellido</p>
        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </label>
      <label>
        <p>Contraseña</p>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <div>
        <Button
          variant="contained"
          style={{ marginRight: 20, marginTop: 20 }}
          onClick={updateUserClicked}
        >
          Actualizar
        </Button>
        <Button
          variant="contained"
          style={{ marginTop: 20 }}
          onClick={logoutClicked}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 150,
    marginTop: 80,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountCirlce: {
    fontSize: 100,
  },
}));

export default UserPage;
