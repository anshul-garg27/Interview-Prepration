# 🔢 Number Theory & Mathematical Algorithms - Complete Guide

## 📚 What is Number Theory in Programming?

### 🤔 **Mathematical Algorithms - Why They Matter in Interviews**

**Real-World Analogy**: Like a mathematician's toolkit
- **Prime numbers**: Building blocks of all integers (like atoms in chemistry)
- **GCD/LCM**: Finding common patterns and relationships
- **Modular arithmetic**: Dealing with cycles and remainders (like clock arithmetic)

**Key Insight**: Mathematical algorithms often have **elegant optimizations** that can turn O(n) solutions into O(log n) or O(√n)

### 📖 **Prime Numbers - The Fundamental Building Blocks:**

```
🎯 WHAT MAKES PRIMES SPECIAL:
- Every integer > 1 is either prime or product of primes
- Used in cryptography (RSA encryption)
- No efficient formula to generate them
- Distribution becomes sparser as numbers get larger

PRIME CHECKING OPTIMIZATIONS:
❌ Naive: Check all numbers 2 to n-1 → O(n)
✅ Smart: Check only up to √n → O(√n)
✅ Smarter: Skip even numbers after 2 → O(√n/2)
✅ Smartest: Use Sieve of Eratosthenes for multiple primes → O(n log log n)

WHY √n WORKS:
If n has a divisor > √n, it must also have one < √n
Example: 36 = 6 × 6, if we find 6, we know 36 isn't prime
```

### 🔍 **Prime Checking - Step-by-Step Optimization:**

```python
def is_prime_optimized(n):
    """
    🎯 OPTIMIZED PRIME CHECK:
    1. Handle edge cases (< 2, even numbers)
    2. Check only odd divisors up to √n
    3. Early termination on first divisor found
    
    Time: O(√n) instead of O(n)
    """
    if n < 2:
        return False
    if n == 2:
        return True  # Only even prime
    if n % 2 == 0:
        return False  # All other even numbers are composite
    
    # Check odd divisors from 3 to √n
    import math
    sqrt_n = int(math.sqrt(n))
    
    for i in range(3, sqrt_n + 1, 2):  # Only odd numbers
        if n % i == 0:
            return False  # Found a divisor
    
    return True

# VISUAL TRACE for n = 97:
# √97 ≈ 9.8, so check divisors up to 9
# Check: 3, 5, 7, 9
# 97 % 3 = 1 ≠ 0 ✓
# 97 % 5 = 2 ≠ 0 ✓  
# 97 % 7 = 6 ≠ 0 ✓
# 97 % 9 = 7 ≠ 0 ✓
# No divisors found → 97 is prime!
```

### 🚀 **Sieve of Eratosthenes - Finding All Primes Efficiently:**

```python
def sieve_of_eratosthenes(limit):
    """
    🎯 SIEVE ALGORITHM:
    1. Start with all numbers marked as potentially prime
    2. For each prime p, mark all multiples of p as composite
    3. Next unmarked number is guaranteed to be prime
    
    WHY IT WORKS:
    - If a number n is composite, it has a prime factor ≤ √n
    - By the time we reach n, all its prime factors have already 
      eliminated it from consideration
    
    Time: O(n log log n) - much faster than checking each individually!
    """
    if limit < 2:
        return []
    
    # Initialize: assume all numbers are prime
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False  # 0 and 1 are not prime
    
    for i in range(2, int(limit**0.5) + 1):
        if is_prime[i]:  # i is prime
            # Mark all multiples of i as composite
            for j in range(i*i, limit + 1, i):
                is_prime[j] = False
    
    # Collect all prime numbers
    return [i for i in range(2, limit + 1) if is_prime[i]]

# VISUAL TRACE for limit = 30:
# Initial: [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T]
#          0 1 2 3 4 5 6 7 8 9 ...
# 
# Process 2: Mark 4,6,8,10,12,14,16,18,20,22,24,26,28,30 as composite
# Process 3: Mark 9,15,21,27 as composite (6,12,18,24,30 already marked)
# Process 5: Mark 25 as composite (10,15,20,25,30 already marked)
# 
# Result: [2,3,5,7,11,13,17,19,23,29]
```

