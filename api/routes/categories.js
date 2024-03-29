import express from 'express'
import Category from '../models/Category.js'

const auth = (req, query) => query.where('user').equals(req.categories.user)

const router = express.Router()

router.use((req, res, next) => {
    if (req.session && req.session.passport) {
        const user = req.session.passport.user
        req.categories = { user }
        next()
    } else {
        res.status(401).json({ errors: 'Not logged in' })
    }
})

//Get all Categories
router.get('/', async (req, res) => {
    try {
        const query = await auth(req, Category.find())
        res.json(query)
    } catch (err) {
        res.status(404)
        res.send({ error: "No categories found" })
    }
})

//Get category by ID
router.get('/:id', async (req, res) => {
    try {
        const query = await auth(req, Category.findById({ _id: req.params.id }))
        res.json(query)
    } catch (err) {
        res.status(404)
        res.send({ error: "Category doesn't exist" })
    }
})

//Post new category
router.post('/', async (req, res) => {
    const category = new Category({
        user: req.categories.user,
        name: req.body.name,
        colour: req.body.colour
    })
    await category.save()
    res.json(category)
})

//Update category
router.patch("/:id", async (req, res) => {
    try {
        const query = auth(req, await Category.updateOne({ _id: req.params.id }, req.body))
        res.json(query)
    } catch (err) {
        res.status(404)
        res.send({ error: "Could not update category" })
    }
})

//Delete category by ID
router.delete("/:id", async (req, res) => {
    try {
        const query = auth(req, await Category.deleteOne({ _id: req.params.id }))
        res.json(query)
    } catch (err) {
        res.status(404)
        res.send({ error: "Could not delete category" })
    }
})

export default router