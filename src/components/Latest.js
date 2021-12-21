import React, { Component } from 'react';
import axios from 'axios'
import Moment from 'react-moment';

class Latest extends Component {

    state = {
        latestUsers:[]
    };

    componentDidMount() {
        this.fetchLatestUsers()
    }

    fetchLatestUsers(){
        axios.get("/api/getLastUsers?limit=6")
          .then((res) => {
              this.setState(
              {
                latestUsers: res.data.result
              }
            );
          })
          .catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <section className="flex items-center justify-center bg-white dark:bg-gray-900 min-w-screen pt-7 pb-7 md:pt-20 md:pb-24">
                <div className="px-16 bg-white dark:bg-gray-900">
                    <div className="container flex flex-col items-start mx-auto lg:items-center">
            
                        <h2 className="m-0 text-xl font-semibold leading-tight border-0 text-black dark:text-white border-gray-300 lg:text-3xl md:text-2xl t-2 pb-4">
                            Les derniers twittos qui ont fait la blague
                        </h2>
            
                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 pt-16">
                        
                        {this.state.latestUsers.map((user, index) =>
                            <div key={index} className="w-full bg-slate-200 dark:bg-slate-800 rounded-lg shadow-lg">
                                <div className="flex flex-col items-center justify-center p-10">
                                    <img className="w-12 h-12 mb-6 rounded-full border-2 border-black" src={user.image} alt={"profile-picture-"+user.name}/>
                                    <h2 className="text-lg font-medium text-black dark:text-white">{user.name}</h2>
                                    <p className="text-gray-700 dark:text-gray-400"><Moment locale="fr" fromNow>{user.updated_at}</Moment>
                                </p></div>
                            </div>
                        )}
                    </div>
                    </div>
                </div>
            </section>
                
        );
    }
}

export default Latest;