### 🎯 **GCD & LCM - Finding Common Factors:**

```python
def gcd_euclidean(a, b):
    """
    🎯 EUCLIDEAN ALGORITHM:
    Based on principle: gcd(a,b) = gcd(b, a mod b)
    
    WHY IT WORKS:
    Any common divisor of a and b also divides (a mod b)
    Keep reducing until one number becomes 0
    
    VISUAL TRACE for gcd(48, 18):
    gcd(48, 18) = gcd(18, 48%18) = gcd(18, 12)
    gcd(18, 12) = gcd(12, 18%12) = gcd(12, 6)  
    gcd(12, 6)  = gcd(6, 12%6)  = gcd(6, 0)
    gcd(6, 0)   = 6
    
    Time: O(log min(a,b)) - very fast!
    """
    while b:
        print(f"gcd({a}, {b}) = gcd({b}, {a % b})")
        a, b = b, a % b
    return a

def lcm(a, b):
    """
    🎯 LCM USING GCD:
    lcm(a,b) = (a × b) / gcd(a,b)
    
    WHY THIS WORKS:
    LCM contains all prime factors with highest powers
    GCD contains common prime factors with lowest powers
    Their relationship: a × b = gcd(a,b) × lcm(a,b)
    """
    return abs(a * b) // gcd_euclidean(a, b)
```
    
    for i in range(2, n):
        print(f"  Checking if {n} is divisible by {i}")
        if n % i == 0:
            print(f"  {n} ÷ {i} = {n//i}, so {n} is NOT prime")
            return False
        print(f"  {n} ÷ {i} = {n/i} (not divisible)")
    
    print(f"  No divisors found, {n} IS prime")
    return True

def is_prime_optimized(n):
    """Optimized prime check - only check up to √n"""
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    
    import math
    sqrt_n = int(math.sqrt(n))
    print(f"Checking if {n} is prime (only checking up to √{n} = {sqrt_n}):")
    
    for i in range(3, sqrt_n + 1, 2):  # Only check odd numbers
        print(f"  Checking divisibility by {i}")
        if n % i == 0:
            print(f"  {n} ÷ {i} = {n//i}, so {n} is NOT prime")
            return False
    
    print(f"  No divisors found up to √{n}, {n} IS prime")
    return True

# Test prime checking
test_numbers = [17, 25, 29, 100]
for num in test_numbers:
    print(f"\nTesting {num}:")
    result = is_prime_optimized(num)
    print(f"Result: {num} is {'prime' if result else 'not prime'}\n")
```

### Sieve of Eratosthenes:
```python
def sieve_of_eratosthenes(limit):
    """Find all primes up to limit using Sieve of Eratosthenes"""
    print(f"Finding all primes up to {limit} using Sieve of Eratosthenes:")
    
    # Create boolean array and initialize all as prime
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False  # 0 and 1 are not prime
    
    print(f"Initial array (True means potentially prime): {is_prime[:min(20, len(is_prime))]}")
    
    p = 2
    while p * p <= limit:
        if is_prime[p]:
            print(f"\nMarking multiples of {p} as non-prime:")
            
            # Mark all multiples of p as non-prime
            for i in range(p * p, limit + 1, p):
                if is_prime[i]:  # Only print if we're marking it for first time
                    print(f"  Marking {i} = {p} × {i//p} as non-prime")
                is_prime[i] = False
        
        p += 1
    
    # Collect all prime numbers
    primes = [i for i in range(2, limit + 1) if is_prime[i]]
    print(f"\nPrimes up to {limit}: {primes}")
    return primes

# Test sieve
primes_up_to_30 = sieve_of_eratosthenes(30)
```

## 🎯 Pattern 2: GCD and LCM

### Greatest Common Divisor (GCD):
```
GCD(a, b) = largest number that divides both a and b

