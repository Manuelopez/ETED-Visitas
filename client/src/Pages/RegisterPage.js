import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Select from 'react-select';

import { isAuth } from '../Middleware/isAuth';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#04AA6D',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  registerSelect: {
    width: 400,
  },
}));

export default function LogPage() {
  const classes = useStyles();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [groupRecord, setGroupRecords] = React.useState([]);
  const [groupSelected, setGroupSelected] = React.useState();
  const [specialKey, setSpecialKey] = React.useState('');

  const registerClicked = async () => {
    try {
      const response = await fetch('http://137.184.75.4:5000/api/user/signup', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          name,
          lastName,
          groupId: groupSelected.value,
          specialKey,
        }),
      });
      const jsonData = await response.json();
      console.log(jsonData);
      if (!jsonData.errors) {
        window.location.pathname = '/';
      }
    } catch (error) {}
  };
  const getGroups = async () => {
    try {
      const response = await fetch('http://137.184.75.4:5000/api/group', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      });
      const jsonData = await response.json();
      const formatedData = jsonData.map((group) => {
        return { value: group.id, label: group.name };
      });

      setGroupRecords(formatedData);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    isAuth('/form').then(() => getGroups());
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon style={{ color: 'white' }} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registrate
        </Typography>
        <TextField
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Usuario"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="name"
          label="Nombre"
          id="password"
          autoComplete="current-password"
        />
        <TextField
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="lastName"
          label="Apellido"
          id="password"
          autoComplete="current-password"
        />
        <TextField
          value={specialKey}
          onChange={(e) => setSpecialKey(e.target.value)}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="lastName"
          label="Clave Especial"
          id="password"
          autoComplete="current-password"
        />

        <label>
          Grupo:
          <Select
            className={classes.registerSelect}
            options={groupRecord}
            value={groupSelected}
            onChange={(group) => setGroupSelected(group)}
          />
        </label>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={registerClicked}
        >
          Registrar
        </Button>
        <Grid container>
          <Grid item>
            <Link href="/" variant="body2">
              {'Login'}
            </Link>
          </Grid>
        </Grid>
      </div>
      <Box mt={8}></Box>
    </Container>
  );
}
