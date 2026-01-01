import axios from "axios";

export async function requestRandomQuote(){
    const {data} = await axios.get("https://dummyjson.com/quotes/random") ;
    return {quote :data.quote , author : data.author}
}