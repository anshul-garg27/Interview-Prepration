# 🎮 Game Theory & Minimax - Complete Strategy Guide

## 📚 What is Game Theory?

Game theory studies mathematical models of strategic interaction between rational decision-makers. In programming interviews, it often appears in problems involving optimal play, winner determination, and strategy optimization.

### Key Concepts:
```
Zero-Sum Games: One player's gain equals another's loss
Minimax: Minimize the maximum possible loss
Alpha-Beta Pruning: Optimization technique for minimax
Nash Equilibrium: Strategy where no player benefits from changing
Optimal Strategy: Best possible play assuming rational opponents
```

## 🎯 Pattern 1: Nim Game and Grundy Numbers

### The Classic Nim Game:
```
Rules:
- Players take turns removing 1, 2, or 3 stones from a pile
- Player who takes the last stone wins
- Both players play optimally

Example with 4 stones:
Player 1 can take: 1 stone (3 left), 2 stones (2 left), or 3 stones (1 left)
If Player 1 takes 1 stone → Player 2 faces 3 stones
If Player 2 is optimal, they take 2 stones → Player 1 faces 1 stone → Player 1 wins

Winning/Losing positions:
0 stones: Losing (already lost)
1 stone: Winning (take 1, opponent gets 0)
2 stones: Winning (take 2, opponent gets 0)
3 stones: Winning (take 3, opponent gets 0)
4 stones: Losing (any move gives opponent winning position)
```

### Implementation:
```python
def nim_game_basic(n):
    """Determine if current player can win Nim game with n stones"""
    print(f"Nim Game Analysis for {n} stones:")
    
    # Base cases
    if n <= 3:
        print(f"  {n} ≤ 3: Current player can take all stones and WIN")
        return True
    
    # Check if n is multiple of 4
    if n % 4 == 0:
        print(f"  {n} is multiple of 4: Current player will LOSE with optimal play")
        print(f"  Reason: Whatever current player takes (1,2,3), opponent can")
        print(f"  take (3,2,1) respectively to maintain multiple of 4 for current player")
        return False
    else:
        remainder = n % 4
        print(f"  {n} mod 4 = {remainder}: Current player can WIN")
        print(f"  Strategy: Take {remainder} stones to leave multiple of 4 for opponent")
        return True

def analyze_nim_positions(max_n):
    """Analyze winning/losing positions for different stone counts"""
    print(f"Nim Game Position Analysis (1 to {max_n} stones):")
    print("Position | Can Win? | Strategy")
    print("-" * 35)
    
    for n in range(1, max_n + 1):
        can_win = nim_game_basic(n)
        
        if n <= 3:
            strategy = f"Take all {n} stones"
        elif n % 4 == 0:
            strategy = "Cannot win with optimal opponent"
        else:
            take = n % 4
            strategy = f"Take {take} stones"
        
        print(f"{n:8} | {str(can_win):8} | {strategy}")

# Test Nim game analysis
analyze_nim_positions(12)
```

### Generalized Nim with Multiple Piles:
```python
def nim_multiple_piles(piles):
    """Solve Nim game with multiple piles using XOR (Nim-sum)"""
    print(f"Multiple pile Nim analysis: {piles}")
    
    nim_sum = 0
    print("Calculating Nim-sum (XOR of all pile sizes):")
    
    for i, pile in enumerate(piles):
        nim_sum ^= pile
        print(f"  After pile {i+1} ({pile}): nim-sum = {nim_sum} (binary: {bin(nim_sum)})")
    
    if nim_sum == 0:
        print("Nim-sum = 0: Current player is in LOSING position")
        print("All moves will give opponent a winning position")
        return False, None
    else:
        print("Nim-sum ≠ 0: Current player is in WINNING position")
        
        # Find winning move
        for i, pile in enumerate(piles):
            # Calculate what this pile should be to make nim-sum 0
            target = pile ^ nim_sum
            if target < pile:
                move = pile - target
                print(f"Winning move: Take {move} from pile {i+1} (reduce {pile} to {target})")
                return True, (i, move)
        
    return True, None

# Test multiple pile Nim
test_piles = [3, 4, 5]
can_win, move = nim_multiple_piles(test_piles)
```

## 🎯 Pattern 2: Minimax Algorithm

