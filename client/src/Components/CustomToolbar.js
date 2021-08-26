import React from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import etedLogo from '../Assets/etedLogo.jpg';
import { ListItemText } from '@material-ui/core';

const CustomToolbar = () => {
  const [openDrawer, setOpenDrawer] = React.useState(true);
  const classes = useStyles();
  return (
    <div>
      <AppBar className={!openDrawer ? classes.appBar : classes.appBarShift}>
        <Toolbar>
          <IconButton
            onClick={() => setOpenDrawer(!openDrawer)}
            className={!openDrawer ? classes.menuButton : classes.hide}
          >
            <MenuIcon />
          </IconButton>
          <img src={etedLogo} alt="Eted Logo" width="50" />
          <p className={classes.menuParagraph}>
            Empresa de Transmisión Eléctrica Dominicana
          </p>
        </Toolbar>
        <Drawer
          variant="persistent"
          anchor="left"
          open={openDrawer}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            {/* <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
              <ChevronLeftIcon style={{ fill: 'white' }} />
            </IconButton> */}
          </div>
          <Divider />
          <List>
            <ListItem
              button
              onClick={() => (window.location.pathname = '/user')}
            >
              <ListItemText className={classes.menutItem}>Usuario</ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => (window.location.pathname = '/node')}
            >
              <ListItemText className={classes.menutItem}>Nodo</ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => (window.location.pathname = '/form')}
            >
              <ListItemText className={classes.menutItem}>
                Formulario
              </ListItemText>
            </ListItem>
          </List>
        </Drawer>
      </AppBar>
    </div>
  );
};

const drawerWidth = 150;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },

  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#04AA6D',
  },

  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#04AA6D',
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: '#04AA6D',
  },
  menuParagraph: {
    marginLeft: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  menutItem: {
    color: 'white',
    textDecoration: 'none',
  },
}));

export default CustomToolbar;
