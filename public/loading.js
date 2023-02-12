import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#0971f1',
      darker: '#053e85',
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});

function LoadingComp(props){
    return(
        <div style={{position:'fixed',height:'100%',width:'100%',backgroundColor:'black',
                    opacity:'0.75',display:'flex',flexDirection:'column',justifyContent:'center',
                    alignItems:'center',zIndex:100}}>
            <ThemeProvider theme={theme}>
                <CircularProgress color='primary'></CircularProgress>
            </ThemeProvider>
        </div>
    )
}

export default LoadingComp