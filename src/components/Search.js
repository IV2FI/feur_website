import React, { Component } from 'react';
import axios from 'axios'
import Moment from 'react-moment';
import Emoji from './Emoji';
import { FaTwitter, FaDownload } from 'react-icons/fa';
import { Timeline, Tweet } from 'react-twitter-widgets'
import html2canvas from 'html2canvas';

class Search extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
          search: "",
          user: null
        }
        this.timeout = null;
    }

    handleSearch = (event) => {
        if(this.timeout) clearTimeout(this.timeout);
        this.setState({
          search: event.target.value
        })
        this.timeout = setTimeout(function(){
                         this.getUser()
                       }.bind(this),300);
    }

    getUser = () => {
        if(this.state.search === ""){
            this.setState(
                {
                    user: null
                }
            );
        } else {
            axios.get("/api/user?username="+this.state.search.replace('@', ''))
            .then((res) => {
                this.setState(
                    {
                        user: res.data
                    }
                );
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }

    saveAs = (canvas) => {
        var a = document.createElement('a');
        // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
        a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        a.download = 'feur.png';
        a.click();
    }

    exportAsPicture = () => {

        html2canvas(document.querySelector("#to-share"), {useCORS: true}).then(canvas => {
            this.saveAs(canvas)
        });
    
      }

    render() {
        return (
            <>
            <div className="relative shadow-md flex items-center max-w-xl mx-auto mt-12 overflow-hidden text-center rounded-full">
                <input onChange={(event) => this.handleSearch(event)} value={this.state.search} type="text" name="twitter_handle" placeholder="Vérifier si un identifiant Twitter a un humour douteux" className="w-full h-12 px-6 py-2 placeholder-gray-500 dark:placeholder-grey-500 text-white dark:text-black dark:bg-white bg-gray-900 font-medium focus:outline-none"></input>
            </div>

            {this.state.user !== null && (this.state.user.nb_sent > 0 || this.state.user.nb_received > 0)? 
            <>
            <div className="mx-auto max-w-sm mt-12 bg-slate-200 dark:bg-slate-800 rounded-lg shadow-lg" id="to-share">
                <div className="flex flex-col items-center justify-center pt-10 pb-10">
                    <img className="w-24 h-24 mb-2 rounded-full border-2 border-black" src={this.state.user.profile_picture.replace("_normal", "")} alt={"profile-picture-"+this.state.user.username}/>
                    <h2 className="text-lg font-medium text-black dark:text-white">{this.state.user.name}</h2>
                    <p className="text-gray-700 dark:text-gray-400">@{this.state.user.username}</p>
                    {this.state.user.nb_sent > 0 ? 
                    <p className="mx-auto mt-3 text-sm text-center text-red-700 dark:text-red-400 sm:text-base md:text-md xl:text-md"><b>A déjà fait la blague du "feur"</b></p>
                    : 
                    <p className="mx-auto mt-3 text-sm text-center text-green-700 dark:text-green-400 sm:text-base md:text-md xl:text-md">N'a pas fait la blague du "feur"</p>
                }
                    <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-200">Depuis fin janvier 2022 :</p>
                    <div className="flex flex-wrap mt-2 mb-4">

                        <div className="w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
                            <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-200"><span className="mr-1"><Emoji symbol="💈"/></span> {this.state.user.nb_sent} blague{this.state.user.nb_sent > 1 ? "s" : ""} faite{this.state.user.nb_sent > 1 ? "s" : ""}</p>
                        </div>

                        <div className="w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
                            <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-200"><span className="mr-1"><Emoji symbol="😒"/></span> {this.state.user.nb_received} blague{this.state.user.nb_received > 1 ? "s" : ""} reçue{this.state.user.nb_received > 1 ? "s" : ""}</p>
                        </div>

                        <div className="w-1/2 osm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
                            <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-200"><span className="mr-1"><Emoji symbol="🏅"/></span> {this.state.user.rank} / {this.state.user.total_trolls}</p>
                        </div>

                        <div className="w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
                            <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-200"><span className="mr-1"><Emoji symbol="🏅"/></span> {this.state.user.rank_victim} / {this.state.user.total_victims}</p>
                        </div>

                    </div>  
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-500">https://feurtracker.fr</p>
                    </div>  
            </div>
            <div className="items-center justify-center">

            {this.state.user.nb_sent > 0 ?
                        <div className="items-center justify-center mx-auto flex flex-col max-w-2xl">
                        <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-200">Dernier feur :</p>

                        <div className="twitter-center w-full">
                        <Tweet
                        tweetId={this.state.user.last_tweet_id} options={{ align: "center" }} 
                        /></div>
                        </div>

                    :

                    <></>}   

            <button className="inline bg-green-700 hover:bg-green-900 shadow-md text-white font-bold py-2 px-4 rounded mt-5" onClick={() => this.exportAsPicture()}>
               <a className="flex items-center justify-center py-1 px-2 mt-25"><FaDownload/>&nbsp; Télécharger le récap'</a>
            </button>                               
            </div>
            </>
            
            : this.state.user !== null && this.state.user.length === 0 ? 
            <div>
                <p className="mx-auto mt-6 text-sm text-center text-green-700 dark:text-green-400 sm:text-base md:text-md xl:text-md">Cet utilisateur n'a <b>jamais</b> fait la blague du "feur" (au moins depuis fin janvier 2022) ! <Emoji symbol="👏"/></p>
                <button className="inline bg-sky-500 hover:bg-sky-700 shadow-md text-white font-bold py-2 px-4 rounded mt-5" onClick={() => this.performAction(this)}>
                <a
                id="tweet-quote"
                className="flex items-center justify-center py-1 px-2 mt-25"
                target="_blank"
                rel="noreferrer"
                href={"http://twitter.com/share?text=Hey @" + this.state.search + " ! Tu n'as jamais fait la blague du feur sur Twitter depuis fin janvier 2022... Merci d'être une bonne personne !&url=https://feurtracker.fr"}
                ><FaTwitter/>&nbsp; Le féliciter</a>
                </button>
            </div>
            : <></>}
            </>
        );
    }
}

export default Search;