### Concept:
```
Minimax evaluates game positions by:
1. Maximizing player tries to maximize the score
2. Minimizing player tries to minimize the score
3. Recursively evaluate all possible moves
4. Choose move that gives best guaranteed outcome

Game Tree Example (Tic-Tac-Toe):
                Current Position
               /       |        \
         Move 1      Move 2     Move 3
         /    \      /    \     /    \
    Win(-1) Draw(0) Lose(+1) Win(-1) ...
```

### Basic Minimax Implementation:
```python
def minimax_tic_tac_toe():
    """Minimax for Tic-Tac-Toe game"""
    
    def evaluate_board(board):
        """Evaluate final board position"""
        # Check rows, columns, diagonals for winner
        lines = [
            [board[0], board[1], board[2]],  # Row 1
            [board[3], board[4], board[5]],  # Row 2
            [board[6], board[7], board[8]],  # Row 3
            [board[0], board[3], board[6]],  # Col 1
            [board[1], board[4], board[7]],  # Col 2
            [board[2], board[5], board[8]],  # Col 3
            [board[0], board[4], board[8]],  # Diagonal 1
            [board[2], board[4], board[6]]   # Diagonal 2
        ]
        
        for line in lines:
            if line[0] == line[1] == line[2] != ' ':
                return 10 if line[0] == 'X' else -10
        
        return 0  # Draw or game not finished
    
    def is_board_full(board):
        """Check if board is full"""
        return ' ' not in board
    
    def minimax(board, depth, is_maximizing, alpha=float('-inf'), beta=float('inf')):
        """Minimax algorithm with alpha-beta pruning"""
        score = evaluate_board(board)
        
        # Base cases
        if score == 10:  # X wins
            return score - depth  # Prefer faster wins
        if score == -10:  # O wins
            return score + depth  # Prefer slower losses
        if is_board_full(board):  # Draw
            return 0
        
        if is_maximizing:  # X's turn (maximizing player)
            max_eval = float('-inf')
            
            for i in range(9):
                if board[i] == ' ':
                    board[i] = 'X'
                    eval_score = minimax(board, depth + 1, False, alpha, beta)
                    board[i] = ' '  # Undo move
                    
                    max_eval = max(max_eval, eval_score)
                    alpha = max(alpha, eval_score)
                    
                    if beta <= alpha:  # Alpha-beta pruning
                        break
            
            return max_eval
        
        else:  # O's turn (minimizing player)
            min_eval = float('inf')
            
            for i in range(9):
                if board[i] == ' ':
                    board[i] = 'O'
                    eval_score = minimax(board, depth + 1, True, alpha, beta)
                    board[i] = ' '  # Undo move
                    
                    min_eval = min(min_eval, eval_score)
                    beta = min(beta, eval_score)
                    
                    if beta <= alpha:  # Alpha-beta pruning
                        break
            
            return min_eval
    
    def find_best_move(board, player):
        """Find best move for given player"""
        best_move = -1
        best_value = float('-inf') if player == 'X' else float('inf')
        
        print(f"Finding best move for player {player}:")
        print("Current board:")
        for i in range(3):
            print(f"  {board[i*3]} | {board[i*3+1]} | {board[i*3+2]}")
            if i < 2:
                print("  ---------")
        
        for i in range(9):
            if board[i] == ' ':
                board[i] = player
                move_value = minimax(board, 0, player == 'O')  # Next turn is opposite player
                board[i] = ' '  # Undo move
                
                print(f"  Move {i}: value = {move_value}")
                
                if player == 'X' and move_value > best_value:
                    best_value = move_value
                    best_move = i
                elif player == 'O' and move_value < best_value:
                    best_value = move_value
                    best_move = i
        
        print(f"Best move: position {best_move} with value {best_value}")
        return best_move
    
    # Test with sample board
    test_board = ['X', 'O', ' ',
                  ' ', 'X', ' ',
                  ' ', ' ', 'O']
    
    best_move = find_best_move(test_board, 'X')
    return best_move

# Test minimax
minimax_tic_tac_toe()
```

## 🎯 Pattern 3: Dynamic Game Theory

