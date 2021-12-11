const { Client } = require("@notionhq/client");
const express = require("express");
const moment = require("moment");

const notion = new Client({
  auth: "API",
});
const app = express();

const todoId = "databaseID"; 

const getToDo = async () => {

  const res = await notion.databases.query({
    database_id: todoId,
    filter: {
        and: [
          {
            "property": 'Date',
            "date": {
              "on_or_before": moment().format("YYYY-MM-DD")
                   }
          },
          {
            "property": 'Check',
            "checkbox": {
              "equals": false
                   }
          }
        ]
    }
  });

  let tasks = []; 
  for (let i = 0; i < res.results.length; i++)
  {
    tasks.push(res.results[i].properties.Task.title[0].text.content);
  };

  tasks = {key:tasks};

  return tasks;
  };

  app.get("/todo", async function(request, res){
    res.setHeader('content-type', 'text/plain');
    res.send(JSON.stringify(await getToDo()));
  });

  app.listen(3000);
