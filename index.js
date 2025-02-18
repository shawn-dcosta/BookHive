import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const port = 3000;
const app = express();
const API_URL = "https://openlibrary.org/search.json?";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/submit", async (req, res) => {
    const filter = req.body.searchBy;
    const query = req.body.searchBar;
    if(filter === "" || query === "") res.redirect("/");
    else{
        try{
            let response = "";
            if(filter === "author") response = await axios.get(API_URL + `${filter}=` + `${query}` + "&fields=*&sort=rating");
            else if(filter === "title") response = await axios.get(API_URL + `${filter}=` + `${query}` + "&fields=*");
            const result = response.data;
            const data = {
                author_name: result.docs[0].author_name[0],
                first_publish_year: result.docs[0].first_publish_year,
                language: result.docs[0].language,
                title: result.docs[0].title,
                ratings_count: result.docs[0].ratings_count,
                ratings_average: result.docs[0].ratings_average,
                ratings_count_5: result.docs[0].ratings_count_5,
                want_to_read_count: result.docs[0].want_to_read_count,
                currently_reading_count: result.docs[0].currently_reading_count,
                already_read_count: result.docs[0].already_read_count,
            }
            if(filter === "author") res.render("index.ejs", {
                content: result,
                filter: filter,
            });
            else if(filter === "title") res.render("index.ejs", {
                content: data,
                filter: filter,
            });
        }catch(error){
            res.status(404).send(error.message);
        }
    }
});

app.listen(port, () => {
    console.log(`Server is listening at port: ${port}.`);
});