Example: GCD(48, 18)
48 = 2⁴ × 3¹
18 = 2¹ × 3²
GCD = 2¹ × 3¹ = 6

Visual representation:
48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48
18: 1, 2, 3, 6, 9, 18
Common divisors: 1, 2, 3, 6
Greatest: 6
```

### Euclidean Algorithm:
```python
def gcd_euclidean(a, b):
    """Calculate GCD using Euclidean algorithm"""
    print(f"Finding GCD of {a} and {b} using Euclidean algorithm:")
    
    original_a, original_b = a, b
    step = 1
    
    while b != 0:
        remainder = a % b
        quotient = a // b
        
        print(f"Step {step}: {a} = {b} × {quotient} + {remainder}")
        print(f"         GCD({a}, {b}) = GCD({b}, {remainder})")
        
        a, b = b, remainder
        step += 1
    
    print(f"\nWhen remainder becomes 0, GCD({original_a}, {original_b}) = {a}")
    return a

def gcd_recursive(a, b):
    """Recursive GCD implementation"""
    if b == 0:
        return a
    return gcd_recursive(b, a % b)

def lcm(a, b):
    """Calculate LCM using the formula: LCM(a,b) = (a×b)/GCD(a,b)"""
    gcd_val = gcd_euclidean(a, b)
    lcm_val = (a * b) // gcd_val
    
    print(f"\nLCM({a}, {b}) = ({a} × {b}) ÷ GCD({a}, {b})")
    print(f"LCM({a}, {b}) = {a * b} ÷ {gcd_val} = {lcm_val}")
    
    return lcm_val

# Test GCD and LCM
print("Testing GCD and LCM:")
a, b = 48, 18
gcd_result = gcd_euclidean(a, b)
lcm_result = lcm(a, b)
```

## 🎯 Pattern 3: Modular Arithmetic

### Basic Modular Operations:
```python
def modular_arithmetic_demo():
    """Demonstrate modular arithmetic properties"""
    a, b, m = 23, 17, 5
    
    print(f"Modular arithmetic with a={a}, b={b}, mod={m}:")
    print(f"a mod m = {a} mod {m} = {a % m}")
    print(f"b mod m = {b} mod {m} = {b % m}")
    
    # Addition
    add_result = (a + b) % m
    add_mod_result = ((a % m) + (b % m)) % m
    print(f"\nAddition:")
    print(f"(a + b) mod m = ({a} + {b}) mod {m} = {add_result}")
    print(f"((a mod m) + (b mod m)) mod m = {add_mod_result}")
    print(f"Both methods give same result: {add_result == add_mod_result}")
    
    # Multiplication
    mul_result = (a * b) % m
    mul_mod_result = ((a % m) * (b % m)) % m
    print(f"\nMultiplication:")
    print(f"(a × b) mod m = ({a} × {b}) mod {m} = {mul_result}")
    print(f"((a mod m) × (b mod m)) mod m = {mul_mod_result}")
    print(f"Both methods give same result: {mul_result == mul_mod_result}")

def power_mod(base, exp, mod):
    """Calculate (base^exp) % mod efficiently"""
    print(f"Calculating ({base}^{exp}) mod {mod} using fast exponentiation:")
    
    result = 1
    base = base % mod
    
    step = 1
    while exp > 0:
        print(f"Step {step}: exp={exp} (binary: {bin(exp)}), base={base}, result={result}")
        
        if exp % 2 == 1:  # If exp is odd
            result = (result * base) % mod
            print(f"  Exp is odd, multiply result: result = {result}")
        
        exp = exp >> 1  # Divide exp by 2
        base = (base * base) % mod  # Square the base
        print(f"  New exp: {exp}, new base: {base}")
        
        step += 1
    
    print(f"Final result: {result}")
    return result

