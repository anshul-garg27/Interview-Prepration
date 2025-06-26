# 🧠 Dynamic Programming: The Amazon Strategy Optimizer

## 🎯 Mental Model: The "Amazon Business Intelligence" Framework

Think of DP like **Amazon's strategic decision-making process** - learning from past decisions to optimize future outcomes, avoiding redundant calculations, and building solutions incrementally.

```
🏢 AMAZON QUARTERLY PLANNING
   
Past Quarters → Current Analysis → Future Optimization
     Q1-Q4           Q5                Q6-Q8
   (memoized)    (decision point)    (optimal strategy)
   
Key Insight: "Don't recalculate market analysis - 
              use insights from previous quarters!"
```

## 🎨 Visual DP Pattern Recognition

### Pattern 1: Fibonacci Family (The "Growth Metrics" Model)
```python
def amazon_user_growth_prediction(months):
    """
    Amazon Context: Predicting user growth using historical patterns
    
    Business Logic:
    - Month N users = Month N-1 users + Month N-2 new acquisitions
    - Classic Fibonacci pattern in business growth
    
    DP Insight: Don't recalculate previous months' data!
    """
    if months <= 2:
        return months * 1000000  # Base case: 1M, 2M users
    
    # Space-optimized DP (O(1) space instead of O(n))
    prev2_month = 1000000  # Month 1
    prev1_month = 2000000  # Month 2
    
    for month in range(3, months + 1):
        current_month = prev1_month + prev2_month
        prev2_month, prev1_month = prev1_month, current_month
    
    return prev1_month

# Visual representation:
# Month:  1    2    3    4    5    6
# Users: 1M → 2M → 3M → 5M → 8M → 13M
#              ↑    ↑    ↑    ↑
#              Fibonacci pattern!
```

### Pattern 2: House Robber (The "Investment Strategy" Model)
```python
def amazon_investment_optimization(quarterly_profits):
    """
    Amazon Context: Optimizing investment in quarters
    
    Business Rule: Can't invest in consecutive quarters 
    (need cash flow buffer)
    
    Decision at each quarter:
    - Invest this quarter + best from 2 quarters ago, OR
    - Skip this quarter + best from last quarter
    """
    if not quarterly_profits:
        return 0
    if len(quarterly_profits) == 1:
        return quarterly_profits[0]
    
    # DP state: max investment up to current quarter
    prev2 = quarterly_profits[0]  # Best with first quarter only
    prev1 = max(quarterly_profits[0], quarterly_profits[1])  # Best with first two
    
    for i in range(2, len(quarterly_profits)):
        current_best = max(
            prev1,  # Don't invest this quarter
            prev2 + quarterly_profits[i]  # Invest this quarter
        )
        prev2, prev1 = prev1, current_best
    
    return prev1

# Decision tree visualization:
# Q1: $10M  Q2: $5M   Q3: $8M   Q4: $12M
#     ↓      ↓        ↓         ↓
#   Take   Skip     Take      Take
#    OR     OR       OR        OR  
#   Skip   Take     Skip      Skip
# 
# Optimal: Take Q1 + Q3 + Q4 = $30M
```

### Pattern 3: Coin Change (The "Resource Allocation" Model)
```python
def amazon_logistics_cost_optimization(delivery_vehicles, target_packages):
    """
    Amazon Context: Minimum delivery vehicles needed for target packages
    
    Vehicle types: [Small: 5 packages, Medium: 10, Large: 25]
    Goal: Deliver exactly 'target_packages' with minimum vehicles
    
    DP Pattern: For each package count, what's the minimum vehicles?
    """
    if target_packages == 0:
        return 0
    
    # DP array: dp[i] = minimum vehicles for i packages
    dp = [float('inf')] * (target_packages + 1)
    dp[0] = 0  # 0 vehicles for 0 packages
    
    vehicle_capacities = [5, 10, 25]  # Small, Medium, Large
    
    for vehicle_capacity in vehicle_capacities:
        for packages in range(vehicle_capacity, target_packages + 1):
            if dp[packages - vehicle_capacity] != float('inf'):
                dp[packages] = min(dp[packages], 
                                 dp[packages - vehicle_capacity] + 1)
    
    return dp[target_packages] if dp[target_packages] != float('inf') else -1

# DP table visualization for target = 30 packages:
# Packages:  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 20 25 30
# Vehicles:  0  ∞  ∞  ∞  ∞  1  ∞  ∞  ∞  ∞  1  ∞  ∞  ∞  ∞  2  2  1  2
#                         ↑           ↑                    ↑     ↑  ↑
#                      Small        Medium              2xMed Large 2xLarge
```

## 🚀 Advanced DP Patterns

