import * as React from 'react';
import {Dropdown, Icon, Input, InputGroup, List, Pagination, Panel} from 'rsuite';
import didYouMean, {ReturnTypeEnums} from 'didyoumean2'
import 'rsuite/dist/styles/rsuite-default.css'


import '../css/PokemonList.css'


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
    const [pkmnNamesList, setPkmnNamesList] = React.useState<string[]>([])
    const [searchVal, setSearchVal] = React.useState<string>("")
    const [searchSuggestions, setSearchSuggestions] = React.useState<string[]>([])

    React.useEffect(() => {
        if(listMode === "all")
            retrieveAllPkmnList();
        else{
            retrievePkmnByType(listMode)
        }
    }, [currPage, listMode, searchVal, searchSuggestions])

    React.useEffect(() => {
        getTypes()
    }, [typeList])


    async function retrieveAllPkmnList() {
        let url = "https://pokeapi.co/api/v2/pokemon/?limit=2000"
        let resp = await fetch(url);
        let data = await resp.json()
        setPkmnList(data.results)
        setMaxPages((data.count/10)+1)
        if(!pkmnNamesList.length){
            pkmnList.forEach(poke => pkmnNamesList.push(poke.name))
            setPkmnNamesList(pkmnNamesList)
        }

    }

    const retrievePkmnByType = async (type: string) =>{
        const url = `https://pokeapi.co/api/v2/type/${type}`
        const resp = await fetch(url);
        const data = await resp.json()
        let retrievedList: any[] = []
        data.pokemon.forEach((poke: { pokemon: any; }) => retrievedList.push(poke.pokemon))
        setMaxPages((Math.floor(retrievedList.length/10)) + 1)
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
        let offset = ((currPage -1)* 10);
        let listToDisplay = pkmnList.slice(offset, offset + 10).map(item => (
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
        let listToDisplay = typeList.map(elem => (
            <Dropdown.Item onClick = {() => updateListMode(elem.name)}>
                {elem.name}
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
        console.log(didYouMean(searchVal, pkmnNamesList,{returnType: ReturnTypeEnums.ALL_CLOSEST_MATCHES}))
        setSearchSuggestions(didYouMean(searchVal, pkmnNamesList,{returnType: ReturnTypeEnums.ALL_CLOSEST_MATCHES}))
    }

    const renderSuggestions = () =>{
        if(searchSuggestions.length){
            let display = searchSuggestions.map(suggestion=>(
                <a>{` ${suggestion}`}</a>
            ))
            return display
        }
    }

    const handleSuggestion = (pokeName:string) =>{
        
    }

    return (
        <div id="pokeList">
            <Dropdown title="Select Type">
                {generateTypesDropdown()}
            </Dropdown>
            <InputGroup inside>
                <Input onChange={value => setSearchVal(value)} placeholder={"Enter Pokemon Name"} />
                <InputGroup.Button onClick={searchPkmn}>
                    <Icon icon="search" />
                </InputGroup.Button>
            </InputGroup>
            <Panel>
                Did you mean: {renderSuggestions()}
            </Panel>
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







