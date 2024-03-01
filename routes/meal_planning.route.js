const express = require('express');
const route = express.Router();
const { getAllMealPlanning, getMealPlanningbyId, createMealPlanning, deleteMealPlanning } = require('../controllers/meal-planning.controllers');

route.get('/', getAllMealPlanning);
route.get('/:id', getMealPlanningbyId);
route.post('/', createMealPlanning);
route.delete('/:id', deleteMealPlanning);

module.exports = {
    mealPlanningRoute: route
}