### The "Amazon Pricing Strategy" Problem
```python
def dynamic_pricing_optimization(customer_demands, price_points, max_price_changes):
    """
    Amazon Context: Optimize pricing strategy over time periods
    
    Problem: Given customer demand at different price points,
    maximize revenue with limited price change opportunities
    
    State: dp[day][price_level][changes_used] = max_revenue
    """
    days = len(customer_demands)
    price_levels = len(price_points)
    
    # 3D DP: [day][price_level][changes_used]
    dp = {}
    
    def max_revenue(day, current_price, changes_used):
        if day >= days:
            return 0
        
        if (day, current_price, changes_used) in dp:
            return dp[(day, current_price, changes_used)]
        
        # Option 1: Keep same price
        keep_same = (customer_demands[day][current_price] * price_points[current_price] + 
                    max_revenue(day + 1, current_price, changes_used))
        
        best_revenue = keep_same
        
        # Option 2: Change price (if changes available)
        if changes_used < max_price_changes:
            for new_price in range(price_levels):
                if new_price != current_price:
                    change_price = (customer_demands[day][new_price] * price_points[new_price] + 
                                  max_revenue(day + 1, new_price, changes_used + 1))
                    best_revenue = max(best_revenue, change_price)
        
        dp[(day, current_price, changes_used)] = best_revenue
        return best_revenue
    
    # Try starting with each price point
    return max(max_revenue(0, price, 0) for price in range(price_levels))
```

### The "Supply Chain Optimization" Problem
```python
def warehouse_inventory_optimization(demand_forecast, warehouse_costs, transfer_costs):
    """
    Amazon Context: Optimize inventory distribution across warehouses
    
    Complex DP with multiple dimensions:
    - Time periods (demand changes)
    - Warehouse locations (storage costs vary)
    - Inventory levels (holding costs)
    - Transfer decisions (shipping costs)
    """
    
    def solve_inventory_dp():
        num_days = len(demand_forecast)
        num_warehouses = len(warehouse_costs)
        max_inventory = max(max(day_demand) for day_demand in demand_forecast)
        
        # State: dp[day][warehouse][inventory_level] = min_cost
        dp = {}
        
        def min_cost(day, warehouse, inventory):
            if day >= num_days:
                return 0  # No more costs after final day
            
            state = (day, warehouse, inventory)
            if state in dp:
                return dp[state]
            
            daily_demand = demand_forecast[day][warehouse]
            
            # Can we fulfill demand from current inventory?
            if inventory >= daily_demand:
                # Fulfill from inventory
                remaining_inventory = inventory - daily_demand
                holding_cost = warehouse_costs[warehouse] * remaining_inventory
                
                future_cost = min_cost(day + 1, warehouse, remaining_inventory)
                total_cost = holding_cost + future_cost
            else:
                # Need to transfer inventory or backorder
                total_cost = float('inf')
                
                # Try transferring from other warehouses
                for source_warehouse in range(num_warehouses):
                    if source_warehouse != warehouse:
                        transfer_amount = daily_demand - inventory
                        transfer_cost = transfer_costs[source_warehouse][warehouse] * transfer_amount
                        
                        new_inventory = inventory + transfer_amount - daily_demand
                        holding_cost = warehouse_costs[warehouse] * new_inventory
                        
                        future_cost = min_cost(day + 1, warehouse, new_inventory)
                        total_cost = min(total_cost, transfer_cost + holding_cost + future_cost)
            
            dp[state] = total_cost
            return total_cost
        
        # Find minimum cost starting from each warehouse with initial inventory
        return min(min_cost(0, w, max_inventory // 2) for w in range(num_warehouses))
    
    return solve_inventory_dp()
```

## 🧠 Cognitive Frameworks for DP

### The "Amazon Decision Tree" Model
```
Every DP problem = Strategic business decision

Question Framework:
1. What are my OPTIONS at each step?
   (Recurrence relation)
   
2. What INFORMATION do I need to make decisions?
   (State variables)
   
3. What's the GOAL I'm optimizing for?
   (Objective function)
   
4. What are the BASE CASES?
   (Boundary conditions)
   
5. Can I REUSE previous calculations?
   (Memoization opportunity)
```

### The "AWS Cost Optimization" Analogy
```python
def aws_resource_optimization_mindset():
    """
    DP Thinking = AWS Cost Optimization
    
    1. IDENTIFY PATTERNS
       - Recurring resource needs
       - Peak usage times
       - Baseline requirements
    
    2. CACHE CALCULATIONS
       - Don't recalculate instance costs
       - Store optimization results
       - Reuse configuration templates
    
    3. BUILD INCREMENTALLY
       - Start with basic setup
       - Add optimizations layer by layer
       - Scale based on proven patterns
    
    4. AVOID REDUNDANCY
       - Don't spin up duplicate resources
       - Share common infrastructure
       - Consolidate similar workloads
    """
    pass
```

## 🎭 Creative DP Problem Solving

