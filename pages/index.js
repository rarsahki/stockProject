import { AppBar, Button, Dialog, FormControl, FormControlLabel, IconButton, makeStyles, Radio, RadioGroup, Slide, TextField, Toolbar, Typography } from '@material-ui/core'
import { Autocomplete, ToggleButton } from '@material-ui/lab'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import tickers from '../public/BSE_metadata'
import React, { useEffect, useRef, useState, useMemo } from 'react'
import CloseIcon from '@material-ui/icons/Close'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import NavBar from '../public/appbar'
import Top from '../public/ScrollTop'
import { Chart, TimeScale,LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend } from 'chart.js'
import 'chartjs-adapter-date-fns';
import LoadingComp from '../public/loading'

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

export default function Home() {
  const scatter = useRef([])
  const [code,setCode] = useState(0)
  const [bg,setBg] = useState('linear-gradient:(white)')
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading,setLoading] = useState(true)
  const [compF,setCompF] = useState(false)
  const [maxY1,setMaxY1] = useState()
  const [maxY2,setMaxY2] = useState()
  const [stock1,setStock1] = useState(tickers[0])
  const [stock2,setStock2] = useState(tickers[1])
  const [close1,setClose1] = useState([{x:0,y:0},{x:0,y:0}])
  const [close2,setClose2] = useState([{x:0,y:0},{x:0,y:0}])
  const [dupStock1,setDupStock1] = useState()
  const [dupStock2,setDupStock2] = useState()
  const [startDate,setStartDate] = useState(new Date())
  const [endDate,setEndDate] = useState(new Date())
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
  var getDateArray = (start, end) => {
    var
      arr = new Array(),
      dt = new Date(start);
    while (dt <= end) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    console.log(startDate + " " + endDate)
    return arr;
  }
  const [corr,setCorr] = useState()
  const [value, setValue] = useState('180');
  
  const options = {
    animation: {
      duration: 2000,
      onComplete: function(context) {
        if (context.initial) {
          setPanInit()
          console.log('Initial animation finished');
        } else {
          console.log('animation finished');
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
                backgroundColor: tooltipItem.datasetIndex===0?close1[close1.length-1]['y']>close1[close1.length-2]['y']?'green':'red':close2[close2.length-1]['y']>close2[close2.length-2]['y']?'blue':'pink'
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
          x: {min: close1[0]['x'],max: new Date()},
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
      }
    }
  }

  const options1 = {
    animation: {
      duration: 2000,
      onComplete: function(context) {
        if (context.initial) {
          setPanInitFS()
          console.log('Initial animation finished');
          setLoading(false)
        } else {
          console.log('animation finished');
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
                backgroundColor: tooltipItem.datasetIndex===0?close1[close1.length-1]['y']>close1[close1.length-2]['y']?'green':'red':close2[close2.length-1]['y']>close2[close2.length-2]['y']?'blue':'pink'
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
          x: {min: close1[0]['x'],max: new Date()},
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
      }
    }
  }
  const data = {
    // labels: getDateArray(startDate,endDate).reverse().slice(0,parseInt(value)).map(e => e.toLocaleDateString()).reverse(),
    datasets: [{
      label: dupStock1,
      fill: false,
      lineTension: 0.1,
      showLine: true,
      borderColor: close1[close1.length-1]['y']>close1[close1.length-2]['y']?'green':'red',
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
      data: close1
    }, {
      label: dupStock2,
      fill: false,
      showLine: true,
      lineTension: 0.1,
      borderColor: close2[close2.length-1]['y']>close2[close2.length-2]['y']?'blue':'pink',
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
      data: close2
    }]
  }

  const data1 = {
    // labels: getDateArray(startDate,endDate).reverse().slice(0,parseInt(value)).map(e => e.toLocaleDateString()).reverse(),
    datasets: [{
      label: dupStock1,
      fill: false,
      lineTension: 0.1,
      showLine: true,
      borderColor: close1[close1.length-1]['y']>close1[close1.length-2]['y']?'green':'red',
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
      data: close1
    }, {
      label: dupStock2,
      fill: false,
      showLine: true,
      lineTension: 0.1,
      borderColor: close2[close2.length-1]['y']>close2[close2.length-2]['y']?'blue':'pink',
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
      data: close2
    }]
  }
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const apiKey = "MZpZJxZ7Gg-gP9yPtqwn"
  const pcorr1 = (x, y) => {
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0,
      sumY2 = 0;
    const minLength = x.length = y.length = Math.min(x.length, y.length),
      reduce = (xi, idx) => {
        const yi = y[idx];
        sumX += xi;
        sumY += yi;
        sumXY += xi * yi;
        sumX2 += xi * xi;
        sumY2 += yi * yi;
      }
    x.forEach(reduce);
    return (minLength * sumXY - sumX * sumY) / Math.sqrt((minLength * sumX2 - sumX * sumX) * (minLength * sumY2 - sumY * sumY));
  };
  const compare = (code1,code2,days,code) => {
    console.log(code1+" "+code2+" "+days)
    let ed1 = ""
    let ed2 = ""
    let sd1 = ""
    let sd2 = ""
    let y1 = []
    let y2 = []
    axios.get("https://www.quandl.com/api/v3/datasets/BSE/"+code1+".json?api_key="+apiKey,{
      headers:{
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
      }
    }).then(
      res => {ed1 = res.data.dataset.data.slice(0,1)[0][0]; sd1 = res.data.dataset.data[res.data.dataset.data.length-1][0]; y1 = res.data.dataset.data.slice(0,parseInt(days)).reverse().map(item => item[4]); return res.data.dataset.data.slice(0,parseInt(days)).reverse().map(item => item = {x:new Date(item[0]),y:item[4]})}
    ).catch(err => {console.log(err)}).then(
      result => {
        axios.get("https://www.quandl.com/api/v3/datasets/BSE/"+code2+".json?api_key="+apiKey,{
          headers:{
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
          }
        }).then(
          res => {ed2 = res.data.dataset.data.slice(0,1)[0][0]; sd2 = res.data.dataset.data[res.data.dataset.data.length-1][0]; console.log(res.data.dataset.data[0]); y2 = res.data.dataset.data.slice(0,parseInt(days)).reverse().map(item => item[4]); return res.data.dataset.data.slice(0,parseInt(days)).reverse().map(item => item = {x:new Date(item[0]),y:item[4]})}
        ).catch(err => {
          console.log(err)
        }).then(
          res => {
            let d1 = getDateArray(new Date(sd1),new Date(ed1)).reverse().slice(0,parseInt(value)).map(e => e.toLocaleDateString()).reverse()
            //let a1 = result.map((e,index) => e = {x:d1[index],y:e})
            let d2 = getDateArray(new Date(sd2),new Date(ed2)).reverse().slice(0,parseInt(value)).map(e => e.toLocaleDateString()).reverse()
            //let a2 = res.map((e,index) => e = {x:d2[index],y:e});
            setClose1(result)
            setClose2(res)
            console.log(result)
            console.log(res)
          }
        ).then(res => {
          setMaxY1(Math.max(y1))
          setMaxY2(Math.max(y2))
          return pcorr1(y1,y2);
        }).then(res => {
          setCorr(res);Math.abs(res)<=0.5?setBg('linear-gradient(#E55E5F,#E5585C,#B83024)'):Math.abs(res)<=0.8?setBg('linear-gradient(#F1B65C,#EEA05F,#E98163)'):setBg('linear-gradient(#78BB78,#5DAC5B,#559E3C)');
        }).then( 
          res => {
            new Date(ed1) >= new Date(ed2)?setEndDate(new Date(ed1)):setEndDate(new Date(ed2));console.log(ed1 + " " + ed2)
          }
        ).then(
          res => {
            new Date(sd1) <= new Date(sd2)?setStartDate(new Date(sd1)):setStartDate(new Date(sd2));console.log(sd1 + " " + sd2)
          }
        ).then(res =>
          {
            setDupStock1(stock1.name)
            setDupStock2(stock2.name)
          }
        ).then(res => {
          setTimeout(() => {
            document.getElementById('resultText').scrollIntoView({behavior:'smooth'});
          },50)
        }).then(res =>  {
            console.log(close1[close1.length-1]['y'])
            setLoading(false)
          }  
        )
      }
    )
  }

  const panFS = () => {
    var chart = scatter.current[1].config._config.options.plugins.zoom
    var zoomOptions = chart.zoom
    var panOptions = chart.pan
    if(document.getElementById('pan1').style.backgroundColor==='rgba(0, 0, 0, 0)' && panOptions.enabled===true){
      panOptions.enabled = true
    }else{
      panOptions.enabled = !panOptions.enabled
    }
    zoomOptions.drag.enabled = !zoomOptions.drag.enabled
    zoomOptions.pinch.enabled = !zoomOptions.pinch.enabled
    scatter.current[1].update();
    document.getElementById('pan1').style.backgroundColor==='black'?document.getElementById('pan1').style.backgroundColor='rgba(0,0,0,0)':document.getElementById('pan1').style.backgroundColor='black'
    document.getElementById('pan1').style.backgroundColor==='black'?document.getElementById('pan1').style.color='white':document.getElementById('pan1').style.color='black'
    console.log("Drag: "+zoomOptions.drag.enabled+", Pinch:"+zoomOptions.pinch.enabled)
    console.log("Pan: "+panOptions.enabled)
    console.log(scatter.current[1])
  }
  const pan = () => {
    var chart = scatter.current[0].config._config.options.plugins.zoom
    var zoomOptions = chart.zoom
    var panOptions = chart.pan
    if(document.getElementById('pan').style.backgroundColor==='rgba(0, 0, 0, 0)' && panOptions.enabled===true){
      panOptions.enabled = true
    }else{
      panOptions.enabled = !panOptions.enabled
    }
    zoomOptions.drag.enabled = !zoomOptions.drag.enabled
    zoomOptions.pinch.enabled = !zoomOptions.pinch.enabled
    scatter.current[0].update();
    document.getElementById('pan').style.backgroundColor==='black'?document.getElementById('pan').style.backgroundColor='rgba(0,0,0,0)':document.getElementById('pan').style.backgroundColor='black'
    document.getElementById('pan').style.backgroundColor==='black'?document.getElementById('pan').style.color='white':document.getElementById('pan').style.color='black'
    console.log("Drag: "+zoomOptions.drag.enabled+", Pinch:"+zoomOptions.pinch.enabled)
    console.log("Pan: "+panOptions.enabled)
    console.log(panOptions)
  }
  

  const setPanInitFS = () => {
    if(document.getElementById('pan1').style.backgroundColor==='rgba(0, 0, 0, 0)'){
      console.log('It works' + ' fs')
      var chart = scatter.current[1].config._config.options.plugins.zoom
      var panOptions = chart.pan
      var zoomOptions = chart.zoom
      zoomOptions.drag.enabled = true
      zoomOptions.pinch.enabled = true
      panOptions.enabled = false
      scatter.current[1].update();
    }
  }
  const setPanInit = () => {
    if(document.getElementById('pan').style.backgroundColor==='rgba(0, 0, 0, 0)'){
      console.log(scatter.current[0])
      console.log('It works')
      var chart = scatter.current[0].config._config.options.plugins.zoom
      var panOptions = chart.pan
      panOptions.enabled = false
      scatter.current[0].update();
    }
  }

  const graph1 = (code) => {
    if(code === 101)
      return <Line options={options1} data={data1} width='90%' height='60%' ref={(el) => {scatter.current[1] = el}}/>
    else 
      return <Line options={options} data={data} width='90%' height='60%' ref={(el) => {scatter.current[0] = el}}/>
  }
  const graph1Fn = useMemo(() => graph1(code), [close1,close2])

  const graph2Fn = useMemo(() => graph1(code), [code])

  const handleClose = () => {
    setOpen(false);
    console.log(scatter.current.pop())
  };
  
  const bigGraph = (stock1,stock2,days) => {
    setOpen(true)
  }

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
        <title>Compare Stocks</title>
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
            <div className={styles.card} id='result2'>
              <div style={{position:'relative',height:'50px',marginBottom:'10px'}}>
                <ToggleButton value={0} style={{position:'absolute',left:'10px',width:'75px',height:'50px',color:'black',borderColor:'black'}} onClick={(e) => {scatter.current[1].resetZoom()}}>Zoom out</ToggleButton>
                <ToggleButton value={0} id={'pan1'} onChange={() => {panFS()}} style={{position:'absolute',right:'10px',width:'75px',height:'50px',color:'black',borderColor:'black',backgroundColor:'rgba(0,0,0,0)'}}>Allow Panning</ToggleButton>
              </div>
              {
                graph2Fn
              }
            </div>:
            <div></div>
        }
      </Dialog>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Compare <a>Two Stocks</a>
        </h1>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3 style={{textAlign:"center"}}>Select two(2) stocks and click on compare</h3>
            <br></br>
            <div style={{display:'flex',flexDirection:'row',alignContent:'center',justifyContent:'center'}}>
              <Autocomplete
                id="combo-box-demo1"
                options={tickers}
                value={stock1}
                onChange={(event, newValue) => {
                  setStock1(newValue);
                }}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option,value) => option === value}
                style={{margin:'auto', width: 300 }}
                renderInput={(params) => <TextField {...params} label="Stock 1" variant="outlined" />}
              />
              <Autocomplete
                id="combo-box-demo2"
                options={tickers}
                value={stock2}
                onChange={(event, newValue) => {
                  setStock2(newValue);
                }}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option,value) => option === value}
                style={{ margin:'auto', width: 300 }}
                renderInput={(params) => <TextField {...params} label="Stock 2" variant="outlined" />}
              />
            </div>
            <br></br>
            <FormControl component="fieldset" disabled={stock1===null||stock2===null?true:false} fullWidth={true}>
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
            <div style={{display:'flex',flexDirection:'row',alignContent:'center',justifyContent:'center',marginTop:'50px'}}>
              <Button variant="contained" color="primary" onClick={() => {setBg("");document.getElementById('result').style.backgroundColor = 'white';setCompF(true);setLoading(true);setCode(1);compare(stock1.code,stock2.code,value)}} disabled={stock1===null||stock2===null?true:false}>Compare</Button>
            </div>
          </div>
          {
            compF?
            <div className={styles.card} id='result' style={{backgroundImage:bg,backgroundColor:'white'}}>
            {
              <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignContent:'center',width:'85vw'}}>
                <h3 id="resultText" style={{textAlign:'center'}}>Results:</h3>
                <h1 style={{textAlign:'center'}}>{Math.abs(corr)<=0.5?'😭':Math.abs(corr)<=0.8?'🧐':'🥳'}</h1>
                <h4 style={{textAlign:'center'}}>{Math.abs(corr)<=0.5?'Sorry, not similar':Math.abs(corr)<=0.8?'Little similar':'Very similar to each other'}</h4>
                <div style={{position:'relative',height:'50px'}}>
                  <ToggleButton value={0} style={{position:'absolute',left:'10px',width:'75px',height:'50px',color:'black',borderColor:'black'}} onClick={(e) => {console.log(scatter.current[0]);scatter.current[0].resetZoom()}}>Zoom out</ToggleButton>
                  <ToggleButton value={0} id="pan" onChange={() => {pan()}} style={{position:'absolute',right:'10px',width:'75px',height:'50px',color:'black',borderColor:'black',backgroundColor:'rgba(0,0,0,0)'}}>Allow Panning</ToggleButton>
                </div>
                {
                  graph1Fn
                }
                <div style={{position:'relative',height:'50px',marginTop:'10px'}}>
                  <ToggleButton style={{position:'absolute',right:'10px',width:'75px',height:'50px',color:'black',borderColor:'black',backgroundColor:'rgba(0,0,0,0)'}} onClick={() => {setCode(101);bigGraph(stock1.code,stock2.code,value);console.log(scatter);setLoading(true)}}>Full Screen</ToggleButton>
                </div>
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
      <Top/>
    </div>
  )
}
