import React, { Component } from 'react';
import axios from 'axios'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Moment from 'react-moment';
import 'moment/locale/fr';

const toPercent = (decimal, fixed = 0) => `${Math.floor((decimal * 100).toFixed(fixed)) }%`;

const getPercent = (value, total) => {
  const ratio = total > 0 ? value / total : 0;

  return toPercent(ratio, 2);
};

const renderTooltipContent = (o) => {
    const { payload, label } = o;
    const total = payload.reduce((result, entry) => result + entry.value, 0);
  
    return (
      <div className="customized-tooltip-content">
        <p className="total">{`${label} (Total : ${total})`}</p>
        <ul className="list">
          {payload.map((entry, index) => (
            <li key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name} : ${entry.value}(${getPercent(entry.value, total)})`}
            </li>
          ))}
        </ul>
      </div>
    );
  };

class Stats extends Component {

    state = {
        startDate:"2022-01-26T00:03:23",
        stats: null,
        hourlyStat: null,
        data: null,
        update: null,
        totalTweets: null,
        maxTroll: null,
        maxVictim: null,
        nbTrolls: null,
        hoursPassed: null
    };

    componentDidMount() {
        this.fetchStats()
    }

    fetchStats = () => {
        var now = Date.now()
        var beginning = Date.parse(this.state.startDate)
        var hoursPassed = Math.abs(beginning - now) / 36e5
        this.setState({
            hoursPassed: hoursPassed
        })
        axios.get("/api/latestUpdate")
        .then((res) => {
            this.setState({
                update: res.data.created_at
            })
        })

        axios.get("/api/tweet/total")
        .then((res) => {
            this.setState({
                totalTweets: res.data.total
            })
        })
        axios.get("/api/stats/hourly")
        .then((res) => {
            this.prepareHourlyData(res.data)
        })
        axios.get("/api/troll/max")
        .then((res) => {
            this.setState({
                maxTroll: res.data
            })
        })
        axios.get("/api/victim/max")
        .then((res) => {
            this.setState({
                maxVictim: res.data
            })
        })

        axios.get("/api/troll/total")
        .then((res) => {
            this.setState({
                nbTrolls: res.data.trolls
            })
        })
        axios.get("/api/stats")
          .then((res) => {
              this.setState(
              {
                stats: res.data
              }
            );
            this.prepareData(res.data)
          })
          .catch((error) => {
            console.log(error);
          });
    }

    prepareHourlyData = (stats) => {
        var data = JSON.parse(JSON.stringify(stats))
        for(var i=0 ; i<data.length ; i++){
            data[i]["axis"] = data[i]["Day"] +  "/" + data[i]["Month"] + " " + data[i]["Hour"] + "H"
        }
        this.setState(
            {
                hourlyStat: data
        });
    }

    prepareData = (stats) => {
        var data = JSON.parse(JSON.stringify(stats))
        var day;
        var total_tweets =0
        var max_troll = 0
        var max_victim = 0
        var nb_trolls = 0
        for(var i=0 ; i<data.length ; i++){
            day = new Date(data[i]["day"])
            data[i]["day"] = day.getDate() + "/" + (day.getMonth() + 1)
        }
        this.setState(
        {
            data: data
        }
        );

    }


    render() {
        return (
            
            <section className="w-full bg-slate-200 dark:bg-slate-800 pt-7 pb-7 md:pt-20 md:pb-24">            

                    <h2 className="m-0 text-xl mx-auto text-center font-semibold leading-tight border-0 text-black dark:text-white border-gray-300 lg:text-3xl md:text-2xl t-2">
                        Statistiques depuis fin janvier 2022
                    </h2>

                    <p className="text-sm mx-auto text-center leading-tight border-0 text-black dark:text-gray-400 border-gray-300 pb-4 mt-4">Dernière mise à jour <Moment fromNow locale="fr">{this.state.update}</Moment></p>

                {this.state.data == null || this.state.totalTweets == null || this.state.nbTrolls == null || this.state.maxTroll == null || this.state.maxVictim == null || this.state.hoursPassed == null ? <></> : 
                <>

                <div id="wrapper" className="max-w-7xl px-4 py-4 mx-auto">
                    <div className="sm:grid sm:h-32 sm:grid-flow-row sm:gap-4 sm:grid-cols-4">
                        <div id="jh-stats-positive" className="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded">
                            <div>
                                
                                <p className="text-3xl font-semibold text-center text-gray-800">{this.state.totalTweets}</p>
                                <p className="text-lg text-center text-gray-500">Blagues tweetées</p>
                                <p className="text-xs text-center text-gray-500">Soit {Math.floor(this.state.totalTweets / this.state.hoursPassed)}/heure</p>
                            </div>
                        </div>
            
                        <div id="jh-stats-negative" className="flex flex-col justify-center px-4 py-4 mt-4 bg-white border border-gray-300 rounded sm:mt-0">
                            <div>
                                
                                <p className="text-3xl font-semibold text-center text-gray-800">{this.state.nbTrolls}</p>
                                <p className="text-lg text-center text-gray-500">Nombre de trolls</p>
                                <p className="text-xs text-center text-gray-500">Quelle indignité !</p>
                            </div>
                        </div>

                        <div id="jh-stats-neutral" className="flex flex-col justify-center px-4 py-4 mt-4 bg-white border border-gray-300 rounded sm:mt-0">
                            <div>
                                
                                <p className="text-3xl font-semibold text-center text-gray-800">{this.state.maxTroll.nb_sent}</p>
                                <p className="text-lg text-center text-gray-500">Record individuel</p>
                                <p className="text-xs text-center text-gray-500">de blagues tweetées, soit {Math.floor(this.state.maxTroll.nb_sent / this.state.hoursPassed)}/heure</p>
                            </div>
                        </div>

                        <div id="jh-stats-neutral" className="flex flex-col justify-center px-4 py-4 mt-4 bg-white border border-gray-300 rounded sm:mt-0">
                            <div>
                                
                                <p className="text-3xl font-semibold text-center text-gray-800">{this.state.maxVictim.nb_received}</p>
                                <p className="text-lg text-center text-gray-500">Record individuel</p>
                                <p className="text-xs text-center text-gray-500">de blagues reçues, soit {Math.floor(this.state.maxVictim.nb_received / this.state.hoursPassed)}/heure</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sm:w-full md:w-8/12 justify-center items-center mx-auto mt-10" id="chart-tweets">
                    <h3 className="m-0 mb-2 text-md mx-auto text-center font-semibold leading-tight border-0 text-black dark:text-white border-gray-300 lg:text-xl md:text-xl t-2">
                        Nombre de blagues ces dernières 24h
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                    width={500}
                    height={300}
                    data={this.state.hourlyStat}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" stroke="#484848"/>
                    <XAxis dataKey="axis" stroke="#ffffff"/>
                    <YAxis stroke="#ffffff"/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" name="tweets du 'feur'" dataKey="Count" stackId="2" stroke="#8884d8" fill="#8884d8" />
                    </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="sm:w-full md:w-8/12 justify-center items-center mx-auto mt-10" id="chart-tweets">
                    <h3 className="m-0 mb-2 text-md mx-auto text-center font-semibold leading-tight border-0 text-black dark:text-white border-gray-300 lg:text-xl md:text-xl t-2">
                        Nombre de blagues par jour
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                    <AreaChart
                    width={500}
                    height={300}
                    data={this.state.data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" stroke="#484848"/>
                    <XAxis dataKey="day" stroke="#ffffff"/>
                    <YAxis stroke="#ffffff"/>
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" name="tous les tweets 'feur'" dataKey="nb_tweets" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" name="tweets faits par des bots" dataKey="nb_bot_tweets" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="sm:w-full md:w-8/12 justify-center items-center mx-auto mt-10" id="chart-tweets">
                    <h3 className="m-0 mb-2 text-md mx-auto text-center font-semibold leading-tight border-0 text-black dark:text-white border-gray-300 lg:text-xl md:text-xl t-2">
                        Nombre de trolls et victimes par jour
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                    width={500}
                    height={300}
                    data={this.state.data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" stroke="#484848"/>
                    <XAxis dataKey="day" stroke="#ffffff"/>
                    <YAxis stroke="#ffffff"/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" name="trolls" dataKey="nb_trolls" stackId="1" stroke="#e60000" fill="#e60000" />
                    <Line type="monotone" name="victimes" dataKey="nb_victims" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                    </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="sm:w-full md:w-8/12 justify-center items-center mx-auto mt-10" id="chart-tweets">
                    <h3 className="m-0 mb-2 text-md mx-auto text-center font-semibold leading-tight border-0 text-black dark:text-white border-gray-300 lg:text-xl md:text-xl t-2">
                        Appareils utilisées par les trolls
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart
                        width={500}
                        height={400}
                        data={this.state.data}
                        stackOffset="expand"
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" stroke="#484848"/>
                        <XAxis dataKey="day" stroke="#ffffff"/>
                        <YAxis tickFormatter={toPercent} stroke="#ffffff"/>
                        <Tooltip content={renderTooltipContent} />
                        <Legend />
                        <Area type="monotone" name="iPhone" dataKey="nb_iphone" stackId="1" stroke="#ffffff" fill="#ffffff" />
                        <Area type="monotone" name="android" dataKey="nb_android" stackId="1" stroke="#99ff66" fill="#99ff66" />
                        <Area type="monotone" name="ordinateur" dataKey="nb_computer" stackId="1" stroke="#ffc658" fill="#ffc658" />
                        <Area type="monotone" name="iPad" dataKey="nb_ipad" stackId="1" stroke="#3399ff" fill="#3399ff" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                </>
                }

            </section>
        );
    }
}

export default Stats;
/*

<div>
                                    <p className="flex items-center justify-end text-green-500 text-md">
                                        <span className="font-bold">6%</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path className="heroicon-ui" d="M20 15a1 1 0 002 0V7a1 1 0 00-1-1h-8a1 1 0 000 2h5.59L13 13.59l-3.3-3.3a1 1 0 00-1.4 0l-6 6a1 1 0 001.4 1.42L9 12.4l3.3 3.3a1 1 0 001.4 0L20 9.4V15z"/></svg>
                                    </p>
                                </div>


                                <div>
                                    <p className="flex items-center justify-end text-red-500 text-md">
                                        <span className="font-bold">6%</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path className="heroicon-ui" d="M20 9a1 1 0 012 0v8a1 1 0 01-1 1h-8a1 1 0 010-2h5.59L13 10.41l-3.3 3.3a1 1 0 01-1.4 0l-6-6a1 1 0 011.4-1.42L9 11.6l3.3-3.3a1 1 0 011.4 0l6.3 6.3V9z"/></svg>
                                    </p>
                                </div>

                                <div>
                                    <p className="flex items-center justify-end text-gray-500 text-md">
                                        <span className="font-bold">0%</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path className="heroicon-ui" d="M17 11a1 1 0 010 2H7a1 1 0 010-2h10z"/></svg>
                                    </p>
                                </div>

*/