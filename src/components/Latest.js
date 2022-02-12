import React, { Component } from 'react';
import axios from 'axios'
import Moment from 'react-moment';
import { Timeline, Tweet } from 'react-twitter-widgets'

class Latest extends Component {

    state = {
        latest_tweets:[]
    };

    componentDidMount() {
        this.fetchLatestUsers()
    }

    fetchLatestUsers(){
        axios.get("/api/tweet/latest?limit=1")
          .then((res) => {
              this.setState(
              {
                latest_tweets: res.data.result
              }
            );
          })
          .catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <section className="items-center justify-center bg-white dark:bg-gray-900 min-w-screen pt-7 md:pt-20">
                <div className="px-16 bg-white dark:bg-gray-900">
            
                        <h2 className="m-0 text-xl mx-auto text-center font-semibold leading-tight border-0 text-black dark:text-white border-gray-300 lg:text-3xl md:text-2xl t-2 pb-4">
                            Dernière blague faite
                        </h2>

                        {this.state.latest_tweets.map((tweet, index) =>
                            <Tweet key={index}
                            tweetId={tweet.tweet_id} options={{ align: "center" }} 
                            />
                        )}
                    
                </div>
            </section>
                
        );
    }
}

export default Latest;