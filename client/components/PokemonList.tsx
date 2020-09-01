import * as React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, useParams} from 'react-router-dom'
import {List, Button, Loader, Pagination, Dropdown} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css'

import '../css/PokemonList.css'
import {type} from "os";

type PokemonListProps = {
    updateSelectedPkmn: (pokemonId: number) => void
}

interface resultsData {
    name: string;
    url: string;
}

export function PokemonList(props: PokemonListProps) {
    const {updateSelectedPkmn} = props;
    const [pkmnList, setPkmnList] = React.useState<resultsData[]>([])
    const [currPage, setCurrPage] = React.useState<number>(1)
    const [maxPages, setMaxPages] = React.useState<number>(0)
    const [listMode, setListMode] = React.useState<string>("all")
    const [typeList, setTypeList] = React.useState<any[]>([])


    React.useEffect(() => {
        retrieveAllPkmnList();
    }, [currPage])

    React.useEffect(() => {
        getTypes()
    }, [])


    async function retrieveAllPkmnList() {
        let offset = ((currPage -1)* 10).toString();
        let url = "https://pokeapi.co/api/v2/pokemon/?limit=10&offset=".concat(offset)
        let resp = await fetch(url);
        let data = await resp.json()
        setPkmnList(data.results)
        setMaxPages((data.count/10)+1)
    }

    const retrievePkmnByType = async (type: string) =>{
        let offset = ((currPage -1)* 10).toString();
        let url = `https://pokeapi.co/api/v2/type/.concat${type}${offset})`
        let resp = await fetch(url);
        let data = await resp.json()
        setPkmnList(data.results)
    }

    async function getTypes(){
        let resp = await fetch("https://pokeapi.co/api/v2/type/")
        let data = await resp.json()

        setTypeList(data.results.slice(0, data.results.length-2))
    }

    const paging = (eventKey:number) =>{
        setCurrPage(eventKey)
    }

    const getSpriteURL = (pokeURL: string) => {
        let dexNum = getDexNum(pokeURL);
        let spriteURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/"
        spriteURL = spriteURL.concat(dexNum,".png")
        return spriteURL
    }

    const capitalize = (s: string) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    const getDexNum = (pokeURL: string) =>{
        let dexNum = pokeURL.replace('https://pokeapi.co/api/v2/pokemon/',"")
        dexNum = dexNum.substring(0, dexNum.length - 1);
        return dexNum
    }

    const renderList = () => {
        let listToDisplay = pkmnList.map(item => (
            <a onClick={() => selectPkmn(parseInt(getDexNum(item.url)))}>
                <List.Item>
                    <img src={getSpriteURL(item.url)}/>
                    {capitalize(item.name)}
                </List.Item>
            </a>
        ))
        return(listToDisplay)
    }

    const selectPkmn = (selectedPkmn: number) => {
        updateSelectedPkmn(selectedPkmn)
    }

    const generateTypesDropdown= () =>{
        console.log(typeList)
        let listToDisplay = typeList.map(elem => (
            <Dropdown.Item onClick = {() => updateListMode(elem.name)}>
                {elem.name}
            </Dropdown.Item>
        ))
        return(listToDisplay)
    }

    const updateListMode = (elem: string) => {
        setCurrPage(1)
        setListMode(elem)
    }

    return (
        <div id="pokeList">
            <Dropdown title="Select Type">
                {generateTypesDropdown()}
            </Dropdown>
            <List size="sm" bordered hover >
                {renderList()}
            </List>
            <Pagination
                prev
                last
                next
                first
                size="m"
                ellipsis
                pages={maxPages}
                maxButtons={10}
                activePage={currPage}
                onSelect={paging}
            />
        </div>
    )
}







