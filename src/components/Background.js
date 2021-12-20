import React from 'react';

const Background = ( { children } ) =>
{
    return (
       
        <div className="bg-white dark:bg-black transition-all">
            {children}
        </div>
    )
}

export default Background;