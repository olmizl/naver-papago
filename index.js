const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv").config();
const NAVER_ID = process.env.NAVER_ID;
const NAVER_SECRET_ID = process.env.NAVER_SECRET_ID;

app.set("port", process.env.PORT || 8099); //정해진 포트가있으면 그곳으로가고 아니면 8099로 가겠다
const port = app.get("port");

app.use(morgan("dev")); //"dev "치면 간략하게 나옴
app.use(cors());

app.use(express.json()); //post로 보내면 써야함 ****
app.use(express.urlencoded({ extended: false })); //post로 보내면  써야함 ****
app.get("/", (req, res) => {
  res.send("hello express");
});

app.post("/papago", (req, res) => {
  //post로 보내면 app.get이아니라 post
  console.log(req.body.txt); //post로 보내면 req.body로 받아야함
  const txt = req.body.txt; //post로 보내면 req.body로 받아야함
  const language = req.body.language;
  axios({
    url: "https://openapi.naver.com/v1/papago/n2mt",
    method: "POST", //디폴트는 get이므로 post쓰려면반드시 써야함
    params: {
      //get방식:data , post방식:params로 씀
      source: "ko",
      target: language,
      text: txt,
    },
    headers: {
      "X-Naver-Client-Id": NAVER_ID,
      "X-Naver-Client-Secret": NAVER_SECRET_ID,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
    .then((response) => {
      // console.log(response.data.message.result.translatedText);
      res.json({ result: response.data.message.result.translatedText });
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

app.listen(port, () => {
  console.log(`${port}에서 서버 대기 중`);
});
