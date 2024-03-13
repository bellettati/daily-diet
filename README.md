# Business Rules

-   [x] Able to create user
-   [x] Able to identify users between requests
-   [x] Able to register a meal, with the following info:
    -   Name
    -   Description
    -   Date and time
    -   Is inside diet or not
-   [x] Able to edit a meal, beeing possible to alter any info
    -   Date is passed as ("DD-MON-YYYY HH:mm:ss"), ex: "13-MAR-2024 15:25:00"
-   [x] Able to delete meal
-   [x] Able to list all meals of a user
-   [x] Able to get a specific meal
-   [ ] Able to get user metrics
    -   Number of meals registered
    -   Number of meals inside the diet
    -   Number of meals outside the diet
    -   Best sequence of meals inside the diet
-   [x] User can only get, edit and delete meals he himself has created
-   [x] Meals are considered in diet if consumed at least three hours after last meal

# End-points

-   [x] [GET] /meals, get all meals
-   [x] [GET] /meals/:id, get specific meal
-   [ ] [GET] /users/:id/metrics, get user metrics
-   [x] [POST] /meals, create meal
-   [x] [POST] /users, create user
-   [x] [PUT] /meals/:id, update meal
-   [x] [DELETE] /meals/:id, update meal
