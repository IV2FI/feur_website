import React, { Component } from 'react';
import axios from 'axios'
import Moment from 'react-moment';
import Emoji from './Emoji';
import { FaTwitter } from 'react-icons/fa';
import 'moment/locale/fr';

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
            axios.get("/api/getUser?username="+this.state.search.replace('@', ''))
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

    render() {
        return (
            <>
            <div className="relative shadow-md flex items-center max-w-xl mx-auto mt-12 overflow-hidden text-center rounded-full">
                <input onChange={(event) => this.handleSearch(event)} value={this.state.search} type="text" name="twitter_handle" placeholder="Vérifier si un identifiant Twitter a un humour douteux" className="w-full h-12 px-6 py-2 placeholder-gray-500 dark:placeholder-grey-500 text-white dark:text-black dark:bg-white bg-gray-900 font-medium focus:outline-none"></input>
            </div>
            {this.state.user !== null && this.state.user.length > 0 ? 
            <div>
                <p className="mx-auto mt-6 text-sm text-center text-red-700 dark:text-red-400 sm:text-base md:text-md xl:text-md">Cet utilisateur a fait la blague du "feur" <b>{this.state.user[0].feurs} fois</b> depuis le 21 décembre 2021 ! La dernière fois était <b><Moment fromNow>{this.state.user[0].updated_at}</Moment></b> <Emoji symbol="👎"/></p>
                <button className="inline bg-sky-500 hover:bg-sky-700 shadow-md text-white font-bold py-2 px-4 rounded mt-5" onClick={() => this.performAction(this)}>
                <a
                id="tweet-quote"
                className="flex items-center justify-center py-1 px-2 mt-25"
                target="_blank"
                rel="noreferrer"
                href={"http://twitter.com/share?text=Hey @" + this.state.search + " ! T'as fait " + this.state.user[0].feurs + " fois la blague du feur depuis le 21 décembre 2021. Sois digne, et arrête.&url=https://feurmons-leurs-gueules.net"}
                ><FaTwitter/>&nbsp; Le réprimander</a>
                </button>
            </div> 
            : this.state.user !== null && this.state.user.length === 0 ? 
            <div>
                <p className="mx-auto mt-6 text-sm text-center text-green-700 dark:text-green-400 sm:text-base md:text-md xl:text-md">Cet utilisateur n'a <b>jamais</b> fait la blague du "feur" (au moins depuis le 21 décembre 2021) ! <Emoji symbol="👏"/></p>
                <button className="inline bg-sky-500 hover:bg-sky-700 shadow-md text-white font-bold py-2 px-4 rounded mt-5" onClick={() => this.performAction(this)}>
                <a
                id="tweet-quote"
                className="flex items-center justify-center py-1 px-2 mt-25"
                target="_blank"
                rel="noreferrer"
                href={"http://twitter.com/share?text=Hey @" + this.state.search + " ! Tu n'as jamais fait la blague du feur sur Twitter depuis au moins le 21 décembre 2021... Merci d'être une bonne personne !&url=https://feurmons-leurs-gueules.net"}
                ><FaTwitter/>&nbsp; Le féliciter</a>
                </button>
            </div>
            : <></>}
            </>
        );
    }
}

export default Search;