import { AppBar, Button, useScrollTrigger,Dialog, FormControl, FormControlLabel, IconButton, makeStyles, Radio, RadioGroup, Slide, TextField, Toolbar, Typography } from '@material-ui/core'
import { Autocomplete, ToggleButton } from '@material-ui/lab'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import tickers from '../public/BSE_metadata'
import { useEffect, useRef, useState, useMemo } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import CloseIcon from '@material-ui/icons/Close'
import React from 'react'
import NavBar from '../public/appbar';
import Top from '../public/ScrollTop'
import { Chart, TimeScale,LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend } from 'chart.js'
import 'chartjs-adapter-date-fns';
import LoadingComp from '../public/loading'
import { isZoomedOrPanned } from 'chartjs-plugin-zoom'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Home(props) {
  const scatter = useRef([])
  const [days,setDays] = useState(0)
  const [loading,setLoading] = useState(true)
  const [compF,setCompF] = useState(false)
  const [stock1,setStock1] = useState(tickers[0])
  const [corrD,setCorrD] = useState([{data:[{x:0,y:0}]}])
  const [width,setWidth] = useState()
  const [height,setHeight] = useState()
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      import('hammerjs');
      import('chartjs-plugin-zoom').then((module) => {
        setTimeout(() => {Chart.register(module.default,TimeScale,LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend );setLoading(false)},5000) 
      })
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }else{
      console.log("Ehhh! window aint defined!")
    }
  },[])
  const similar = (code,days) => {
    axios.post("http://localhost:8080/similar",{
      code:code,
      days:days
    }).
    then(res => {console.log(res.data);return res.data.codes;}).
    then(res => setCorrD(res)).
    then(() => {
        document.getElementById('graphs').
        scrollIntoView({behavior:'smooth', block: 'start'})
    })
  }

  const graph = (code,d,nm,i) => {
    console.log(days)
    //console.log(new Date())
    const options = {
      animation: {
        duration: 2000,
        onComplete: function(context) {
          if (context.initial) {
            setPanInit(i)
            if(i===corrD.length-3&&loading===true){
              setLoading(false)
              console.log('Initial animation finished');
            }
          } else {
            if(i===corrD.length-3&&loading===true){
              setLoading(false)
              console.log('animation finished');
            }
          }
        }
      },
      legend: {
        labels: {
            fontColor: 'black'
        }
      },
      responsive: true,
      plugins: {
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
              var label = context.dataset.label || '';
              return label+"\n| Date: "+new Date(context.parsed.x).toLocaleDateString('en-US')+"\nPrice: "+context.parsed.y;
            },
            labelColor: function(tooltipItem, chart) {
              return {
                  borderColor: 'black',
                  backgroundColor: tooltipItem.datasetIndex===0?d[d.length-1]['y']>d[d.length-2]['y']?'green':'red':corrD[corrD.length-1].data[corrD[corrD.length-1].data.length-1]['y']>corrD[corrD.length-1].data[corrD[corrD.length-1].data.length-2]['y']?'blue':'pink'
                };
            },
            title: function(context) {
              return "";
            },
          },
        },
        zoom: {
          zoom: {
            drag: {
              enabled: true,
              borderWidth: 1
            },
            pinch: {
              enabled: true
            },
            mode: 'x',
          },
          pan: {
            enabled: true,
            mode: 'x',
          },
          limits: {
            x: {min: corrD[0].data['x'],max: new Date()},
          }
        }
      },
      scales: {
        y: {
          type: 'linear',
          linear:{
            stepSize:'1'
          },
          ticks:{
            fontColor: 'black'
          },
          position: 'left',
        },
        y2: {
          type: 'linear',
          position: 'right',
          ticks:{
            fontColor: 'black'
          },
          grid: {
            drawOnChartArea: false // only want the grid lines for one axis to show up
          }
        },
        x: {
          display: true,
          type: 'time',
          time: { 
            parser: 'MM/dd/yyyy',
            unit: "month",
            stepSize: "1",
          },
          ticks: {
            max: new Date(),
            fontColor: 'black'
          },
          scaleLabel: {
            display: true,
            labelString: 'Date',
            fontColor: 'black'
          },
        }
      }
    }
    const data = {
      // labels: getDateArray(startDate,endDate).reverse().slice(0,parseInt(value)).map(e => e.toLocaleDateString()).reverse(),
      datasets: [{
        label: nm,
        fill: false,
        lineTension: 0.1,
        showLine: true,
        borderColor: d[d.length-1]['y']>d[d.length-2]['y']?'green':'red',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'black',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        yAxisID: 'y',
        data: d
      }, {
        label: corrD[corrD.length-1].name,
        fill: false,
        showLine: true,
        lineTension: 0.1,
        borderColor: corrD[corrD.length-1].data[corrD[corrD.length-1].data.length-1]['y']>corrD[corrD.length-1].data[corrD[corrD.length-1].data.length-2]['y']?'blue':'pink',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'black',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        yAxisID: 'y2',
        data: corrD[corrD.length-1].data
      }]
    }
    if(code===101)
      return <Line id={code} options={options} data={data} width='900px' height='600px' ref={(el) => {scatter.current[20] = el}}/>
    return (
      <div className={styles.card} id={i}>
        <div style={{position:'relative',height:'50px',marginBottom:'10px'}}>
          <ToggleButton value={0} id={'zoom'+i} style={{position:'absolute',left:'10px',width:'75px',height:'50px',color:'black',borderColor:'black'}} onClick={(e) => {console.log(scatter.current[i]);scatter.current[i].resetZoom()}}>Zoom out</ToggleButton>
          <ToggleButton value={0} id={'pan'+i} onChange={() => {pan(i)}} style={{position:'absolute',right:'10px',width:'75px',height:'50px',color:'black',borderColor:'black',backgroundColor:'rgba(0,0,0,0)'}}>Allow Panning</ToggleButton>
        </div>
        <div>
          <Line id={code} options={options} data={data} width='900px' height='600px' ref={(el) => {scatter.current[i] = el}}/>
        </div>
        <div style={{position:'relative',height:'50px',marginTop:'10px'}}>
          <ToggleButton style={{position:'absolute',right:'10px',width:'75px',height:'50px',color:'black',borderColor:'black',backgroundColor:'rgba(0,0,0,0)'}} onClick={() => {bigGraph(code,d,nm,i)}}>Full Screen</ToggleButton>
        </div>
      </div>
    )
  }


  const pan = (i) => {
    console.log(i)
    var chart = scatter.current[i].config._config.options.plugins.zoom
    var zoomOptions = chart.zoom
    var panOptions = chart.pan
    if(document.getElementById('pan'+i).style.backgroundColor==='rgba(0, 0, 0, 0)' && panOptions.enabled===true){
      panOptions.enabled = true
    }else{
      panOptions.enabled = !panOptions.enabled
    }
    zoomOptions.drag.enabled = !zoomOptions.drag.enabled
    zoomOptions.pinch.enabled = !zoomOptions.pinch.enabled
    scatter.current[i].config.update('none');
    document.getElementById('pan'+i).style.backgroundColor==='black'?document.getElementById('pan'+i).style.backgroundColor='rgba(0,0,0,0)':document.getElementById('pan'+i).style.backgroundColor='black'
    document.getElementById('pan'+i).style.backgroundColor==='black'?document.getElementById('pan'+i).style.color='white':document.getElementById('pan'+i).style.color='black'
    console.log("Drag: "+zoomOptions.drag.enabled+", Pinch:"+zoomOptions.pinch.enabled)
    console.log("Pan: "+panOptions.enabled)
    console.log(scatter.current[i].config)
  }
  const setPanInit = (i) => {
    if(document.getElementById('pan'+i).style.backgroundColor==='rgba(0, 0, 0, 0)'){
      console.log('It works')
      var chart = scatter.current[i].config._config.options.plugins.zoom
      var panOptions = chart.pan
      panOptions.enabled = false
      console.log(chart)
      scatter.current[i].config.update('none');
    }
    console.log(i)
  }
  const changeDetector = (corrD) => {
    let arr = []
    if(corrD!==undefined){
      if(corrD[0]!==undefined)
        corrD.slice(0,corrD.length-2).map((e,index) => {
          arr.push(graph(e.code,e.data,e.name,index));
        }
      )
      return arr;
    }
  }

  const graphs = useMemo(() => changeDetector(corrD), [corrD])

  const [corr,setCorr] = useState()
  const [value, setValue] = useState('180');
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [graphProp,setGraphProp] = useState([])
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const bigGraph = (code,d,nm,i) => { 
    setOpen(true)
    setGraphProp([code,d,nm,i])
  }

  const reset = (code,value) => {
    console.log(code+" "+value)
    console.log("check "+scatter.current[0])
    if(document.getElementById('graphs')!==null){
      for(let i=0;i<corrD.length-2;i++){
        scatter.current[i].resetZoom()
        setPanInit(i)
        document.getElementById('pan'+i).style.backgroundColor === 'black'?pan(i):null
        if(i===corrD.length-3){
            similar(code,value)
        }
      }
    }else{
      similar(code,value)
    }
  }

  const trigger = useScrollTrigger({
    disableHysteresis: true,
  });

  return (
    <div>
      {loading?<LoadingComp/>:null}
      <NavBar id='back-to-top-anchor'/>
      <Head>
        <meta charset='utf-8' />
        <meta http-equiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=yes' />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name='description' content='Description' />
        <meta name='keywords' content='Keywords' />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png"></link>
        <meta name="theme-color" content="#317EFB"/>
      </Head>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon/>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Full Screen Graph (Use Landscape for better viewing)
            </Typography>
          </Toolbar>
        </AppBar>
        {
          open?
            <div className={styles.card} id={graphProp[3]}>
              <div style={{position:'relative',height:'50px',marginBottom:'10px'}}>
                <ToggleButton value={0} style={{position:'absolute',left:'10px',width:'75px',height:'50px',color:'black',borderColor:'black'}} onClick={(e) => {scatter.current[20].resetZoom()}}>Zoom out</ToggleButton>
                <ToggleButton value={0} id={'pan'+20} onChange={() => {pan(20)}} style={{position:'absolute',right:'10px',width:'75px',height:'50px',color:'black',borderColor:'black',backgroundColor:'rgba(0,0,0,0)'}}>Allow Panning</ToggleButton>
              </div>
              {graph(101,graphProp[1],graphProp[2],graphProp[3])}
            </div>:
            <div></div>
        }
      </Dialog>
      {
        width>height&&(/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))?
        <div>
          <Slide in={trigger} direction={'right'}>
            <aside style={{position:'fixed',top:20,left:0}}>
              {
                corrD.slice(0,corrD.length-2>10?10:corrD.length-2).map((e,index) => (
                  <div className={styles.stockLabelLeft} 
                    style={{background:e.data[e.data.length-1]['y']>=e.data[e.data.length-2]['y']?'green':'red',
                    cursor:'default',
                    width:'20px',
                    textAlign:'center',
                    paddingTop:'15%',
                    textOverflow:'clip',

                    paddingRight:'20%'}}
                    onClick={() => {
                      document.getElementById(e.code).scrollIntoView({behavior:'smooth', block: "start"})
                    }}>
                      {
                        window.innerWidth>900?e.name.substring(0,10):index+1
                      }
                  </div>
                ))
              }
            </aside>
          </Slide>
          {
            corrD.length-2>10?
            <Slide in={trigger} direction={'left'}>
              <aside style={{position:'fixed',top:20,right:0}}>
                {
                  corrD.slice(10,corrD.length-2).map((e,index) => (
                    <div className={styles.stockLabel} 
                      style={{background:e.data[e.data.length-1]['y']>=e.data[e.data.length-2]['y']?'green':'red',
                      cursor:'default',
                      width:window.innerWidth>900?'100px':'20px'}}
                      onMouseEnter={() => {
                        document.getElementById('label'+index).style.borderColor='#9D00FF'
                        document.getElementById('label'+index).style.borderWidth='2px 0 2px 2px'
                      }}
                      onMouseLeave={() => {
                        document.getElementById('label'+index).style.borderColor='black'
                        document.getElementById('label'+index).style.borderWidth='0.5px 0 0.5px 0.5px'
                      }}
                      onClick={() => {
                        document.getElementById(e.code).scrollIntoView({behavior:'smooth', block: "start"})
                      }}>
                        {
                          window.innerWidth>900?e.name.substring(0,10):index+11
                        }
                    </div>
                  ))
                }
              </aside>
            </Slide>:
            <div></div>
          }
        </div>:
        <Slide in={trigger} direction={'left'}>
          <aside style={{position:'fixed',top:20,right:0}}>
            {
              corrD.slice(0,corrD.length-2).map((e,index) => (
                <div className={styles.stockLabel} id={'label'+index}
                  style={{background:e.data[e.data.length-1]['y']>=e.data[e.data.length-2]['y']?'#00A86B':'red',
                  cursor:'default',
                  width:window.innerWidth>900?'100px':'20px',}}
                  onMouseEnter={() => {
                    document.getElementById('label'+index).style.borderColor='#9D00FF'
                    document.getElementById('label'+index).style.borderWidth='2px 0 2px 2px'
                  }}
                  onMouseLeave={() => {
                    document.getElementById('label'+index).style.borderColor='black'
                    document.getElementById('label'+index).style.borderWidth='0.5px 0 0.5px 0.5px'
                  }}
                  onClick={() => {
                    document.getElementById(e.code).scrollIntoView({behavior:'smooth', block: "start"})
                  }}>
                    {
                      window.innerWidth>900?e.name.substring(0,10):index+1
                    }
                </div>
              ))
            }
          </aside>
        </Slide>
      }
      <div className={styles.container} >
        <Head>
          <title>Similar Stocks</title>
          <meta charset='utf-8' />
          <meta http-equiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=yes' />
          <meta name='description' content='Description' />
          <meta name='keywords' content='Keywords' />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="public/icons/icon-192x192.png" />
          <link rel="apple-touch-icon" href="public/icons/icon-192x192.png"></link>
          <meta name="theme-color" content="#317EFB"/>
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            Find <a>Similar Stocks</a>
          </h1>

          <div className={styles.grid}>
            <div className={styles.card}>
              <h3 style={{textAlign:"center"}}>Select a stock and click on find</h3>
              <br></br>
              <div style={{display:'flex',flexDirection:'row',alignContent:'center',justifyContent:'center'}}>
                  <Autocomplete
                  id="combo-box-demo1"
                  options={tickers}
                  value={stock1}
                  onChange={(event, newValue) => {
                      setStock1(newValue);
                  }}
                  getOptionLabel={(option) => option.code + " - " + option.name}
                  getOptionSelected={(option,value) => option === value}
                  style={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Stock 1" variant="outlined"/>}
                  />
              </div>
              <br></br>
              <FormControl component="fieldset" disabled={stock1===null?true:false} fullWidth={true}>
                <RadioGroup row defaultValue='90' style={{justifyContent:"center"}} value={value} onChange={handleChange}>
                  <FormControlLabel
                    value='180'
                    control={<Radio color="primary" />}
                    label="Last 180 days"
                  />
                  <FormControlLabel
                    value='90'
                    control={<Radio color="primary" />}
                    label="Last 90 days"
                  />
                  <FormControlLabel
                    value='20'
                    control={<Radio color="primary" />}
                    label="Last 20 days"
                  />
                </RadioGroup>
              </FormControl>
              <div style={{display:'flex',flexDirection:'row',alignContent:'center',justifyContent:'center',marginTop:'30px'}}>
                <Button variant="contained" color="primary" onClick={() => {console.log("logs"+scatter.current);reset(stock1.code,value);setLoading(true);setCompF(true);setDays(value===180?0:value===90?89:159)}} disabled={stock1===null?true:false}>Find</Button>
              </div>
            </div>
            {
              compF?
              <div id='result'>
              {
                <div id='graphs' style={{display:'flex',flexDirection:'column',justifyContent:'center',alignContent:'center'}}>
                  {graphs}
                </div>
              }
              </div>:
              <div id='result'></div>
            }
          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://www.youtube.com/watch?v=-MdLC5For4U"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <img src="/santo.jpeg" alt="Picture of the author" width={50} height={45}/>
          </a>
        </footer>
      </div>
      <Top/>
    </div>
  )
}