### Stone Game Problem:
```python
def stone_game_dp(piles):
    """Solve stone game using dynamic programming"""
    n = len(piles)
    
    print(f"Stone Game with piles: {piles}")
    print("Each player tries to maximize their score")
    
    # dp[i][j] = max score difference (current player - opponent) for piles[i:j+1]
    dp = [[0] * n for _ in range(n)]
    
    # Base case: single pile
    for i in range(n):
        dp[i][i] = piles[i]
        print(f"Single pile {i}: value = {piles[i]}")
    
    # Fill DP table for increasing lengths
    print("\nFilling DP table:")
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            # Take from left: piles[i] - dp[i+1][j] (opponent's best on remaining)
            take_left = piles[i] - dp[i + 1][j]
            
            # Take from right: piles[j] - dp[i][j-1] (opponent's best on remaining)
            take_right = piles[j] - dp[i][j - 1]
            
            dp[i][j] = max(take_left, take_right)
            
            print(f"  dp[{i}][{j}] (piles {piles[i:j+1]}): ")
            print(f"    Take left ({piles[i]}): {piles[i]} - {dp[i+1][j]} = {take_left}")
            print(f"    Take right ({piles[j]}): {piles[j]} - {dp[i][j-1]} = {take_right}")
            print(f"    Best choice: {dp[i][j]}")
    
    # Print final DP table
    print("\nFinal DP table:")
    print("   ", end="")
    for j in range(n):
        print(f"{j:4}", end="")
    print()
    
    for i in range(n):
        print(f"{i}: ", end="")
        for j in range(n):
            if j >= i:
                print(f"{dp[i][j]:4}", end="")
            else:
                print("   -", end="")
        print()
    
    result = dp[0][n - 1] > 0
    print(f"\nFirst player {'wins' if result else 'loses'}")
    print(f"Score difference: {dp[0][n - 1]}")
    
    return result

# Test stone game
test_piles = [5, 3, 4, 5]
stone_game_dp(test_piles)
```

## 🎯 Pattern 4: Game State Representation

### Coin Game Analysis:
```python
def coin_game_analysis():
    """Analyze coin game with different strategies"""
    
    def can_win_simple(n):
        """Simple coin game: take 1 or 2 coins, last player wins"""
        # If n is multiple of 3, current player loses
        return n % 3 != 0
    
    def optimal_strategy_simple(n):
        """Find optimal move for simple coin game"""
        if n % 3 == 0:
            return None  # Losing position
        
        # Make opponent face multiple of 3
        if n % 3 == 1:
            return 1  # Take 1 coin
        else:  # n % 3 == 2
            return 2  # Take 2 coins
    
    def can_win_fibonacci(n):
        """Fibonacci coin game: can take any Fibonacci number of coins"""
        if n == 0:
            return False
        
        # Generate Fibonacci numbers up to n
        fibs = [1, 2]
        while fibs[-1] < n:
            fibs.append(fibs[-1] + fibs[-2])
        
        # Use memoization to solve
        memo = {}
        
        def solve(remaining):
            if remaining == 0:
                return False
            
            if remaining in memo:
                return memo[remaining]
            
            # Try taking each valid Fibonacci number
            for fib in fibs:
                if fib > remaining:
                    break
                
                # If opponent loses after our move, we win
                if not solve(remaining - fib):
                    memo[remaining] = True
                    return True
            
            memo[remaining] = False
            return False
        
        return solve(n)
    
    print("Game Theory Analysis:")
    print("="*50)
    
    # Simple coin game analysis
    print("Simple Coin Game (take 1 or 2 coins):")
    for n in range(1, 13):
        can_win = can_win_simple(n)
        strategy = optimal_strategy_simple(n)
        
        print(f"  {n} coins: {'Win' if can_win else 'Lose'}", end="")
        if strategy:
            print(f" (take {strategy})")
        else:
            print(" (any move loses)")
    
    print("\nFibonacci Coin Game:")
    for n in range(1, 13):
        can_win = can_win_fibonacci(n)
        print(f"  {n} coins: {'Win' if can_win else 'Lose'}")

coin_game_analysis()
```

## 🎯 Pattern 5: Adversarial Search

