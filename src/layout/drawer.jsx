import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});
export const DrawerMenu = (props) => {
  const classes = useStyles();

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={() => props.toggleDrawer()}
      onKeyDown={() => props.toggleDrawer()}
    >
      <List>
        <Link to={'/todo'}>
          <ListItem button key={'ToDo'}>
            <ListItemIcon>
              <FaIcons.FaCheckSquare />
            </ListItemIcon>
            <ListItemText primary={'ToDo'} />
          </ListItem>
        </Link>
        <Link to={'/budget'}>
          <ListItem button key={'Budget'}>
            <ListItemIcon>
              <FaIcons.FaMoneyBill />
            </ListItemIcon>
            <ListItemText primary={'Budget'} />
          </ListItem>
        </Link>
      </List>
      <Divider />
    </div>
  );

  return (
    <div>
      {' '}
      <div>
        {props.sideMenuState && (
          <React.Fragment key={'left'}>
            <Drawer
              anchor={'left'}
              open={props.sideMenuState}
              onClose={() => props.toggleDrawer()}
            >
              {list('left')}
            </Drawer>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
