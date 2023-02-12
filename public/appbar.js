import { AppBar, IconButton, Toolbar, Button, Typography, MenuItem, Menu, useMediaQuery } from "@material-ui/core";
import { useRouter } from 'next/router'
import styles from '../styles/appbar.module.css'
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from "react";
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      ["@media (min-width:768px)"]: { display:'none' }
    },
    title: {
      flexGrow: 1,
    },
  }));

function NavBar(props){
    const classes = useStyles();
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return(
        <div className={classes.root}>
            <AppBar position="relative">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Welcome
                    </Typography>
                    <div className={styles.buttons}>
                        <Button color="inherit" onClick={() => router.push('/')}>Compare</Button>
                        <Button color="inherit" onClick={() => router.push('/similar')}>Similar</Button>
                    </div>
                    <IconButton edge="end" className={classes.menuButton} color="inherit" aria-label="menu"  aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="fade-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                    >
                        <MenuItem onClick={() => router.push('/')}>Compare</MenuItem>
                        <MenuItem onClick={() => router.push('/similar')}>Similar</MenuItem>
                        {/* <MenuItem onClick={() => router.push('/similar')}>Blog</MenuItem> */}
                    </Menu>
                </Toolbar>
            </AppBar>
        </div>
    )   
}

export default NavBar