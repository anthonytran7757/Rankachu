import * as React from "react";
import { PokeInfo } from "pokemonRanking-components/PokeInfo";
import { List, Panel, Grid, Row, Col } from "rsuite";
import "rsuite/dist/styles/rsuite-default.css";
import "pokemonRanking-css/Home.css";

export const Home = () => {
  const [pokeRankings, setPokeRankings] = React.useState<any>();
  const [clickedMonDexNum, setClickedMonDexNum] = React.useState<number>(0);

  React.useEffect(() => {
    async function retrieveRankings() {
      let resp = await fetch("/contest", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      let data = await resp.json();
      await setPokeRankings(data);
    }
    retrieveRankings();
  }, []);

  const findContestIndex = (contest: string) => {
      for (let i = 0; i < pokeRankings.length; i++){
          if(pokeRankings[i].name === contest){
              return i
          }
      }
      return 0
  }

  const renderTopThree = (contest: string) => {
    if (pokeRankings) {
      let index = findContestIndex(contest);
      let overallTopThree = pokeRankings[index].nominees.slice(0, 3);
      let toDisplay = overallTopThree.map((poke: any, index: number) => (
        <Col md={8}>
          <Panel bordered shaded className="pokeCard">
              <a onClick={() => updateClickedPkmn(poke.dexNum) }>
                <h3>
                  #{index + 1} {poke.name}
                  <img alt="vanity" src={`../assets/medal${index}.png`} />
                </h3>
                <img alt="vanity" className="pokeIMG" src={poke.imgURL} />
                <h5>Votes: {poke.voteCount}</h5>
              </a>
          </Panel>
        </Col>
      ));
      return toDisplay;
    }
  };

  const renderContenders = (contest: string) => {
    if (pokeRankings) {
        let index = findContestIndex(contest);
      let overallTopThree = pokeRankings[index].nominees.slice(3, 10);
      let toDisplay = overallTopThree.map((poke: any, index: number) => (
          <a onClick={() => updateClickedPkmn(poke.dexNum)}>
            <List.Item>
              <p>
                #{index + 4} <img alt="vanity" src={poke.spriteURL} /> {poke.name}
              </p>
            </List.Item>
          </a>
      ));
      return toDisplay;
    }
  };

  const renderPokeInfo = (dexNum: number) => {
      if(clickedMonDexNum != 0){
          return <PokeInfo
              retrieveSelectedPkmn={clickedMonDexNum}
              updateSelectedPkmn={updateClickedPkmn}
          />
      }
  }

    const updateClickedPkmn = (pkmnId: number) => {
        setClickedMonDexNum(pkmnId);
    };


  return (
    <div>
        <div>{renderPokeInfo(clickedMonDexNum)}</div>
      <h1 className="title">Pokemon Ranking</h1>
      <h2 className="subheader">Top Overall</h2>
      <Grid>
        <Row className="row">{renderTopThree("overall")}</Row>
      </Grid>
      <Panel
        header="Honourable Mentions"
        defaultExpanded
        collapsible
        bordered
        className="honourableMentions"
      >
        <List>{renderContenders("overall")}</List>
      </Panel>
      <h2 className="subheader">Top Legendary</h2>
      <Grid>
        <Row className="row">{renderTopThree("legendary")}</Row>
      </Grid>
      <Panel
        header="Honourable Mentions"
        defaultExpanded
        collapsible
        bordered
        className="honourableMentions"
      >
        <List>{renderContenders("legendary")}</List>
      </Panel>
    </div>
  );
};
