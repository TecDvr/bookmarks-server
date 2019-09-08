const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

const bookmarks = [{
    id: 1,
    title: 'Zach Portfolio',
    url: 'http://www.zachgw.com',
    rating: '3',
    desc: 'Zachs AWESOME portfolio'
}];

bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(bookmarks)
    })
    .post(bodyParser, (req, res) => {
        const {title, url, rating, desc} = req.body;

        if(!title) {
            logger.error('Title is required');
            return res.status(400).send('Invalid data');
        }
        if(!url) {
            logger.error('URL is required');
            return res.status(400).send('Invalid data');
        }
        if(!rating) {
            logger.error('Rating is required');
            return res.status(400).send('Invalid data');
        }
        if(!desc) {
            logger.error('Description is required');
            return res.status(400).send('Invalid data');
        }
        if(rating < 1 || rating > 5) {
            logger.error('Rating must be between 1-5')
            return res.send('Rating must be between 1-5');
        }

        const id = uuid();

        const bookmark = {
            id,
            title,
            url,
            rating,
            desc
        }

        bookmarks.push(bookmark);

        logger.info(`Bookmark with id ${id} created`);

        res.status(201).location(`http://localhost:8000/card/${id}`).json(bookmark)
    })

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const {id} = req.params;
        const bookmark = bookmarks.find(bk => bk.id == id)

        if(!bookmark) {
            logger.error(`Bookmark with id ${id} does not effin exist!`);
            return res.status(404).send('Bookmark not effin found!')
        }

        res.json(bookmark);
    })
    .delete((req, res) => {
        const {id} = req.params;

        const bookmarkIndex = bookmarks.findIndex(bk => bk.id == id);

        if(bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${id} not effin found.`);
            return res.status(404).send('Not found bruh');
        }

        bookmarks.splice(bookmarkIndex, 1);

        logger.info(`Bookmark with id ${id} is gone for good bruh`);

        res.status(204).end();
    })

module.exports = bookmarksRouter;