modular_arithmetic_demo()
print("\n" + "="*50 + "\n")
power_mod(3, 10, 7)
```

## 🎯 Pattern 4: Factorial and Combinations

### Factorial Calculations:
```python
def factorial_iterative(n):
    """Calculate factorial iteratively"""
    print(f"Calculating {n}! iteratively:")
    
    if n < 0:
        return None
    if n <= 1:
        return 1
    
    result = 1
    calculation_steps = []
    
    for i in range(2, n + 1):
        result *= i
        calculation_steps.append(f"{i}")
        print(f"  Step {i-1}: {' × '.join(calculation_steps)} = {result}")
    
    return result

def factorial_recursive(n):
    """Calculate factorial recursively with visualization"""
    def factorial_helper(n, depth=0):
        indent = "  " * depth
        print(f"{indent}factorial({n})")
        
        if n <= 1:
            print(f"{indent}Base case: factorial({n}) = 1")
            return 1
        
        result = n * factorial_helper(n - 1, depth + 1)
        print(f"{indent}factorial({n}) = {n} × factorial({n-1}) = {result}")
        return result
    
    print(f"Calculating {n}! recursively:")
    return factorial_helper(n)

def combinations(n, r):
    """Calculate C(n,r) = n! / (r! × (n-r)!)"""
    print(f"Calculating C({n},{r}) = {n}! / ({r}! × {n-r}!)")
    
    if r > n or r < 0:
        return 0
    
    if r == 0 or r == n:
        return 1
    
    # Optimize by using smaller factorial
    r = min(r, n - r)
    
    numerator = 1
    denominator = 1
    
    print(f"Optimized calculation (using r = {r}):")
    
    for i in range(r):
        numerator *= (n - i)
        denominator *= (i + 1)
        print(f"  Step {i+1}: numerator = {numerator}, denominator = {denominator}")
    
    result = numerator // denominator
    print(f"C({n},{r}) = {result}")
    return result

# Test factorial and combinations
print("Testing factorial:")
factorial_iterative(5)
print("\n" + "="*30 + "\n")
factorial_recursive(5)
print("\n" + "="*30 + "\n")
combinations(5, 2)
```

## 🎯 Pattern 5: Fibonacci Sequence

### Different Approaches to Fibonacci:
```python
def fibonacci_recursive(n):
    """Naive recursive Fibonacci (inefficient)"""
    if n <= 1:
        return n
    return fibonacci_recursive(n-1) + fibonacci_recursive(n-2)

def fibonacci_memoized(n, memo={}):
    """Memoized recursive Fibonacci"""
    if n in memo:
        return memo[n]
    
    if n <= 1:
        memo[n] = n
        return n
    
    memo[n] = fibonacci_memoized(n-1, memo) + fibonacci_memoized(n-2, memo)
    return memo[n]

def fibonacci_iterative(n):
    """Iterative Fibonacci with visualization"""
    print(f"Calculating Fibonacci({n}) iteratively:")
    
    if n <= 1:
        return n
    
    a, b = 0, 1
    print(f"F(0) = {a}")
    print(f"F(1) = {b}")
    
    for i in range(2, n + 1):
        c = a + b
        print(f"F({i}) = F({i-2}) + F({i-1}) = {a} + {b} = {c}")
        a, b = b, c
    
    return b

