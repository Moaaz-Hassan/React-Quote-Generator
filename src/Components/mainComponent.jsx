import React, { useEffect, useState } from 'react'
import { requestRandomQuote } from '../Services/requestApi'
import { addToFavorites, isItFavourite, getFavouritesFromStorage, removeFromFavourite } from '../Services/dealWithFavourites'

function MainComponent() {
  
    // Controls opening/closing the favourites modal
    const [openFavourite , setOpenFavourite] = useState(false)

    // Stores all favourite quotes and keeps the UI in sync with localStorage updates

    const [Favourites , setFavourites] = useState(getFavouritesFromStorage())

    // Stores the currently displayed quote
    const [currentQuote , setCurrentQuote] = useState (null) ;

    // Stack of quotes shown in the current session (used for navigation)
    const [SessionQuotesStake , setSessionQuotesStake] = useState([]) ;

    

    async function getNextQuote(){
        // Reset current quote to show loading spinner
        setCurrentQuote(null) ;
        // Fetch a random quote from API
        const data = await requestRandomQuote() ;
        setCurrentQuote(data) ;
        // Push the quote into session stack
        setSessionQuotesStake(prev => [...prev, data]);
 
    }

    function getPreviousQuote(){
        
        // Only navigate back if there is more than one quote in the stack
        if(SessionQuotesStake.length > 1){
            setCurrentQuote(null) ;

            // Get the previous quote from the stack
            const data = SessionQuotesStake[SessionQuotesStake.length - 2];
            setCurrentQuote(data) ;
            let newStack = [...SessionQuotesStake]
            
            // Remove the last quote from the stack
            newStack.pop()
            setSessionQuotesStake(newStack) 
        }
        

        
    }

    function shareQuote(quote, author) {
        
        // Use Web Share API if supported
        if (navigator.share) {
            navigator.share({
                title: "Quote",
                text: `"${quote}" — ${author}`,
        })
        .catch(err => console.log("Share cancelled", err));
        } else {
            alert("Sharing not supported on this browser");
        }
    }

    
    // Initial Fetch on Component Mount
    useEffect(()=>{
        getNextQuote()

    } , [])
  
    return (
    <div className='h-[100vh]  bg-linear-to-r from-fuchsia-300 to-blue-200 flex items-center justify-center '>
        <div className=' w-[90%] md:w-[70%] aspect-2/3 md:aspect-3/2 bg-linear-to-r from-neutral-800 to-neutral-700 rounded-4xl  box-shadow p-7 relative overflow-hidden'>
            
            <div className=' flex items-center justify-between'>
                <h2 className='big-font'>Quote.</h2> 
                
                {/* onClick Open favourites modal */}
                <i className = "fa-solid fa-heart text-[35px] md:text-[40px] text-fuchsia-400 cursor-pointer  active:animate-ping" 
                onClick={()=> setOpenFavourite(true)}>   
                </i>
            </div> 
            <div>
                <i className ={`fa-solid fa-angle-left text-[35px]  ${SessionQuotesStake.length <= 1 ? "text-gray-600" : "text-white cursor-pointer active:animate-ping"}   absolute top-[50%] -translate-y-[50%] left-2`} onClick={getPreviousQuote}></i>
                <i className = "fa-solid fa-angle-right text-[35px] text-white cursor-pointer active:animate-ping absolute top-[50%] -translate-y-[50%] right-2" onClick={getNextQuote}></i>
            </div>
            <div className=' absolute top-[50%] left-[50%] -translate-x-[50%]  -translate-y-[50%] w-[60%] ' >
                {/* if current Qoute loaded display the card */}
                {currentQuote ?
                <>
                <i className = "fa-solid fa-quote-left text-[30px] text-white "></i>
                <h2 className='quote text-center pt-4'>{currentQuote.quote}</h2>
                <h2 className='author text-right pt-4 text-stone-400'>{currentQuote.author}</h2>
                <i className = "fa-solid fa-quote-right text-[30px] text-white text-right w-full absolute right-0 pt-4"></i>
                {/* else Loading spinner while fetching quote */}
                </>:
                <div className='animate-spin w-15 h-15 border-8 border-indigo-400 border-l-fuchsia-600 rounded-full m-auto'></div>}
            </div>
            <div className='  absolute bottom-7 flex gap-7 left-[50%] -translate-x-[50%]'>
                <div className='flex gap-1 items-center cursor-pointer ' onClick={()=>setFavourites(addToFavorites(currentQuote))}><i className ={`fa-solid fa-heart text-[25px] ${isItFavourite(currentQuote) ?"text-fuchsia-400" : "text-white"} `} ></i> <h3 className='author text-white'>Add</h3></div>
                <div className='flex gap-1 items-center cursor-pointer' onClick={() => shareQuote(currentQuote.quote, currentQuote.author)}><i className = "fa-solid fa-share-from-square text-[25px] text-white"></i> <h3 className='author text-white' >Share</h3></div>
            </div>
            
            {/* open Favourites modal if the state is true */}
            {openFavourite ?  
            <div className=' absolute top-0 left-0 right-0 left-0 bg-linear-to-r from-cyan-900 to-cyan-700 w-full h-full p-7 overflow-y-auto'>
                
                {/* onClick this icone Close modal */}
                <i className = "fa-solid fa-xmark absolute top-7 right-7 text-white text-[30px] cursor-pointer active:animate-ping " 
                onClick={()=> setOpenFavourite(false)}>
                </i>

                <div className='w-[85%]'>
                    {Favourites.map((quot , index)=>
                        <div key={index} className='mb-7'>
                            <div className='flex gap-2 '>
                                <i className = "fa-solid fa-xmark cursor-pointer text-red-500 text-[20px] translate-y-1" onClick={()=>setFavourites(removeFromFavourite(quot))}></i>
                                <h2 className='author text-neutral-300'>{quot.quote}</h2>
                            </div>
                            <p className='text-right text-neutral-300 text-sm'>{quot.author}</p>
                        </div>
                    )}
                </div>
            </div>
            : ""}
        </div>   
    </div>
  )
}



export default MainComponent

