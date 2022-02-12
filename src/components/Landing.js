import React, { Component } from 'react';
import Block from './Block';
import Search from './Search';

class Landing extends Component {
    render() {
        return (
            <section className="w-full px-3 antialiased bg-white dark:bg-gray-900 lg:px-6">
            <div className="mx-auto max-w-7xl">
                <div className="container py-16 mx-auto text-center sm:px-4 md:py-32">
                    
                    <h1 className="text-3xl font-extrabold leading-10 tracking-tight text-black dark:text-white sm:text-5xl sm:leading-none md:text-5xl xl:text-5xl"><span className="block">Pour un Twitter où l'on peut finir ses tweets par quoi.</span></h1>
                    <div className="max-w-xl mx-auto mt-6 text-sm text-center text-gray-500 dark:text-gray-200 md:mt-12 sm:text-base md:max-w-6xl md:text-md xl:text-md">J'ai codé un bot qui enregistre dans une base de données toutes les personnes faisant la blague du "feur" sur Twitter. Libre à toi d'explorer ces données sur ce site web et de vérifier si un de tes amis a un humour discutable...</div>

                    <Search/>
                
                </div>
            </div>
        </section>
        );
    }
}

export default Landing;