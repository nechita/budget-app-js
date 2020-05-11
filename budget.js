//UI Controller
var UIController = (function () {
    var formatNumber = function (num) {
        var numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];
        return int + '.' + dec;
    };

    var incomeElement = function ({ id, description, value }) {
        return `<div class="item clearfix" id="inc-${id}">
        <div class="item__description">${description}</div><div class="right clearfix">
        <div class="item__value">+${value}</div><div class="item__delete" data-target="inc-${id}">
        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
    };

    var expenseElement = function ({ id, description, value, percentage }) {
        return `<div class="item clearfix" id="exp-${id}">
        <div class="item__description">${description}</div><div class="right clearfix">
        <div class="item__value">-${value}</div><div class="item__delete" data-target="exp-${id}"><div class="item__percentage">${percentage}</div>
        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector('.add__type').value,
                description: document.querySelector('.add__description').value,
                value: parseFloat(document.querySelector('.add__value').value)
            };
        },

        restoreFromLocalStorage: function (arr) {
            if (!arr.length) return;
            var html, element;

            arr.forEach(function (item) {
                var formattedObject = {
                    ...item,
                    value: formatNumber(item.value)
                };
                if (formattedObject.percentage !== undefined) {
                    element = document.querySelector('.expenses__list');
                    html = expenseElement(formattedObject);
                } else {
                    element = document.querySelector('.income__list');
                    html = incomeElement(formattedObject);
                }
                element.insertAdjacentHTML('beforeend', html);
            });
        },

        addListItem: function (obj, type) {
            // Create HTML strings with placeholder text
            var html, element;
            var formattedObject = {
                ...obj,
                value: formatNumber(obj.value)
            };

            if (type === 'inc') {
                element = document.querySelector('.income__list');
                html = incomeElement(formattedObject);
            } else if (type === 'exp') {
                element = document.querySelector('.expenses__list');
                html = expenseElement(formattedObject);
            }
            // Insert the HTML into the DOM
            element.insertAdjacentHTML('beforeend', html);
        },

        deleteListItem: function (selectorId) {
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },

        clearFields: function () {
            var inputs, inputFields;
            inputs = document.querySelectorAll('input');
            inputFields = Array.prototype.slice.call(inputs);
            inputFields.forEach(function (element) {
                element.value = '';
            });
            inputFields[0].focus();
        },

        displayBudget: function (obj) {
            var divBudget = document.querySelector('.budget__value');
            divBudget.textContent = `${obj.budget}`;

            var divIncome = document.querySelector('.budget__income--value');
            divIncome.textContent = `+${obj.totalIncome}`;

            var divExpenses = document.querySelector('.budget__expenses--value');
            divExpenses.textContent = `-${obj.totalExpenses}`;

            var divPercentage = document.querySelector('.budget__expenses--percentage');
            if (obj.percentage > 0) {
                divPercentage.textContent = `${obj.percentage}%`;
            } else {
                divPercentage.textContent = `---`;
            }
        },
        displayPercentage: function (percentages) {
            var percentageFields = document.querySelectorAll('.item__percentage');
            var nodeListForEach = function (list, callback) {
                for (i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };
            nodeListForEach(percentageFields, function (item, index) {
                if (percentages[index] > 0) {
                    item.textContent = percentages[index] + '%';
                } else {
                    item.textContent = '---';
                }
            });
        },
        displayMonth: function () {
            var element, date, month, year;
            element = document.querySelector('.budget__title--month');
            date = new Date();
            year = date.getFullYear();
            month = [];
            month[0] = 'January';
            month[1] = 'February';
            month[2] = 'March';
            month[3] = 'April';
            month[4] = 'May';
            month[5] = 'June';
            month[6] = 'July';
            month[7] = 'August';
            month[8] = 'September';
            month[9] = 'October';
            month[10] = 'November';
            month[11] = 'December';
            element.textContent = `${month[date.getMonth()]} ${year}`;
        }
    };
})();

