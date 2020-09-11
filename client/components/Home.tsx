import * as React from "react";
import { List, Panel, Grid, Row, Col } from "rsuite";
import "rsuite/dist/styles/rsuite-default.css";
import "pokemonRanking-css/Home.css";

export const Home = () => {
  const [pokeRankings, setPokeRankings] = React.useState<any>();
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
            <h3>
              #{index + 1} {poke.name}
              <img alt="vanity" src={`../assets/medal${index}.png`} />
            </h3>
            <img alt="vanity" className="pokeIMG" src={poke.imgURL} />
            <h5>Votes: {poke.voteCount}</h5>
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
        <List.Item>
          <p>
            #{index + 4} <img alt="vanity" src={poke.spriteURL} /> {poke.name}
          </p>
        </List.Item>
      ));
      return toDisplay;
    }
  };
  return (
    <div>
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
