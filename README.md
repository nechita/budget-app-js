# budget-app-js
Mainly this projesct is done using JS module pattern design and DOM manipulation. 
Defined 3 separated modules: Budget Controller, UI Controller and the one that links these 2 and controls the entire aplicattion named App Controller.
Added eventListener for click event but also for enter keypress.
Instantiate with function constructors 2 objects for Expenses and Incomes and prepared a data structure to push new items into it. 
First we colect the new input value into the data structure and after this we display them into the UI with an addListItem function, based on type: expense or income.
AddListItem function requires some DOM manipulation in 3 steps: create HTML string, replace the values and insert it into the DOM.
Also in order to display the budget values I’ve setup a function (calculateBudget) to calculate both types of budget (income and expense), but also general budget. Bonus is the percentage calculation of the expenses from fom income budget.
Next phase of the project was to use event delegation, event bubbling and target elements in order to delete items from the list and update the UI.
First I’ve setup the event delete listener in order to use event delegation. I write a function to listen the click event and based on the id of the item, to delete that item.  The deleteItem function loops over the array (using map) with the items stored and when find the id coresponding it deletes it using splice method. 



