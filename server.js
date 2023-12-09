const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connectDataBase = require("./database/connection.db");
const UserRoute = require("./routes/user.routes");
const body_parser = require("body-parser");
const dialogFlow = require("@google-cloud/dialogflow");
const axios = require("axios");
const { WebhookClient, Suggestion } = require("dialogflow-fulfillment");

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.use("/api", UserRoute);

app.post("/", (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  async function liveScore(agent) {
    const data = await axios.get(
      "https://apiv2.allsportsapi.com/football/?met=Livescore&APIkey=6eb6e0ea203525eaeb9e8fcccac7ba5b4f779cf00f084b4a23c10836acb98be5"
    );
    const { team1, team2 } = agent.parameters;
    const result = data.data.result;
    var flag = false;
    var score;
    for (let i = 0; i < result.length; i++) {
      if (
        (result[i].event_home_team === team1 ||
          result[i].event_home_team === team2) &&
        (result[i].event_away_team === team1 ||
          result[i].event_away_team === team2)
      ) {
        flag = true;
        const home_score = result[i].event_final_result.split(" ")[0];
        const away_score = result[i].event_final_result.split(" ")[2];
        score = `${result[i].event_home_team} score is ${home_score} - ${
          result[i].event_away_team
        } score is ${away_score} 
        ${
          home_score > away_score
            ? `${result[i].event_home_team} team is Winning !!`
            : ""
        } ${
          away_score > home_score
            ? `${result[i].event_away_team} team is Winning !!`
            : ""
        } 
        ${home_score === away_score ? "No one is Winning !!" : ""}`;
      }
    }
    if (flag === false) {
      score = "We Could'nt Find Teams !!";
    }
    agent.add(score);
  }

  let intentMap = new Map();
  intentMap.set("live_score", liveScore);

  agent.handleRequest(intentMap);
});
connectDataBase();

app.listen(3000, () => {
  console.log(`listening on Port ${3000}`);
});
