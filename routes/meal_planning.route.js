const express = require('express');
const route = express.Router();
const { getAllMealPlanning, getMealPlanningbyId, createMealPlanning } = require('../controllers/meal-planning.controllers');

route.get('/', getAllMealPlanning);
route.get('/:id', getMealPlanningbyId);
route.post('/', createMealPlanning);

module.exports = {
    mealPlanningRoute: route
}