
// Retrieves all favourite quotes from localStorage
// Returns an empty array if no data is found
export function getFavouritesFromStorage() {
    return JSON.parse(localStorage.getItem("Favourites")) || [];
}


// Checks whether a given quote already exists in favourites
// Returns true if the quote is found, otherwise false
export function isItFavourite(quote){
    const Favourites = getFavouritesFromStorage() ;
    

    return Favourites.some(
        q => q.quote === quote?.quote && q.author === quote?.author
    );

}


// Adds a new quote to favourites
// Prevents duplicate quotes from being added
// Always returns the updated favourites array
export function addToFavorites(quote){
    const favourites = getFavouritesFromStorage();

    // If the quote already exists, return the current list
    if (isItFavourite(quote)) {
        return favourites;
    }

     // Add the new quote and save to localStorage
    const updated = [...favourites, quote];
    localStorage.setItem("Favourites", JSON.stringify(updated));
    return updated;
}




// Removes a specific quote from favourites
// Matches the quote by both text and author
// Returns the updated favourites array after removal

export function removeFromFavourite(quote){

    const Favourites = getFavouritesFromStorage() ;
    let WithOutTheDealetedQuot = Favourites.filter(q => q.quote != quote.quote || q.author != quote.author) ;
    window.localStorage.setItem("Favourites" , JSON.stringify(WithOutTheDealetedQuot))

    return WithOutTheDealetedQuot ;

    
}