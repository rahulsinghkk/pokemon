import { useEffect, useState } from 'react'
import './index.css'
import { PokemonCards } from './pokemonCard'

export const Pokemon = () => {

    const [pokemonData, setPokemonData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [search, setSearch] = useState('')

    const fetchPokemon = async () => {
        try {
            const pokemons = await fetch('https://pokeapi.co/api/v2/pokemon?limit=24')
            const pokemonsData = await pokemons.json()
            const detailPokemonResult = pokemonsData.results.map(async (res)=>{
                const data = await fetch(res.url)
                const result = await data.json()
                return result
            })
            const value = await Promise.all(detailPokemonResult)
            setPokemonData(value)
            setLoading(false)
        }catch (err) {
            console.log(err)
            setError(true)
            setLoading(false)
        }
    }
    
    useEffect(()=>{
        fetchPokemon()
    },[])
        
    if(loading) return <div><h1>....loading</h1></div>
    if(error) return <div><h1>{error.message}</h1></div>

    const searchData = pokemonData.filter((currPokemon)=> currPokemon.name.toLowerCase().includes(search.toLowerCase()))
    return (
        <>
            <section className='container'>
                <header>
                    <h1>Lets catch Pokemon</h1>
                </header>
                <div className='pokemon-search'>
                    <input type='text' placeholder='Search Pokemon' value={search} onChange={(e)=> setSearch(e.target.value)}/>
                </div>
            </section>
            <div className="card-container">
                <ul className='cards'>
                    {searchData
                        .map((pokemon)=>{
                            return <PokemonCards
                            key={pokemon.id}
                            pokemonData={pokemon}
                        />
                    })}
                </ul>
            </div>
        </>
    )
}