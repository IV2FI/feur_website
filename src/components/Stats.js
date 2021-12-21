import React, { Component } from 'react';
import axios from 'axios'
import img from '../resources/stat.png';

class Stats extends Component {

    state = {
        users: "0",
        feurs: "0",
        masks: "0",
        blocks: "0",
        unmasks: "0",
        unblocks: "0",
        wordMutes: "0",
        wordUnmutes: "0",
        totalFeursPerHour: "0",
        maxFeursForAUser: "0",
        maxFeursPerHour: "0",
        startDate:"2021/12/21 00:49:48"
    };

    componentDidMount() {
        this.fetchStats()
    }

    fetchStats = () => {
        var now = Date.now()
        var beginning = Date.parse(this.state.startDate)
        var hoursPassed = Math.abs(beginning - now) / 36e5
        axios.get("/api/getTotalFeurs")
          .then((res) => {
              this.setState(
              {
                feurs: res.data.total,
                totalFeursPerHour: Math.floor(res.data.total / hoursPassed),
              }
            );
          })
          .catch((error) => {
            console.log(error);
          });
        axios.get("/api/getMaxFeurs")
        .then((res) => {
            this.setState(
            {
                maxFeursForAUser: res.data.feurs,
                maxFeursPerHour: Math.floor(res.data.feurs / hoursPassed)
            }
        );
        })
        .catch((error) => {
        console.log(error);
        });
        axios.get("/api/getCount")
        .then((res) => {
            this.setState(
            {
                users: res.data.count
            }
        );
        }).catch((error) => {
            console.log(error);
            });
        axios.get("/api/numberOfMasks")
        .then((res) => {
            this.setState(
            {
                masks: res.data.total
            }
        );
        })
        .catch((error) => {
        console.log(error);
        });
        axios.get("/api/numberOfUnMasks")
        .then((res) => {
            this.setState(
            {
                unmasks: res.data.total
            }
        );
        })
        .catch((error) => {
        console.log(error);
        });
        axios.get("/api/numberOfBlocks")
        .then((res) => {
            this.setState(
            {
                blocks: res.data.total
            }
        );
        })
        .catch((error) => {
        console.log(error);
        });
        axios.get("/api/numberOfUnBlocks")
        .then((res) => {
            this.setState(
            {
                unblocks: res.data.total
            }
        );
        })
        .catch((error) => {
        console.log(error);
        });

        axios.get("/api/getTotalWordMutes")
        .then((res) => {
            this.setState(
            {
                wordMutes: res.data.total
            }
        );
        })
        .catch((error) => {
        console.log(error);
        });

        axios.get("/api/getTotalWordUnMutes")
        .then((res) => {
            this.setState(
            {
                wordUnmutes: res.data.total
            }
        );
        })
        .catch((error) => {
        console.log(error);
        });
    }


    render() {
        return (
            <section className="w-full bg-slate-200 dark:bg-slate-800 pt-7 pb-7 md:pt-20 md:pb-24">            
                <div className="box-border flex flex-col items-center content-center px-8 mx-auto leading-6 text-black border-0 border-gray-300 border-solid md:flex-row max-w-7xl lg:px-16">

                <div className="box-border relative w-full max-w-md px-4 mt-5 mb-4 -ml-5 text-center bg-no-repeat bg-contain border-solid md:ml-0 md:mt-0 md:max-w-none lg:mb-0 md:w-1/2 xl:pl-10">
                    <img src={img} className="p-2 pl-6 pr-5 xl:pl-16 xl:pr-20" alt="stats"/>
                </div>

                <div className="box-border order-first w-full text-black dark:text-white border-solid md:w-1/2 md:pl-10 md:order-none ">
                    <h2 className="m-0 text-xl font-semibold leading-tight border-0 border-gray-300 lg:text-3xl md:text-2xl t-2 pb-4">
                        Quelques statistiques
                    </h2>
                    <p className="text-grey-300 border-0 border-gray-300 sm:pr-10 lg:text-lg font-bold">
                        Depuis le 21 décembre 2021 :
                    </p>
                    <ul className="p-0 m-0 leading-6 border-0 border-gray-300">
                        <li className="box-border relative py-1 pl-0 text-left text-gray-800 dark:text-gray-200 border-solid">
                            - <b>{this.state.users} twittos</b> ont fait la blague du "feur"
                        </li>
                        <li className="box-border relative py-1 pl-0 text-left text-gray-800 dark:text-gray-200 border-solid">
                            - En tout, la blague a été faite <b>{this.state.feurs} fois</b>, soit <b>{this.state.totalFeursPerHour} fois par heure</b>
                        </li>
                        <li className="box-border relative py-1 pl-0 text-left text-gray-800 dark:text-gray-200 border-solid">
                            - Un twittos a fait la blague <b>{this.state.maxFeursForAUser} fois</b>, ce qui revient à <b>{this.state.maxFeursPerHour} fois par heure</b>
                        </li>
                        <li className="box-border relative py-1 pl-0 text-left text-gray-800 dark:text-gray-200 border-solid">
                            - <b>{this.state.blocks} personnes</b> ont utilisé ce site pour bloquer des twittos
                        </li>
                        <li className="box-border relative py-1 pl-0 text-left text-gray-800 dark:text-gray-200 border-solid">
                            - <b>{this.state.masks} personnes</b> ont utilisé ce site pour masquer des twittos
                        </li>
                        <li className="box-border relative py-1 pl-0 text-left text-gray-800 dark:text-gray-200 border-solid">
                            - <b>{this.state.wordMutes} personnes</b> ont utilisé ce site pour masquer le mot "feur"
                        </li>
                    </ul>
                    </div>
                </div>
            </section>
        );
    }
}

export default Stats;