//Budget Controller
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome < 0) return;
        this.percentage = Math.round(this.value / totalIncome * 100);
    };
    Expense.prototype.getPercentage = function () {
        this.percentage = this.percentage || -1;
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (item) {
            return (sum += item.value);
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    var dataStorage = localStorage.getItem('myData');

    if (dataStorage !== null) {
        data = {
            ...JSON.parse(dataStorage)
        };
    }

    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
                newItem.calcPercentage(data.totals.inc);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push item into data structure array
            data.allItems[type] = [...data.allItems[type], newItem];
            return newItem;
        },
        deleteItem: function (type, id) {
            data.allItems[type] = [
                ...data.allItems[type].filter(function (item) {
                    item.id !== parseInt(id, 10);
                })
            ];
        },
        calculateBudget: function () {
            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // Calculate the budget:income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // Calculate the percentage of income we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
        },
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (item) {
                var expenseObj = new Expense(item.id, item.description, item.value);
                return expenseObj.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (item) {
                var expenseObj = new Expense(item.id, item.description, item.value);
                return expenseObj.getPercentage();
            });
            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            };
        },

        setLocalStorage: function () {
            localStorage.setItem('myData', JSON.stringify(data));
        }
    };
})();

// General Controller
var controller = (function (UICtrl, BudgetCtrl) {
    var setupEventListeners = function () {
        document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector('.container').addEventListener('click', ctrlDeleteItem);
    };
    var updateBudget = function () {
        // Calculate the budget
        BudgetCtrl.calculateBudget();
        //Return the budget
        var budget = BudgetCtrl.getBudget();
        //Display the budget
        UICtrl.displayBudget(budget);
        BudgetCtrl.setLocalStorage();
    };

    var updatePercentages = function () {
        //1. Calculate percentages
        BudgetCtrl.calculatePercentages();
        //.2 Read percentages from budgte controller
        var percentages = BudgetCtrl.getPercentages();
        //3. Update UI
        UICtrl.displayPercentage(percentages);
    };
    var ctrlAddItem = function () {
        //1.Get the input data
        var input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            //2. Add the item to Budget
            var newItem = BudgetCtrl.addItem(input.type, input.description, input.value);
            //3. Add the item to UI
            UICtrl.addListItem(newItem, input.type);
            //4. Clear fields
            UICtrl.clearFields();
            //5. Calculate budget and update it
            updateBudget();
            //6. Update percentages
            updatePercentages();
        }
    };
    var ctrlDeleteItem = function (e) {
        var target = e.target;
        if (target && target.className === 'ion-ios-close-outline') {
            // split the string
            var parent = target.parentNode.parentNode; // .item__delete
            var [type, id] = parent.dataset.target.split('-');
            //1. Delete the item from the structure
            BudgetCtrl.deleteItem(type, id);
            //2. Delete the item from UI
            UICtrl.deleteListItem(parent.dataset.target);
            //3. Update budget
            updateBudget();
            //4. Update percentages
            updatePercentages();
        }
    };
    return {
        init: function () {
            console.log('app started');
            UICtrl.displayMonth();

            var myData = localStorage.getItem('myData');

            if (myData !== null) {
                var dataStorage = JSON.parse(myData);
                UICtrl.displayBudget({
                    /* allItems: dataStorage.allItems,   */
                    budget: dataStorage.budget,
                    percentage: dataStorage.percentage,
                    totalIncome: dataStorage.totals.inc,
                    totalExpenses: dataStorage.totals.exp
                });
                var { inc: income, exp: expense } = dataStorage.allItems;

                UICtrl.restoreFromLocalStorage(income);
                UICtrl.restoreFromLocalStorage(expense);
            } else {
                UICtrl.displayBudget({
                    budget: 0,
                    totalIncome: 0,
                    totalExpenses: 0,
                    percentage: -1
                });
            }

            setupEventListeners();
        }
    };
})(UIController, budgetController);

controller.init();
