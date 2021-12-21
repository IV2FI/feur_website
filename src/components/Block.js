import React, { Component } from 'react';
import axios from 'axios'
import 'moment/locale/fr';
import { FaTwitter } from 'react-icons/fa';

class Block extends Component {

    state = {
        option: "mute",
        option2: "word",
        load: false,
        authenticated: false,
        usersLeft: null,
        error: null
    }

    componentDidMount() {
        if(window.location.href.includes("?option=unmute")){
            this.setState({option: "unmute"})
        }
        if(window.location.href.includes("?option=block")){
            this.setState({option: "block"})
        }if(window.location.href.includes("?option=unblock")){
            this.setState({option: "unblock"})
        }if(window.location.href.includes("&on=avg")){
            this.setState({option2: "avg"})
        }if(window.location.href.includes("&on=most")){
            this.setState({option2: "most"})
        }
        this.fetchIsTwitterSet()
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        axios.get("/api/login/twitter")
      }

    fetchIsTwitterSet(){
        axios.get("/api/twitter/isSession").then((res) => {
            this.setState({
                authenticated: res.data.result
            });
            if(res.data.result){
                this.fetchSessionUserHistory()
                this.interval = setInterval(() => this.fetchSessionUserHistory(), 30000);
            }
        })
    }

    fetchSessionUserHistory(){
        axios.get("/api/userBlockHistory")
          .then((res) => {
              if(res !== null && res.data !== null && res.data.length > 0){
                this.setState(
                {
                    usersLeft: res.data[0].remaining
                });
                if(res.data[0].ongoing === 1){
                    this.setState({load:true})
                }else{
                    this.setState({load:false})
                }
            }
          })
          .catch((error) => {
            console.log(error);
        });
    }

    changePercent(event) {
        this.setState({
            percent: event.target.value.replace('%','')+"%"
        })
    }

    addWordMutesOrUnmutes() {
        if(this.state.option === "mute" || this.state.option === "block"){
            axios.get("/api/addWordMute")
            .then((res) => {
                window.open("https://twitter.com/settings/add_muted_keyword", '_blank');
            })
        } else {
            axios.get("/api/addWordUnMute")
            .then((res) => {
                window.open("https://twitter.com/settings/add_muted_keyword", '_blank');
            })
        }
    }

    changeOption(event) {
        this.setState({
            option: event.target.value
        });
    }

    changeOption2(event) {
        this.setState({
            option2: event.target.value
        });
    }

    performAction(){
        if(this.state.option2 !== "word"){
            axios.get("/api/feurme-la?on="+this.state.option2+"&action="+this.state.option)
            .then((res) => {
                if(res.data.error){
                    this.setState({load:false, error:res.data.error})
                }else{
                    this.setState({
                        load:true,
                        usersLeft: res.data.usersLeft,
                        error: null
                    }) 
                }
                
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }

    render() {
        return (
            <div className="max-w-2xl mx-auto mt-12">
                <span className="font-extrabold leading-10 tracking-tight text-black dark:text-white sm:text-xl sm:leading-none md:text-xl xl:text-xl">Je veux</span>
                <div className="inline">
                    <select onChange={(event) => this.changeOption(event)} value={this.state.option} className="sm:text-xl sm:leading-none md:text-xl xl:text-xl mr-2 ml-2 rounded-none tracking-wide hover:cursor-pointer text-center border-b-2 border-red-500 hover:border-red-60 py-2 inline-flex items-center bg-transparent font-extrabold text-black dark:text-white focus:outline-none">
                        <option value="mute">masquer</option>
                        <option value="unmute">démasquer</option>
                        <option value="block">bloquer</option>
                        <option value="unblock">débloquer</option>
                    </select>
                </div>

                <div className="inline">
                    <select onChange={(event) => this.changeOption2(event)} value={this.state.option2} className="sm:text-xl sm:leading-none md:text-xl xl:text-xl inline-flex mr-2 ml-2 rounded-none tracking-wide hover:cursor-pointer text-center border-b-2 border-red-500 hover:border-red-60 py-2 items-center bg-transparent font-extrabold text-black dark:text-white focus:outline-none">
                        <option value="word">le mot feur de mon Twitter !</option>
                        <option value="avg">les plus forceurs avec cette blague</option>
                        <option value="most">le top 1% des plus forceurs</option>
                    </select>
                </div>

                <div></div>
                {/*<span className="font-extrabold leading-10 tracking-tight text-black dark:text-white sm:text-xl sm:leading-none md:text-xl xl:text-xl"> les </span>
                <input onChange={(event) => this.changePercent(event)} type="text" name="percent" placeholder="" className="mr-2 ml-2 rounded-none w-20 tracking-wide text-center border-b-2 border-red-500 hover:border-red-60 shadow-md py-2 inline-flex items-center bg-transparent font-bold text-red-500 dark:text-red-200 focus:outline-none" value={(this.state.percent)}></input>
                <span className="font-extrabold leading-10 tracking-tight text-black dark:text-white sm:text-xl sm:leading-none md:text-xl xl:text-xl">les plus forceurs avec cette blague</span>*/}
                {this.state.option2 === "word" ? 
                <button className="inline bg-red-500 hover:bg-red-900 shadow-md text-white font-bold py-2 px-4 rounded mt-5" onClick={() => this.addWordMutesOrUnmutes()}>
                    Go !
                </button> : 
                !this.state.load ? !this.state.authenticated ? 
                <button className="inline bg-sky-500 hover:bg-sky-700 shadow-md text-white font-bold py-2 px-4 rounded mt-5">
                <a
                id="tweet-connect"
                className="flex items-center justify-center py-1 px-2 mt-25"
                href={"/api/login/twitter?option="+this.state.option+"&on="+this.state.option2}
                ><FaTwitter/>&nbsp; Se connecter pour le faire</a>
                </button>
                : !this.state.error ? 
                <button className="inline bg-red-500 hover:bg-red-900 shadow-md text-white font-bold py-2 px-4 rounded mt-5" onClick={() => this.performAction(this)}>
                    Go !
                </button> 
                :
                <><button className="inline bg-red-500 hover:bg-red-900 shadow-md text-white font-bold py-2 px-4 rounded mt-5" onClick={() => this.performAction(this)}>
                    Go !
                </button> 
                <p className="mt-5 font-bold leading-10 tracking-tight text-red-800 dark:text-red-400 sm:text-md sm:leading-none md:text-md xl:text-md">{this.state.error}</p></>
                :
                <div>
                <div className="bg-slate-200 dark:bg-slate-800 py-4 px-5 rounded-lg flex items-center flex-col shadow-xl w-44 mx-auto mt-10">
                    <div className="loader-dots block relative w-20 h-5 mt-2">
                    <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="dark:text-gray-200 text-xs font-light mt-2 text-center">
                    Traitement en cours
                    </div>
                </div>

                <p className="mt-5 font-bold leading-10 tracking-tight text-green-800 dark:text-green-400 sm:text-md sm:leading-none md:text-md xl:text-md">Tu as une demande en cours ! Il reste encore {this.state.usersLeft} utilisateurs à traiter pour toi. Pas la peine de rester sur le site pour que ça se fasse ! Fin estimée : {(this.state.usersLeft/50) > 1 ? Math.floor(this.state.usersLeft/50)*15 + " minutes" : "d'ici 15 minutes"}</p>

                </div>
              }
            </div>
            
                      
        );
    }
}

export default Block;
