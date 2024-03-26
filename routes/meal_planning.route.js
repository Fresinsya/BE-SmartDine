const express = require('express');
const route = express.Router();
const { getAllMealPlanning, getMealPlanningbyId, createMealPlanning, deleteMealPlanning, deleteBahan } = require('../controllers/meal-planning.controllers');

route.get('/', getAllMealPlanning);
route.get('/:id', getMealPlanningbyId);
route.post('/', createMealPlanning);
route.delete('/:id', deleteMealPlanning);
route.delete('/:id/:bahanId', deleteBahan);

module.exports = {
    mealPlanningRoute: route
}