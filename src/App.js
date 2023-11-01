import './App.css';
//import './style.css';
import { useEffect, useState } from 'react';
import React from 'react';

function App() {
  const ACCESS_KEY = "dTMJuGx1k0WGoJWk5uiHff72ar6njm7gyX9XUaDRmQ8"
  const [imageUrls, setImageUrls] = useState([])
  const [searchText, setSearchText] = useState('')
  const [finalSearch, setFinalSearch] = useState('')
  const [pageNumber,setPageNumber]=useState(1)
  const [isLoading,setIsLoading] =useState(false)

  var URL=`https://api.unsplash.com/search/photos?page=${pageNumber}&query=${searchText}&client_id=${ACCESS_KEY}`
  useEffect(() => {
    loadImages();
  }, [searchText,pageNumber]);

  async function loadImages() {
    console.log()
    if(!finalSearch) {
      return;
    }
    setIsLoading(true);
    
    console.log(searchText)
    try{
      const response = 
        await fetch(URL)
      console.log(URL);
    const imageResult =  await response.json()
    const newImageUrls = imageResult.results.map(image => image.urls.small);
    setImageUrls(prevImageUrls => [...prevImageUrls,...newImageUrls])
    console.log(imageUrls.length)
    console.log(`page: ${pageNumber}`)
    }
    catch(e) {
      console.log(`error: ${e}`)
      console.error(e);
    }
    finally{
      setIsLoading(false);
    }
  }

  function handleSearch(searchValue){
    console.log('clicked')
    setPageNumber(1)
    setFinalSearch(searchValue)
    setImageUrls([])
    console.log(finalSearch)
    console.log(URL)
  }

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleScroll = debounce(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (windowHeight + scrollTop >= documentHeight - 100) {
      setPageNumber(prevPageNumber => prevPageNumber + 1);
    }
  }, 300);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <div className='search-bar'>
        <input 
          value = {searchText}
          onChange={(e) => setSearchText(e.target.value)}/>
        <button onClick={() => handleSearch(searchText)}>Search</button>
      </div>
      <div className="gallery">
        {imageUrls.map((url, index) => (
          <img key={index} src={url} alt={`Image ${index + 1}`} />
        ))}
      </div>
      {isLoading && <div className="loading-indicator">Loading...</div>}
    </div>
  );
}

export default App;