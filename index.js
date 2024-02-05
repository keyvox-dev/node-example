import express from 'express';
import 'dotenv/config';
import KeyVox from 'keyvox-node'
import nunjucks from 'nunjucks';
import * as Helpers from './_helpers.js'

const app = express();

const nunjucksEnv = nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});
nunjucksEnv.addFilter('formatDateTimestamp', Helpers.formatDateTimestamp)

app.use(express.static('public'));

const kv = new KeyVox(process.env.KEYVOX_API, {
    baseURL: 'http://127.0.0.1:8080/api'
})


app.get('/', async (request, response) => {

    const itemsPerPage = 6;
    const page = request.query.page ?? 1

    const articles = await kv.articles.list({
        itemsPerPage,
        page,
    })
    const linksCount = Math.ceil(articles.meta.count / itemsPerPage);

    const tags = await kv.tags.list();

    const data = {
        articles,
        linksCount,
        tags
    }

    response.render('index.html', data)
})

app.get('/infos/:slug', async (request, response) => {
    const slug = request.params.slug;

    const article = await kv.articles.getBySlug(slug);

    const data = {
        article
    };

    response.render('article.html', data);
});

app.get('/tags/:slug', async (request, response) => {
    const slug = request.params.slug;

    const articles = await kv.tags.getBySlug(slug);
    const tags = await kv.tags.list();

    const data = {
        articles,
        tags
    };

    response.render('tag.html', data)
})



app.listen(process.env.APP_PORT, () => console.log(`localhost:${process.env.APP_PORT}`))