### Alpha-Beta Pruning Visualization:
```python
def alpha_beta_demo():
    """Demonstrate alpha-beta pruning with game tree"""
    
    class GameNode:
        def __init__(self, value=None, children=None):
            self.value = value
            self.children = children or []
    
    def alpha_beta_search(node, depth, alpha, beta, maximizing_player, path=""):
        """Alpha-beta search with detailed logging"""
        print(f"{'  ' * depth}Visiting node {path}")
        print(f"{'  ' * depth}Alpha: {alpha}, Beta: {beta}")
        
        if not node.children:  # Leaf node
            print(f"{'  ' * depth}Leaf value: {node.value}")
            return node.value
        
        if maximizing_player:
            max_eval = float('-inf')
            
            for i, child in enumerate(node.children):
                child_path = f"{path}{i}"
                eval_score = alpha_beta_search(child, depth + 1, alpha, beta, False, child_path)
                max_eval = max(max_eval, eval_score)
                alpha = max(alpha, eval_score)
                
                print(f"{'  ' * depth}Max node: current max = {max_eval}, alpha = {alpha}")
                
                if beta <= alpha:
                    print(f"{'  ' * depth}Beta cutoff! Pruning remaining children")
                    break
            
            return max_eval
        
        else:
            min_eval = float('inf')
            
            for i, child in enumerate(node.children):
                child_path = f"{path}{i}"
                eval_score = alpha_beta_search(child, depth + 1, alpha, beta, True, child_path)
                min_eval = min(min_eval, eval_score)
                beta = min(beta, eval_score)
                
                print(f"{'  ' * depth}Min node: current min = {min_eval}, beta = {beta}")
                
                if beta <= alpha:
                    print(f"{'  ' * depth}Alpha cutoff! Pruning remaining children")
                    break
            
            return min_eval
    
    # Create sample game tree
    #           Max
    #       /    |    \
    #     Min   Min   Min
    #    / |   / |   / |
    #   3  5  2  8  1  4
    
    root = GameNode(children=[
        GameNode(children=[
            GameNode(value=3),
            GameNode(value=5)
        ]),
        GameNode(children=[
            GameNode(value=2),
            GameNode(value=8)
        ]),
        GameNode(children=[
            GameNode(value=1),
            GameNode(value=4)
        ])
    ])
    
    print("Alpha-Beta Pruning Demonstration:")
    print("Game tree structure:")
    print("        Max")
    print("    /    |    \\")
    print("  Min   Min   Min")
    print(" / |   / |   / |")
    print("3  5  2  8  1  4")
    print()
    
    result = alpha_beta_search(root, 0, float('-inf'), float('inf'), True, "root")
    print(f"\nFinal result: {result}")

alpha_beta_demo()
```

## 📊 Game Theory Algorithm Complexities

```
Algorithm           Time Complexity    Space Complexity    Use Case
Minimax            O(b^d)             O(d)                Small game trees
Alpha-Beta         O(b^(d/2))         O(d)                Medium game trees
Monte Carlo TS     O(n)               O(1)                Large state spaces
Dynamic Programming O(n²)             O(n²)               Optimal substructure
Memoization        O(states)          O(states)           Overlapping subproblems

Where:
b = branching factor (average moves per position)
d = depth of game tree
n = problem size
```

## 🎯 Practice Problems

### Easy:
1. **Nim Game** (LeetCode 292)
2. **Stone Game** (LeetCode 877)
3. **Flip Game** (LeetCode 293)
4. **Can I Win** (LeetCode 464)

### Medium:
1. **Stone Game II** (LeetCode 1140)
2. **Predict the Winner** (LeetCode 486)
3. **Stone Game III** (LeetCode 1406)
4. **Jump Game** (LeetCode 55)

### Hard:
1. **Stone Game IV** (LeetCode 1510)
2. **Cherry Pickup** (LeetCode 741)
3. **Minimum Cost to Cut a Stick** (LeetCode 1547)
4. **Stone Game VI** (LeetCode 1686)

## 📝 Quick Templates

### Basic Game Theory Check:
```python
def can_win(n):
    # Find pattern in small cases
    if n % k == losing_remainder:
        return False
    return True
```

### Minimax Template:
```python
def minimax(state, depth, is_maximizing):
    if is_terminal(state):
        return evaluate(state)
    
    if is_maximizing:
        max_eval = float('-inf')
        for move in get_moves(state):
            eval_score = minimax(make_move(state, move), depth + 1, False)
            max_eval = max(max_eval, eval_score)
        return max_eval
    else:
        min_eval = float('inf')
        for move in get_moves(state):
            eval_score = minimax(make_move(state, move), depth + 1, True)
            min_eval = min(min_eval, eval_score)
        return min_eval
```

### DP Game Template:
```python
def game_dp(arr):
    n = len(arr)
    dp = [[0] * n for _ in range(n)]
    
    # Base case: single elements
    for i in range(n):
        dp[i][i] = arr[i]
    
    # Fill for increasing lengths
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = max(arr[i] - dp[i+1][j], arr[j] - dp[i][j-1])
    
    return dp[0][n-1] >= 0
```

This comprehensive guide covers all essential game theory and minimax concepts with detailed explanations and strategic analysis!
