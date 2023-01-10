import { Button, FormControl, FormControlLabel, Radio, RadioGroup, TextField } from '@material-ui/core'
import { Autocomplete, ToggleButton } from '@material-ui/lab'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import tickers from '../public/BSE_metadata'
import Loader from 'react-loader-spinner'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Scatter, Line } from 'react-chartjs-2'
import NavBar from '../public/appbar'
import Top from '../public/ScrollTop'
import { Chart, TimeScale,LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend } from 'chart.js'
import 'chartjs-adapter-date-fns';
import dynamic from 'next/dynamic'

export default function Home() {
  const scatter = useRef()
  const [bg,setBg] = useState('linear-gradient:(white)')
  const [loading,setLoading] = useState(false)
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
  // const zoomPlugin = dynamic(() => import('chartjs-plugin-zoom').then((mod) => mod.zoomPlugin), {
  //   ssr: false,
  // })
  useEffect(() => {
    if (typeof window !== "undefined") {
      import('hammerjs');
      import('chartjs-plugin-zoom').then((module) => {
        setTimeout(() => Chart.register(module.default,TimeScale,LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend ),5000) 
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
          enabled: false,
          mode: 'x',
        },
        limits: {
          x: {min: close1[0]['x'],max: new Date()},
          y: {min: 0,max: maxY1},
          y1: {min: 0,max: maxY2}
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
  const compare = (code1,code2,days) => {

    console.log(code1+" "+code2+" "+days)
    let ed1 = ""
    let ed2 = ""
    let sd1 = ""
    let sd2 = ""
    let y1 = []
    let y2 = []
    document.getElementById('result').scrollIntoView({behavior:'smooth', block: "start"})
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
            console.log(close1)
            console.log(close2)
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
        ).then(res => 
          { 
            setLoading(false)
          }
        ).then(res => {
          setTimeout(() => {
            document.getElementById('resultText').scrollIntoView({behavior:'smooth'});
          },50)
        }).then(res =>
          console.log(close1[close1.length-1]['y'])  
        )
      }
    )
  }
  var dragOptions = {
    animationDuration: 1000
  }
  const pan = () => {
    var chart = scatter.current.config._config.options.plugins.zoom
    var zoomOptions = chart.zoom
    var panOptions = chart.pan
    panOptions.enabled = !panOptions.enabled
    zoomOptions.drag.enabled = !zoomOptions.drag.enabled
    zoomOptions.pinch.enabled = !zoomOptions.pinch.enabled
    scatter.current.update();
    document.getElementById('pan').style.backgroundColor==='black'?document.getElementById('pan').style.backgroundColor='rgba(0,0,0,0)':document.getElementById('pan').style.backgroundColor='black'
    document.getElementById('pan').style.backgroundColor==='black'?document.getElementById('pan').style.color='white':document.getElementById('pan').style.color='black'
    console.log("Drag: "+zoomOptions.drag.enabled+", Pinch:"+zoomOptions.pinch.enabled)
    console.log("Pan: "+panOptions.enabled)
  }
  return (
    <div>
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

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a>Stock Comparer</a>
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
                getOptionLabel={(option) => option.code + " - " + option.name}
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
                getOptionLabel={(option) => option.code + " - " + option.name}
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
              <Button variant="contained" color="primary" onClick={() => {setBg("");document.getElementById('result').style.backgroundColor = 'white';setCompF(true);setLoading(true);compare(stock1.code,stock2.code,value)}} disabled={stock1===null||stock2===null?true:false}>Compare</Button>
            </div>
          </div>
          {
            compF?
            <div className={styles.card} id='result' style={{backgroundImage:bg,backgroundColor:'white'}}>
            {
              loading?
              <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignContent:'center'}}>
                {/* <Loader
                  type="Audio" 
                  color="#00BFFF" 
                  height={80} 
                  width={80} 
                /> */}
              </div>
              :
              <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignContent:'center',width:'85vw'}}>
                <h3 id="resultText" style={{textAlign:'center'}}>Results:</h3>
                <h1 style={{textAlign:'center'}}>{Math.abs(corr)<=0.5?'😭':Math.abs(corr)<=0.8?'🧐':'🥳'}</h1>
                <h4 style={{textAlign:'center'}}>{Math.abs(corr)<=0.5?'Sorry, not similar':Math.abs(corr)<=0.8?'Little similar':'Very similar to each other'}</h4>
                <div style={{position:'relative',height:'50px'}}>
                  <ToggleButton value={0} style={{position:'absolute',left:'10px',width:'75px',height:'50px',color:'black',borderColor:'black'}} onClick={(e) => {console.log(scatter.current);scatter.current.resetZoom()}}>Zoom out</ToggleButton>
                  <ToggleButton value={0} id="pan" onChange={() => {pan()}} style={{position:'absolute',right:'10px',width:'75px',height:'50px',color:'black',borderColor:'black',backgroundColor:'rgba(0,0,0,0)'}}>Allow Panning</ToggleButton>
                </div>
                <Line options={options} data={data} width='90%' height='60%' ref={scatter}/>
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