def fibonacci_matrix(n):
    """Matrix exponentiation method for Fibonacci"""
    def matrix_multiply(A, B):
        """Multiply two 2x2 matrices"""
        return [[A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
                [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]]
    
    def matrix_power(matrix, power):
        """Calculate matrix^power using fast exponentiation"""
        if power == 1:
            return matrix
        
        if power % 2 == 0:
            half_power = matrix_power(matrix, power // 2)
            return matrix_multiply(half_power, half_power)
        else:
            return matrix_multiply(matrix, matrix_power(matrix, power - 1))
    
    if n <= 1:
        return n
    
    # Fibonacci matrix: [[1,1], [1,0]]
    fib_matrix = [[1, 1], [1, 0]]
    result_matrix = matrix_power(fib_matrix, n)
    
    return result_matrix[0][1]

# Test different Fibonacci implementations
n = 10
print(f"Fibonacci({n}) using different methods:")
print(f"Iterative: {fibonacci_iterative(n)}")
print(f"Memoized: {fibonacci_memoized(n)}")
print(f"Matrix: {fibonacci_matrix(n)}")
```

## 🎯 Pattern 6: Number Palindromes and Digit Manipulation

### Palindromic Numbers:
```python
def is_number_palindrome(n):
    """Check if a number is palindromic"""
    original = n
    reversed_num = 0
    
    print(f"Checking if {n} is a palindrome:")
    
    while n > 0:
        digit = n % 10
        reversed_num = reversed_num * 10 + digit
        n //= 10
        print(f"  Extracted digit: {digit}, Reversed so far: {reversed_num}, Remaining: {n}")
    
    is_palindrome = original == reversed_num
    print(f"Original: {original}, Reversed: {reversed_num}")
    print(f"Is palindrome: {is_palindrome}")
    
    return is_palindrome

def reverse_number(n):
    """Reverse digits of a number"""
    reversed_num = 0
    sign = 1 if n >= 0 else -1
    n = abs(n)
    
    while n > 0:
        reversed_num = reversed_num * 10 + n % 10
        n //= 10
    
    return reversed_num * sign

def sum_of_digits(n):
    """Calculate sum of digits"""
    total = 0
    original = n
    
    print(f"Calculating sum of digits for {n}:")
    
    while n > 0:
        digit = n % 10
        total += digit
        n //= 10
        print(f"  Digit: {digit}, Sum so far: {total}, Remaining: {n}")
    
    print(f"Sum of digits of {original} = {total}")
    return total

def digital_root(n):
    """Calculate digital root (keep summing digits until single digit)"""
    print(f"Calculating digital root of {n}:")
    
    while n >= 10:
        n = sum_of_digits(n)
        print(f"  New number: {n}")
    
    print(f"Digital root: {n}")
    return n

# Test number manipulation functions
test_numbers = [12321, 12345, 9875]

for num in test_numbers:
    print(f"\nTesting {num}:")
    is_number_palindrome(num)
    digital_root(num)
    print()
```

## 📊 Mathematical Algorithm Complexities

```
Algorithm               Time Complexity    Space Complexity
Basic Prime Check       O(n)              O(1)
Optimized Prime Check   O(√n)             O(1)
Sieve of Eratosthenes   O(n log log n)    O(n)
Euclidean GCD           O(log min(a,b))   O(1)
Fast Exponentiation     O(log n)          O(1)
Factorial (iterative)   O(n)              O(1)
Fibonacci (naive)       O(2^n)            O(n)
Fibonacci (iterative)   O(n)              O(1)
Fibonacci (matrix)      O(log n)          O(1)
```

## 🎯 Practice Problems

### Easy:
1. **Palindrome Number** (LeetCode 9)
2. **Happy Number** (LeetCode 202)
3. **Power of Three** (LeetCode 326)
4. **Reverse Integer** (LeetCode 7)

### Medium:
1. **Pow(x, n)** (LeetCode 50)
2. **Count Primes** (LeetCode 204)
3. **Ugly Number II** (LeetCode 264)
4. **Perfect Squares** (LeetCode 279)

### Hard:
1. **Super Ugly Number** (LeetCode 313)
2. **Largest Palindrome Product** (LeetCode 479)
3. **Integer to English Words** (LeetCode 273)

## 📝 Quick Templates

### Fast Exponentiation:
```python
def power_mod(base, exp, mod):
    result = 1
    base %= mod
    while exp > 0:
        if exp & 1:
            result = (result * base) % mod
        exp >>= 1
        base = (base * base) % mod
    return result
```

### GCD Template:
```python
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a
```

### Prime Check Template:
```python
def is_prime(n):
    if n < 2: return False
    if n == 2: return True
    if n % 2 == 0: return False
    
    for i in range(3, int(n**0.5) + 1, 2):
        if n % i == 0:
            return False
    return True
```

This comprehensive guide covers all essential number theory and mathematical algorithms with detailed explanations and visualizations!