### The "Amazon Marketplace" Approach
```python
def marketplace_seller_strategy(daily_prices, transaction_fees, holding_costs):
    """
    Amazon Context: When should a seller buy/sell inventory?
    
    DP Insight: Each day, seller can:
    1. Buy inventory (if profitable later)
    2. Sell inventory (if profit exceeds holding costs)
    3. Hold inventory (wait for better prices)
    
    State: dp[day][holding_inventory] = max_profit
    """
    
    def max_profit_strategy(day, has_inventory):
        if day >= len(daily_prices):
            return 0
        
        if (day, has_inventory) in memo:
            return memo[(day, has_inventory)]
        
        # Option 1: Do nothing today
        do_nothing = max_profit_strategy(day + 1, has_inventory)
        
        max_profit = do_nothing
        
        if has_inventory:
            # Option 2: Sell inventory
            sell_profit = (daily_prices[day] - transaction_fees[day] + 
                          max_profit_strategy(day + 1, False))
            max_profit = max(max_profit, sell_profit)
        else:
            # Option 2: Buy inventory
            buy_cost = (-daily_prices[day] - transaction_fees[day] + 
                       max_profit_strategy(day + 1, True))
            max_profit = max(max_profit, buy_cost)
        
        memo[(day, has_inventory)] = max_profit
        return max_profit
    
    memo = {}
    return max_profit_strategy(0, False)
```

## 🎯 Amazon Leadership Principles in DP

### Customer Obsession in DP Design
```python
def customer_focused_dp_solution(problem_constraints):
    """
    Customer Obsession: Ensure DP solution scales for customer needs
    
    Considerations:
    - Will this work for 1 customer? 1 million customers?
    - Can we handle edge cases gracefully?
    - Is the solution fast enough for real-time decisions?
    """
    
    def scalable_dp_implementation(inputs):
        # Input validation (customer safety)
        if not inputs or any(x < 0 for x in inputs if isinstance(x, (int, float))):
            return {"error": "Invalid input - protecting customer experience"}
        
        # Memory management (customer performance)
        max_memory_usage = 100000  # Reasonable limit
        if len(inputs) > max_memory_usage:
            return {"error": "Input too large - using approximation algorithm instead"}
        
        # Standard DP with customer-friendly error handling
        try:
            dp_result = solve_dp_problem(inputs)
            return {"success": True, "result": dp_result, "method": "exact"}
        except MemoryError:
            return {"success": True, "result": approximate_solution(inputs), "method": "approximation"}
    
    return scalable_dp_implementation
```

### Ownership in DP Code Quality
```python
def production_ready_dp_template():
    """
    Ownership: Write DP code that works reliably in production
    
    Best practices for Amazon-scale DP:
    """
    
    def robust_dp_solution(problem_input):
        # Clear state definition
        memo = {}  # State -> optimal_value
        
        def dp_solver(state_variables):
            # Input validation
            if not self.is_valid_state(state_variables):
                raise ValueError(f"Invalid state: {state_variables}")
            
            # Base cases (clearly documented)
            if self.is_base_case(state_variables):
                return self.get_base_value(state_variables)
            
            # Memoization check
            state_key = self.serialize_state(state_variables)
            if state_key in memo:
                return memo[state_key]
            
            # Recurrence relation (with clear business logic)
            optimal_value = float('-inf')  # or appropriate initial value
            
            for possible_action in self.get_possible_actions(state_variables):
                next_state = self.apply_action(state_variables, possible_action)
                action_value = self.get_action_cost(possible_action) + dp_solver(next_state)
                optimal_value = max(optimal_value, action_value)  # or min for minimization
            
            # Store result
            memo[state_key] = optimal_value
            return optimal_value
        
        return dp_solver(problem_input)
    
    return robust_dp_solution
```

## 🎨 ASCII Art DP Visualizations

### Coin Change DP Table:
```
Target Amount: 11, Coins: [1, 2, 5]

DP Table Construction:
Amount:  0  1  2  3  4  5  6  7  8  9 10 11
Coins 1: 0  1  2  3  4  5  6  7  8  9 10 11
Coins 2: 0  1  1  2  2  3  3  4  4  5  5  6
Coins 5: 0  1  1  2  2  1  2  2  3  3  2  3
         ↑              ↑           ↑
      Base             5¢           10¢=2×5¢

Final answer: 3 coins (5¢ + 5¢ + 1¢)
```

### House Robber Decision Path:
```
Houses: [2, 7, 9, 3, 1]
Values: [2, 7, 9, 3, 1]

Decision Tree:
House 0: Rob(2) vs Skip(0)
        /              \
   Rob(2)+...      Skip(0)+...
      |                |
House 1: Skip        Rob(7) vs Skip
        |             /        \
   House 2: Rob(9)  Rob(7)+... Skip+...

Optimal Path: Skip, Rob(7), Rob(9), Skip, Rob(1) = 17
Visual: [Skip, Take, Take, Skip, Take]
```

This approach transforms DP from abstract recursion into strategic Amazon business thinking!
