//UI Controller
var UIController = (function() {
var  formatNumber = function(num,type) {
        var numSplit, int, dec, type;

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length-3) + ','+ int.substr(int.length - 3,3);
        }
        dec = numSplit[1];
        return (type === 'exp' ? '-' : '+') + ' '+ int + '.'+ dec;
    };
   return {
       getInput:function() {
           return {
            type: document.querySelector('.add__type').value,
            description: document.querySelector('.add__description').value,
            value: parseFloat(document.querySelector('.add__value').value)
           };
       },

       addListItemLocalStorage: function(arr){
           arr.map(item => {
           var html, element;
           element = document.querySelector('.income__list');
           html = `<div class="item clearfix" id="inc-${item.id}"> 
           <div class="item__description">${item.description}</div><div class="right clearfix">
           <div class="item__value">+${item.value}</div><div class="item__delete">
           <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
           element.insertAdjacentHTML('beforeend', html);
           });
           
        },

       addListItem: function(obj, type){
         // Create HTML strings with placeholder text
        
         var html, newHtml, element;
        
         if(type === 'inc'){
            element = document.querySelector('.income__list'); 
            html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

         } else if(type === 'exp') {
            element = document.querySelector('.expenses__list');
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
         }

         
         // Replace placeholder with data
          newHtml = html.replace('%id%', obj.id);
          newHtml = newHtml.replace('%description%', obj.description);
          newHtml = newHtml.replace('%value%', formatNumber(obj.value));
         // Insert the HTML into the DOM
         element.insertAdjacentHTML('beforeend', newHtml);
        },
        
        deleteListItem: function(selectorId) {
          var el = document.getElementById(selectorId);
          el.parentNode.removeChild(el);
        },

        clearFields: function(){
         var inputs, inputFields;
         inputs = document.querySelectorAll('input');
         inputFields = Array.prototype.slice.call(inputs);
         inputFields.forEach(element => {
             element.value = '';
         });
         inputFields[0].focus();
        },

        displayBudget: function(obj){
            var divBudget = document.querySelector('.budget__value');
            divBudget.textContent = `${obj.budget}`;

            var divIncome = document.querySelector('.budget__income--value');
            divIncome.textContent = `+${obj.totalIncome}`;

            var divExpenses = document.querySelector('.budget__expenses--value');
            divExpenses.textContent = `-${obj.totalExpenses}`;

            var divPercentage = document.querySelector('.budget__expenses--percentage');
            if (obj.percentage > 0){
            divPercentage.textContent = `${obj.percentage}%`;
            } else {
            divPercentage.textContent = `---`;
            }
           
        },
        displayItems: function(obj){
           
        },
        displayPercentage: function(percentages) {
            var percentageFields = document.querySelectorAll('.item__percentage');
            var nodeListForEach = function(list, callback){
                for (i=0; i<list.length;i++){
                    callback(list[i], i);
                }
            };
            nodeListForEach(percentageFields, function(item,index){
                if(percentages[index] > 0){
                    item.textContent = percentages[index] + '%';
                } else {
                    item.textContent = '---';
                }
            });
            
        },
        displayMonth: function() {
            var element, date, month, year;
            element = document.querySelector('.budget__title--month');
            date = new Date();
            year = date.getFullYear();
            month = [];
            month[0] = "January";
            month[1] = "February";
            month[2] = "March";
            month[3] = "April";
            month[4] = "May";
            month[5] = "June";
            month[6] = "July";
            month[7] = "August";
            month[8] = "September";
            month[9] = "October";
            month[10] = "November";
            month[11] = "December";
            element.textContent = `${month[date.getMonth()]} ${year}`;
        }
   }
})();


//Budget Controller
var budgetController = (function() {
   var Expense = function (id, description, value){
       this.id = id;
       this.description = description;
       this.value = value;
       this.percentage = -1;
   };
   Expense.prototype.calcPercentage = function(totalIncome){
       if(totalIncome > 0) {
           this.percentage = Math.round((this.value / totalIncome) * 100);
       } else {
           this.percentage = -1;
       }
   };
   Expense.prototype.getPercentage = function() {
       return this.percentage;
   };

   var Income = function(id, description, value){
       this.id = id;
       this.description = description;
       this.value = value;
   };
   var calculateTotal = function(type){
       var sum = 0;
       data.allItems[type].forEach(item => {
           return sum += item.value;
       })
       data.totals[type] = sum;
   }
   var data = {
       allItems : {
           exp: [],
           inc:[]
       },
       totals : {
           exp:0,
           inc:0
       },
       budget: 0,
       percentage:-1
   }

   
   return {
       addItem: function(type, des, val){
           var newItem, ID;
           //Create new ID
           if (data.allItems[type].length > 0) {
            ID = data.allItems[type][data.allItems[type].length - 1].id +1;
           } else {
               ID = 0;
           }
         
           //Create new item based on type
           if (type === 'exp'){
               newItem = new Expense(ID, des, val);
           }else if (type === 'inc'){
               newItem = new Income(ID, des, val);
           }
           //Push item into data structure array
           data.allItems[type].push(newItem);
           return newItem;
       },
       deleteItem: function(type, id) {
           var ids, index;
           ids = data.allItems[type].map(item =>item.id);
           index = ids.indexOf(id);
           if (index !== -1) {
               data.allItems[type].splice(index,1);
           }
       },
       calculateBudget: function(){
          // Calculate total income and expenses
          calculateTotal('exp');
          calculateTotal('inc');
          // Calculate the budget:income - expenses
          data.budget = data.totals.inc - data.totals.exp;
          //Calculate the percentage of income we spent
          if (data.totals.inc > 0) {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
          } else {
              data.percentage = -1;
          }
         
          
       },
       calculatePercentages: function() {
          data.allItems.exp.forEach(item => {
             item.calcPercentage(data.totals.inc);
          });
       },
       getPercentages: function() {
           var allPerc = data.allItems.exp.map(item => item.getPercentage());
           return allPerc;
       },

       getBudget: function(){
           return{
             budget: data.budget,
             totalIncome: data.totals.inc,
             totalExpenses: data.totals.exp,
             percentage: data.percentage
           }
       },
    
       setLocalStorage: function(){
           localStorage.setItem("myData", JSON.stringify(data));
       },
   }

})();

// General Controller
var controller = (function(UICtrl, BudgetCtrl) {
    var setupEventListeners = function() {
        document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector('.container').addEventListener('click', ctrlDeleteItem);
    }
    var updateBudget = function (){
        // Calculate the budget
         BudgetCtrl.calculateBudget();
        //Return the budget
         var budget = BudgetCtrl.getBudget();
        //Display the budget
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
        //1. Calculate percentages
        BudgetCtrl.calculatePercentages();
        //.2 Read percentages from budgte controller
        var percentages = BudgetCtrl.getPercentages();
        //3. Update UI
        UICtrl.displayPercentage(percentages);
    }
    var ctrlAddItem = function() {
       
        //1.Get the input data
        var input = UICtrl.getInput();

        if ( input.description !== '' && !isNaN(input.value) && input.value > 0) {
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
        };
    }
    var ctrlDeleteItem = function(e) {
        var itemId, splitId;
        itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            // split the string
            splitId = itemId.split('-')
            type = splitId[0];
            ID = parseInt(splitId[1]);
            console.log(splitId);
            console.log(type);
            //1. Delete the item from the structure
            BudgetCtrl.deleteItem(type, ID);
            //2. Delete the item from UI
            UICtrl.deleteListItem(itemId);
            //3. Update budget
            updateBudget();
            //4. Update percentages
            updatePercentages();
        }
    }  
    return {
        init: function() {
            console.log('app started');
            UICtrl.displayMonth();

           
            if(localStorage.getItem("myData") !== null){
                var dataStorage = JSON.parse(localStorage.getItem("myData"));
                console.log(dataStorage.allItems);
                UICtrl.displayBudget({
                   /* allItems: dataStorage.allItems,   */
                    budget: dataStorage.budget, 
                    percentage: dataStorage.percentage,
                    totalIncome: dataStorage.totals.inc,
                    totalExpenses: dataStorage.totals.exp  
                });
                var income = dataStorage.allItems.inc;
                UICtrl.addListItemLocalStorage(income);

               
                
            } else {
               UICtrl.displayBudget({
                    budget: 0,
                    totalIncome: 0,
                    totalExpenses: 0,
                    percentage: -1
                   });
            };
          
            setupEventListeners();
        }
    }

})(UIController,budgetController);

controller.init();
