import React, { Component } from 'react';
import Block from './Block';
import Search from './Search';
import logo from '../resources/feurtracker.png'

class Landing extends Component {
    render() {
        return (
            <section className="w-full px-3 antialiased bg-white dark:bg-gray-900 lg:px-6">
            <div className="mx-auto max-w-7xl">
                <div className="container py-16 mx-auto text-center sm:px-4 md:py-32">
                    
                    <a href="/" className="cursor-pointer"><img src={logo} alt="logo" className="mx-auto sm:w-full lg:w-6/12 cursor-pointer"/></a>
                    <div className="max-w-xl mx-auto mt-6 text-sm text-center text-gray-500 dark:text-gray-200 md:mt-12 sm:text-base md:max-w-6xl md:text-md xl:text-md">J'ai codé un bot qui enregistre dans une base de données toutes les personnes faisant la blague du "feur" sur Twitter. Libre à toi d'explorer ces données sur ce site web et de vérifier si un de tes amis a un humour discutable...</div>
                    <div className="max-w-xl mx-auto mt-3 text-sm text-center text-gray-500 dark:text-red-400 md:mt-3 sm:text-base md:max-w-6xl md:text-md xl:text-md"><b><a target="_blank" href="https://youtube.com/user/IV2FI">Va voir sur ma chaîne YouTube comment j'ai codé tout ça !</a></b></div>
                    <Search/>
                
                </div>
            </div>
        </section>
        );
    }
}

export default Landing;