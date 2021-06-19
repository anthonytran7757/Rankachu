import * as React from "react";
import {
  Dropdown,
  Icon,
  Input,
  InputGroup,
  List,
  Pagination,
  Panel,
} from "rsuite";
import didYouMean, { ReturnTypeEnums } from "didyoumean2";

import { sanitizeString } from "pokemonRanking-components/utils";
import {
  POKE_URL,
  TYPE_URL,
  POKE_SPRITE_URL,
} from "pokemonRanking-components/Constants";

import "rsuite/dist/styles/rsuite-default.css";
import "pokemonRanking-css/PokemonList.css";

type PokemonListProps = {
  updateSelectedPkmn: (pokemonId: number) => void;
};

interface pkmnData {
  name: string;
  url: string;
}

interface mapdata {
  [name: string]: pkmnData;
}

export function PokemonList(props: PokemonListProps) {
  const { updateSelectedPkmn } = props;
  const [pkmnList, setPkmnList] = React.useState<mapdata>({});
  const [currPage, setCurrPage] = React.useState<number>(1);
  const [maxPages, setMaxPages] = React.useState<number>(0);
  const [listMode, setListMode] = React.useState<string>("all");
  const [typeList, setTypeList] = React.useState<any[]>([]);
  const [searchVal, setSearchVal] = React.useState<string>("");
  const [searchSuggestions, setSearchSuggestions] = React.useState<string[]>(
    []
  );
  const [searched, setSearched] = React.useState<Boolean>(false);

  React.useEffect(() => {
    if (listMode === "all") retrieveAllPkmnList();
    else {
      retrievePkmnByType(listMode);
    }
  }, [currPage, listMode, searchSuggestions]);

  React.useEffect(() => {
    getTypes();
  }, []);

  React.useEffect(() => {
    if (!searchVal) {
      setSearched(false);
      setSearchSuggestions([]);
    }
  }, [searchVal]);

  async function retrieveAllPkmnList() {
    const url = `${POKE_URL}?limit=2000`;
    const resp = await fetch(url);
    const data = await resp.json();
    let tempMap: any = {};
    data.results.forEach((poke: pkmnData) => {
      tempMap[poke.name] = { name: poke.name, url: poke.url };
    });
    setPkmnList(tempMap);
    setMaxPages(data.count / 10 + 1);
  }

  const retrievePkmnByType = async (type: string) => {
    const url = `${TYPE_URL}${type}`;
    const resp = await fetch(url);
    const data = await resp.json();

    let tempMap: any = {};
    data.pokemon.forEach((poke: any) => {
      tempMap[poke.pokemon.name] = {
        name: poke.pokemon.name,
        url: poke.pokemon.url,
      };
    });
    setPkmnList(tempMap);
    setMaxPages(Math.floor(Object.keys(tempMap).length / 10) + 1);
  };

  async function getTypes() {
    const resp = await fetch(TYPE_URL);
    const data = await resp.json();
    setTypeList(data.results.slice(0, data.results.length - 2));
  }

  const paging = (eventKey: number) => {
    setCurrPage(eventKey);
  };

  const getSpriteURL = (pokeURL: string) => {
    const dexNum = getDexNum(pokeURL);
    let imgURL = `${POKE_SPRITE_URL}${dexNum}.png`;
    if (parseInt(dexNum) > 10090){
      imgURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
    }
    return imgURL;
  };

  const getDexNum = (pokeURL: string) => {
    let dexNum = pokeURL.replace(POKE_URL, "");
    dexNum = dexNum.substring(0, dexNum.length - 1);
    return dexNum;
  };

  const renderList = () => {
    let offset = (currPage - 1) * 10;
    let listToDisplay = Object.keys(pkmnList)
      .slice(offset, offset + 10)
      .map((name) => (
        <a onClick={() => selectPkmn(parseInt(getDexNum(pkmnList[name].url)))}>
          <List.Item>
            <img src={getSpriteURL(pkmnList[name].url)} alt={"vanity"} />
            {sanitizeString(name)}
          </List.Item>
        </a>
      ));
    return listToDisplay;
  };

  const selectPkmn = (selectedPkmn: number) => {
    updateSelectedPkmn(selectedPkmn);
  };

  const generateTypesDropdown = () => {
    let listToDisplay = typeList.map((elem) => (
      <Dropdown.Item onClick={() => updateListMode(elem.name)}>
        {sanitizeString(elem.name)}
      </Dropdown.Item>
    ));
    listToDisplay.unshift(
      <Dropdown.Item onClick={() => updateListMode("all")}>
        {"All"}
      </Dropdown.Item>
    );
    return listToDisplay;
  };

  const updateListMode = (elem: string) => {
    setCurrPage(1);
    setListMode(elem);
  };

  const searchPkmn = () => {
    setSearched(true);
    const pokeNames = Object.keys(pkmnList);
    if (pokeNames.includes(searchVal)) {
      selectPkmn(parseInt(getDexNum(pkmnList[searchVal].url)));
    } else {
      const suggestions = didYouMean(searchVal, pokeNames, {
        returnType: ReturnTypeEnums.ALL_CLOSEST_MATCHES,
      });
      setSearchSuggestions(suggestions);
    }
  };

  const renderSuggestions = () => {
    if (searchSuggestions.length) {
      return searchSuggestions.map((suggestion) => (
        <a onClick={() => handleSuggestion(suggestion)}>{` ${suggestion}`}</a>
      ));
    }

    return "Sorry, no results could be found";
  };

  const handleSuggestion = (pokeName: string) => {
    selectPkmn(parseInt(getDexNum(pkmnList[pokeName].url)));
  };
  let didYouMeanThis: any;

  if (Object.keys(pkmnList).includes(searchVal.toLowerCase()) || !searched) {
    didYouMeanThis = "";
  } else if (searchSuggestions.length) {
    didYouMeanThis = <div>Did you mean: {renderSuggestions()}</div>;
  } else {
    didYouMeanThis = <div>Sorry, no results could be found</div>;
  }

  const votesLeft = () => {};

  return (
    <div id="pokeList">
      <div className="typeDropdown">
        <p className="header">Filter By Type: </p>
        <Dropdown title={sanitizeString(listMode)} className="content">
          {generateTypesDropdown()}
        </Dropdown>
      </div>
      <InputGroup inside>
        <Input
          onChange={(value) => setSearchVal(value)}
          onPressEnter={() => searchPkmn()}
          placeholder={"Enter Pokemon Name"}
        />
        <InputGroup.Button onClick={() => searchPkmn()}>
          <Icon icon="search" />
        </InputGroup.Button>
      </InputGroup>
      <Panel>{didYouMeanThis}</Panel>
      <List size="sm" bordered hover>
        {renderList()}
      </List>
      <div className="pagingWrapper">
        <Pagination
          className="paging"
          prev
          last
          next
          first
          size="lg"
          ellipsis
          pages={maxPages}
          maxButtons={10}
          activePage={currPage}
          onSelect={paging}
        />
      </div>
    </div>
  );
}
