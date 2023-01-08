import { useState, useEffect } from 'react'
import { Navigation } from '../components/navigation'
import { Header } from '../components/header'
import { Features } from '../components/features'
import { About } from '../components/about'
import { Services } from '../components/services'
import { Contact } from '../components/contact'
import JsonData from './data/data.json'
import dynamic from 'next/dynamic'
import Head from 'next/head'

export var scroll = ""

const App = () => {
  const [landingPageData, setLandingPageData] = useState({})
  useEffect(() => {
    if (typeof window !== "undefined") {
      dynamic(() => import('smooth-scroll').then((SmoothScroll) => {scroll = new SmoothScroll('a[href*="#"]', {
        speed: 1000,
        speedAsDuration: true,
      })}))
    }
    setLandingPageData(JsonData)
  }, [])

  return (
    <div>
      <Head>
        <meta charset="utf-8" />
        <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=yes' />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="img/apple-touch-icon.png" />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="img/apple-touch-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="img/apple-touch-icon-114x114.png"
        />

        <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
        <link
          rel="stylesheet"
          type="text/css"
          href="fonts/font-awesome/css/font-awesome.css"
        />
        <link rel="stylesheet" type="text/css" href="css/style.css" />
        <link
          rel="stylesheet"
          type="text/css"
          href="css/nivo-lightbox/nivo-lightbox.css"
        />
        <link rel="stylesheet" type="text/css" href="css/nivo-lightbox/default.css" />
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Lato:400,700"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Raleway:300,400,500,600,700,800,900"
          rel="stylesheet"
        />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <title>Welcome to Stockcompare.in</title>
        <meta name="description" content="" />
        <meta name="author" content="@Issaafalkattan" />
      </Head>

      <body id="page-top" data-spy="scroll" data-target=".navbar-fixed-top">
        <div id="root">
          <Navigation />
          <Header data={landingPageData.Header} />
          <About data={landingPageData.About} />
          <Services data={landingPageData.Services} />
          <Contact data={landingPageData.Contact} />
        </div>
        <script type="text/javascript" src="js/jquery.1.11.1.js"></script>
        <script type="text/javascript" src="js/bootstrap.js"></script>
      </body>
    </div>
  )
}

export default App
