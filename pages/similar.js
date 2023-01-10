import { AppBar, Button, useScrollTrigger,Dialog, FormControl, FormControlLabel, IconButton, makeStyles, Radio, RadioGroup, Slide, TextField, Toolbar, Typography } from '@material-ui/core'
import { Autocomplete, ToggleButton } from '@material-ui/lab'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import tickers from '../public/BSE_metadata'
import { createRef, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Scatter } from 'react-chartjs-2'
import CloseIcon from '@material-ui/icons/Close'
import React from 'react'
import NavBar from '../public/appbar';
import Top from '../public/ScrollTop'

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
  const [loading,setLoading] = useState(false)
  const [compF,setCompF] = useState(false)
  const [stock1,setStock1] = useState(tickers[0])
  const [corrD,setCorrD] = useState([])
  const [width,setWidth] = useState()
  const [height,setHeight] = useState()
  useEffect(() => {
    if (typeof window !== "undefined") {
      import('chartjs-plugin-zoom')
      import('hammerjs');
      window.addEventListener('orientationchange',function(){
        setWidth(window.innerHeight)
        setHeight(window.innerWidth)
      })
      if(window.matchMedia("(orientation:landscape)").matches){
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
      }
    }
  },[])
  const similar = (code,days) => {
    axios.post("http://localhost:8080/similar",{
      code:code,
      days:days
    }).then(res => {return res.data.codes}).then(res => setCorrD(res)).then(scatter.current =  Array(21).fill().map((ref, index) =>   scatter.current[index] = createRef())).then(res => setLoading(false))
  }
  const graph = (code,d,nm,i) => {
    //console.log(new Date())
    const options = {
      legend: {
        labels: {
            fontColor: 'black'
        }
      },
      tooltips: {
        enabled: true,
        callbacks: {
          label: function(tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label
            //console.log(tooltipItem)
            return label+"\n| Date: "+tooltipItem.xLabel+"\nPrice: "+tooltipItem.yLabel;
          },
          labelColor: function(tooltipItem, chart) {
            return {
                borderColor: 'black',
                backgroundColor: tooltipItem.datasetIndex===0?d[d.length-1]['y']>d[d.length-2]['y']?'green':'red':corrD[corrD.length-1].data[corrD[corrD.length-1].data.length-1]['y']>corrD[corrD.length-1].data[corrD[corrD.length-1].data.length-2]['y']?'blue':'pink'
            };
          },
        },
        custom: function(tooltipModel){
          var model = tooltipModel
          model.backgroundColor = 'rgba(0,0,0,0.8)'
          return model
        }
      },
      responsive: true,
      plugins: {
        zoom: {
          zoom: {
            enabled: true,
            drag: true,
            mode: 'x',
            rangeMax: {
              // Format of max pan range depends on scale type
              x: new Date()
            },
          },
          pan: {
            enabled: false,
            mode: 'x'
          }
        }
      },
      scales: {
        yAxes: [{
          id: 'A',
          type: 'linear',
          linear:{
            stepSize:'1'
          },
          ticks:{
            fontColor: 'black'
          },
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: nm+" Prices",
            fontColor: 'black'
          },
        }, {
          id: 'B',
          type: 'linear',
          position: 'right',
          ticks:{
            fontColor: 'black'
          },
          scaleLabel: {
            display: true,
            labelString: corrD[corrD.length-1].name+" Prices",
            fontColor: 'black'
          }
        }],
        xAxes: [{
          display: true,
          type: 'time',
          time: { 
            parser: 'DD/MM/YYYY',
            unit: "day",
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
        }]
      }
    }
    const plotData = {
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
        yAxisID: 'A',
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
        yAxisID: 'B',
        data: corrD[corrD.length-1].data
      }]
    }
    if(code===101)
      return <Scatter id={code} options={options} data={plotData} width={"900px"} height={"600px"} ref={scatter.current[20]}/>
    return <Scatter id={code} options={options} data={plotData} width={"900px"} height={"600px"} ref={scatter.current[i]}/>
  }
  const [corr,setCorr] = useState()
  const [value, setValue] = useState('180');
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  
  var dragOptions = {
    animationDuration: 1000
  }
  const pan = (i) => {
    console.log(scatter)
    var chart = scatter.current[i].current.chartInstance
    console.log(chart)
    var zoomOptions = chart.options.plugins.zoom.zoom
    var panOptions = chart.options.plugins.zoom.pan
    panOptions.enabled = panOptions.enabled ? false : true
    zoomOptions.enabled = zoomOptions.enabled ? false : true;
    chart.update();
    document.getElementById('pan'+i).style.backgroundColor==='black'?document.getElementById('pan'+i).style.backgroundColor='rgba(0,0,0,0)':document.getElementById('pan'+i).style.backgroundColor='black'
    document.getElementById('pan'+i).style.backgroundColor==='black'?document.getElementById('pan'+i).style.color='white':document.getElementById('pan'+i).style.color='black'
    console.log(chart.options.plugins.zoom.zoom)
    console.log(chart.options.plugins.zoom.pan)
  }

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

  const reset = () => {
    if(document.getElementById('graphs')!==null){
      for(let i=0;i<corrD.length-2;i++){
        scatter.current[i].current.chartInstance.resetZoom()
        document.getElementById('pan'+i).style.backgroundColor === 'black'?pan(i):null
      }
    }
  }

  const trigger = useScrollTrigger({
    disableHysteresis: true,
  });

  return (
    <div>
      <NavBar id='back-to-top-anchor'/>
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
                <ToggleButton style={{position:'absolute',left:'10px',width:'75px',height:'50px',color:'black',borderColor:'black'}} onClick={(e) => {scatter.current[20].current.chartInstance.resetZoom()}}>Zoom out</ToggleButton>
                <ToggleButton id={'pan'+20} onChange={() => {pan(20)}} style={{position:'absolute',right:'10px',width:'75px',height:'50px',color:'black',borderColor:'black',backgroundColor:'rgba(0,0,0,0)'}}>Allow Panning</ToggleButton>
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
                <Button variant="contained" color="primary" onClick={() => {reset();setLoading(true);similar(stock1.code,value);setCompF(true);document.getElementById('result').scrollIntoView({behavior:'smooth', block: "start"})}} disabled={stock1===null?true:false}>Find</Button>
              </div>
            </div>
            {
              compF?
              <div id='result'>
              {
                loading?
                <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignContent:'center'}}>
                  {/* <Loader
                    type="Audio" 
                    color="#00BFFF" 
                    height={80} 
                    width={80}
                    style={{marginTop:'2rem'}} 
                  /> */}
                </div>
                :
                <div id='graphs' style={{display:'flex',flexDirection:'column',justifyContent:'center',alignContent:'center'}}>
                  {
                    corrD.slice(0,corrD.length-2).map((e,index) => (
                      <div className={styles.card} id={index}>
                        <div style={{position:'relative',height:'50px',marginBottom:'10px'}}>
                          <ToggleButton id={'zoom'+index} style={{position:'absolute',left:'10px',width:'75px',height:'50px',color:'black',borderColor:'black'}} onClick={(e) => {scatter.current[index].current.chartInstance.resetZoom()}}>Zoom out</ToggleButton>
                          <ToggleButton id={'pan'+index} onChange={() => {pan(index)}} style={{position:'absolute',right:'10px',width:'75px',height:'50px',color:'black',borderColor:'black',backgroundColor:'rgba(0,0,0,0)'}}>Allow Panning</ToggleButton>
                        </div>
                          {graph(e.code,e.data,e.name,index)}
                        <div style={{position:'relative',height:'50px',marginTop:'10px'}}>
                          <ToggleButton style={{position:'absolute',right:'10px',width:'75px',height:'50px',color:'black',borderColor:'black',backgroundColor:'rgba(0,0,0,0)'}} onClick={() => {bigGraph(e.code,e.data,e.name,index)}}>Full Screen</ToggleButton>
                        </div>
                      </div>
                    ))
                  }
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
