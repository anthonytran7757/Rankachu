import * as React from 'react';
import {Dropdown, Icon, Input, InputGroup, List, Pagination, Panel} from 'rsuite';
import didYouMean, {ReturnTypeEnums} from 'didyoumean2'

import { sanitizeString } from './utils';

import 'rsuite/dist/styles/rsuite-default.css'
import '../css/PokemonList.css'

type PokemonListProps = {
    updateSelectedPkmn: (pokemonId: number) => void
}

interface pkmnData {
    name: string;
    url: string;
}

interface mapdata{
    [name: string]: pkmnData
}

export function PokemonList(props: PokemonListProps) {
    const {updateSelectedPkmn} = props;
    const [pkmnList, setPkmnList] = React.useState<mapdata>({})
    const [currPage, setCurrPage] = React.useState<number>(1)
    const [maxPages, setMaxPages] = React.useState<number>(0)
    const [listMode, setListMode] = React.useState<string>("all")
    const [typeList, setTypeList] = React.useState<any[]>([])
    const [searchVal, setSearchVal] = React.useState<string>("")
    const [searchSuggestions, setSearchSuggestions] = React.useState<string[]>([])
    const [searched, setSearched] = React.useState<Boolean>(false)

    React.useEffect(() => {
        if(listMode === "all")
            retrieveAllPkmnList();
        else{
            retrievePkmnByType(listMode)
        }
    }, [currPage, listMode, searchSuggestions])

    React.useEffect(() => {
        getTypes()
    }, [])

    React.useEffect(() =>{
        if(!searchVal){
            setSearched(false)
            setSearchSuggestions([])
        }
    }, [searchVal])

    async function retrieveAllPkmnList() {
        const url = "https://pokeapi.co/api/v2/pokemon/?limit=2000"
        const resp = await fetch(url);
        const data = await resp.json()
        //setPkmnList(data.results)
        let tempMap:any = {}
        data.results.forEach((poke: pkmnData) =>{
            tempMap[poke.name] ={name: poke.name, url:poke.url}
        })
        setPkmnList(tempMap)
        setMaxPages((data.count/10)+1)
    }

    const retrievePkmnByType = async (type: string) =>{
        const url = `https://pokeapi.co/api/v2/type/${type}`
        const resp = await fetch(url);
        const data = await resp.json()

        let tempMap:any = {}
        data.pokemon.forEach((poke: any) =>{
            tempMap[poke.pokemon.name] ={name: poke.pokemon.name, url:poke.pokemon.url}
        })
        setPkmnList(tempMap)
        setMaxPages((Math.floor(Object.keys(tempMap).length/10)) + 1)
    }

    async function getTypes(){
        const resp = await fetch("https://pokeapi.co/api/v2/type/")
        const data = await resp.json()
        setTypeList(data.results.slice(0, data.results.length-2))
    }

    const paging = (eventKey:number) =>{
        setCurrPage(eventKey)
    }

    const getSpriteURL = (pokeURL: string) => {
        const dexNum = getDexNum(pokeURL);
        let spriteURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/"
        spriteURL = spriteURL.concat(dexNum,".png")
        return spriteURL
    }



    const getDexNum = (pokeURL: string) =>{
        let dexNum = pokeURL.replace('https://pokeapi.co/api/v2/pokemon/',"")
        dexNum = dexNum.substring(0, dexNum.length - 1);
        return dexNum
    }

    const renderList = () => {
        let offset = ((currPage -1)* 10);
        let listToDisplay = Object.keys(pkmnList).slice(offset, offset + 10).map(name => (

            <a onClick={() => selectPkmn(parseInt(getDexNum(pkmnList[name].url)))}>
                <List.Item>
                    <img src={getSpriteURL(pkmnList[name].url)}/>
                    {sanitizeString(name)}
                </List.Item>
            </a>
        ))
        return(listToDisplay)
    }

    const selectPkmn = (selectedPkmn: number) => {
        updateSelectedPkmn(selectedPkmn)
    }

    const generateTypesDropdown= () =>{
        let listToDisplay = typeList.map(elem => (
            <Dropdown.Item onClick = {() => updateListMode(elem.name)}>
                {sanitizeString(elem.name)}
            </Dropdown.Item>
        ))
        listToDisplay.unshift(
            <Dropdown.Item onClick = {() => updateListMode("all")}>
                {"All"}
            </Dropdown.Item>
        )
        return(listToDisplay)
    }

    const updateListMode = (elem: string) => {
        setCurrPage(1)
        setListMode(elem)
    }

    const searchPkmn= () =>{
        setSearched(true)
        const pokeNames = Object.keys(pkmnList)
        if (pokeNames.includes(searchVal)){
            selectPkmn(parseInt(getDexNum(pkmnList[searchVal].url)))
        }
        else{
            const suggestions = didYouMean(searchVal, pokeNames,{returnType: ReturnTypeEnums.ALL_CLOSEST_MATCHES})
            setSearchSuggestions(suggestions)
        }
    }

    const renderSuggestions = () =>{
        if(searchSuggestions.length){
            return searchSuggestions.map(suggestion=>(
                <a onClick={() => handleSuggestion(suggestion)}>{` ${suggestion}`}</a>
            ))
        }

        return("Sorry, no results could be found")
    }

    const handleSuggestion = (pokeName:string) =>{
        selectPkmn(parseInt(getDexNum(pkmnList[pokeName].url)))
    }
    let didYouMeanThis:any;


    if(Object.keys(pkmnList).includes(searchVal.toLowerCase()) || !searched){
        didYouMeanThis = ""
    }
    else if(searchSuggestions.length){
        didYouMeanThis = <div>Did you mean:  {renderSuggestions()}</div>
    }
    else{
        didYouMeanThis = <div>Sorry, no results could be found</div>
    }

    return (
        <div id="pokeList">
            <Dropdown title={listMode}>
                {generateTypesDropdown()}
            </Dropdown>
            <InputGroup inside>
                <Input onChange={value => setSearchVal(value)} onPressEnter={() =>searchPkmn()} placeholder={"Enter Pokemon Name"} />
                <InputGroup.Button onClick={() => searchPkmn()}>
                    <Icon icon="search" />
                </InputGroup.Button>
            </InputGroup>
            <Panel>
                {didYouMeanThis}
            </Panel>
            <List size="sm" bordered hover >
                {renderList()}
            </List>
            <div className="pagingWrapper">
                <Pagination
                    className="paging"
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
        </div>
    )
}







